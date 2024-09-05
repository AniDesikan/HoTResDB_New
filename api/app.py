import time
from flask import Flask, request, jsonify
from typing import List, Dict, Tuple

app = Flask(__name__)
UPLOAD_FOLDER = '/var/www/html/hotresdb/src/csvs'
ALLOWED_EXTENSIONS = {'csv'}

import pymysql
import cgi
import cgitb
import sys
import json
import os
import re
import math
import hashlib
import pandas as pd


cgitb.enable()

# #----FUNCTIONS----# #

def connect_db():
        # connect to database
        connection = pymysql.connect()
        # get cursor
        cursor = connection.cursor()

        return cursor, connection


################# ADD GENES FUNCTIONS #################
def getGeneNames(searchTerms):
    cursor, connection = connect_db()
    convert_dict = {
        "HumangenePart": "WikiGene_Name_human",
        "MMUgenePart": "WikiGene_Name_MMU",
        "DescgenePart": "WikiGene_Description",
        "GOPart": "GO_category"
    }
    bool_dict = {
        "AND": [" AND ", " LIKE "],
        "OR": [" OR ", " LIKE "],
        "NOT": [" AND ", " NOT LIKE "]
    }
    query_where = ""

    # Parse searchTerms and construct SQL query
    for idx, term in enumerate(searchTerms):
        category_key = term['searchCategory']
        category = convert_dict[category_key]
        part = f"\"%{term['searchValue']}%\""
        
        if idx == 0:
            query_where = f"WHERE {category} LIKE {part}"
        else:
            bool_operator = term['booleanOperator']
            bool_condition = bool_dict[bool_operator][0]
            comparison = bool_dict[bool_operator][1]
            query_where += f"{bool_condition}{category}{comparison}{part}"

    # Define SQL queries
    query_select_GO = (
        "SELECT DISTINCT ensembl_MMU, ensembl_human, WikiGene_Name_MMU, WikiGene_Name_human, "
        "WikiGene_Description"
        "FROM GENES "
        # "INNER JOIN GO_TERM ON ensembl_MMU = ensembl "
    )
    query_select_NoGO = (
        "SELECT DISTINCT ensembl_MMU, ensembl_human, WikiGene_Name_MMU, WikiGene_Name_human, "
        "WikiGene_Description "
        "FROM GENES "
    )
    query_groupby = " GROUP BY GID;"

    # Construct the final query
    if "GO_category" in query_where:
        query = query_select_GO + query_where + query_groupby
    else:
        query = query_select_NoGO + query_where + query_groupby

    # Execute the query and fetch results
    cursor.execute(query)
    results = cursor.fetchall()

    # Close cursor and connection
    cursor.close()
    connection.close()

    return results

def getFields(table):
        cursor, connection = connect_db()
        query = """
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'hotresdb'
        AND TABLE_NAME = %s;
        """
        
        # Execute the query
        cursor.execute(query, (table,))
        
        # Fetch all the column names
        columns = cursor.fetchall()

        return columns

################# ADD DATASETS FUNCTIONS #################
def getDatasets(virus, strain, species, sequencing_type, approved):
    cursor, connection = connect_db()
    
    # Base query, the 1=1 is so that the WHERE doesn't break when there's nothing there
    # If approved, have it left join on pubid, otherwise have it join on pubid
    # That way people who are approved can see unpublished data, while people who aren't can't
    query_approved = """
    SELECT VIRUS, STRAIN, SPECIES, TISSUE_TYPE, EXPOSURE_ROUTE, STUDY_NAME
    FROM EXPERIMENT e left join PUBLICATION p on e.PUBID = p.PUBID
    WHERE VIRUS IS NOT NULL 
    """

    query_unapproved = """
    SELECT VIRUS, STRAIN, SPECIES, TISSUE_TYPE, EXPOSURE_ROUTE, STUDY_NAME
    FROM EXPERIMENT e left join PUBLICATION p on e.PUBID = p.PUBID
    WHERE VIRUS IS NOT NULL and APPROVAL = 1
    """
    
    # Parameters list
    params = []
    if approved == "Yes":
        query = query_approved
    else:
        query = query_unapproved
    # Add conditions dynamically
    if virus is not None and virus != "All":
        query += " AND VIRUS = %s"
        params.append(virus)

    if strain is not None:
        query += " AND STRAIN = %s"
        params.append(strain)
    
    if species is not None:
        query += " AND SPECIES = %s"
        params.append(species)

    if sequencing_type is not None:
        query += " AND SEQUENCING_TYPE = %s"
        params.append(sequencing_type)
        
    # Execute the query with the appropriate parameters
    cursor.execute(query, tuple(params))
    
    # Fetch all the datasets
    datasets = cursor.fetchall()

    # Close the connection
    cursor.close()
    connection.close()

    return datasets


def disconnect_db(cursor, connection):
        # close cursor and connection
        cursor.close()
        connection.close()




################# GENES TABLE FUNCTIONS ##################
def getGID(geneList, not_in_db):
    
    """
    PURPOSE: Get unique integer GIDs for each gene in genelist

    INPUTS:
    genelist - list of gene symbols or ensembl ids. Can be mixed
    not_in_db - running total of things not found in the database

    OUTPUT:
    geneDict - Dictionary of gene symbols where {gid: ensembl or symbol}
    """
    cursor, connection = connect_db()
    geneDict = {}
    query = """
    SELECT GID
    FROM GENES
    WHERE ensembl_human LIKE %s OR ensembl_MMU LIKE %s OR WikiGene_Name_human LIKE %s OR WikiGene_Name_MMU LIKE %s;
    """

    for gene in geneList:
        cursor.execute(query, (gene, gene, gene, gene))
        rows = cursor.fetchall()
        if rows:
            for row in rows:
                # make gid key and gene name value
                # {gid : ensembl or symbol}
                geneDict[row[0]] = gene
        else:
            not_in_db.append([gene, "Gene not in database"])
    return geneDict

def gene_summary(geneDict: Dict[int, str]) -> List[Tuple[int, str, str, str, str]]:
    """
    PURPOSE: Get summaries for each gene in geneDict

    INPUT:
    geneDict - Dictionary of gene symbols where {gid: ensembl or symbol}

    OUTPUT:
    gene_table - List of tuples with gene information
    """
    cursor, connection = connect_db()
    gene_table = []
    query = """
    SELECT ensembl_human, WikiGene_Name_human, ensembl_MMU, WikiGene_Name_MMU
    FROM GENES
    WHERE GID = %s;
    """

    for gid in geneDict:
        try:
            cursor.execute(query, (gid,))
            row = cursor.fetchone()
            if row:
                gene_table.append(row)
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            # You might want to handle errors here

    return gene_table

################# COUNTS TABLE FUNCTIONS ##################

# In order to get the counts table functions, we have to first get the samples for the experiments in the query
# Each Patient is associated with an Experiment ID (EID) and each Sample is associated with a Patient ID (PID)
# So in order to get the data, we join all of these tables, and select for the EID, which is given by user


def getMaxDPI(samples, survival_status):
        #PURPOSE: Data tables in user-side results requires DPI appended based on studies searched. They don't all have the same DPI, 
        #so this will check for the maximum DPI value and create an array to be appended to the table on HTML side
        cursor, connection = connect_db()
        maxDPI = 0
        for samplename in samples:
                # survival = "" if survival_status else "AND survival LIKE \"died\""
                if survival_status:
                    query = """
                        SELECT max(DPI)
                        FROM PATIENT JOIN SAMPLE using (PID) JOIN EXPERIMENT using(EID)
                        WHERE STUDY_NAME = %s;
                        """
                else:
                    query = """
                        SELECT max(DPI)
                        FROM PATIENT JOIN SAMPLE using (PID) JOIN EXPERIMENT using(EID)
                        WHERE STUDY_NAME = %s AND survival LIKE \"died\";
                        """

                cursor.execute(query, (samplename))
                row = cursor.fetchone()
                if row[0] > maxDPI:
                        maxDPI = row[0]
        # DPI_list = [n for n in range(-8, maxDPI + 1)]
        DPI_list = [n for n in range(maxDPI + 1)]
        return DPI_list

# Now that we have the DPI_List, we can get the counts themselves
def getCountsTable(geneList, DPI_list, studies, noresults, survival_status):
        """
        # PURPOSE: To get the counts data for RNASeq studies in JSON and table formats
        #
        # INPUTS:
        # geneDict      - Dictionary of gene symbols, {gid: ensembl or symbol}
        # DPI_list      - list of days you want to look at
        # studies       - list of studies you want to look at
        # noresults     - list of genes without data
        # survival_status      - survival status, true = include survive or delayed, false = only died
        #
        # OUTPUTS:
        # results       - table for output visualization
        # table         - table for output
        # noresults     - list of things without data
        #
        #OVERVIEW of Steps:
        # - Query for:
        #               average expression level at each DPI
        #               standard deviation of that expression level at each DPI
        #               number of different expression levels for that DPI for later calculations based on study, sequencing type, and gid for each (survival if applicable) --- huh???
        # - Initialize DPI at 0 in order to place studies in standard format
        # - If there are results, start adding data (skipping DPI indexes where there is no data for that particular search)
        # - For error bars, calculate standard error based on the standard deviation and the square root of counts for each DPI. Refer to Google for standard error formula
        # - Perform LOG2 standardization on both the counts and the standard error. Log of 0 is undefined, but 0 values are given instead to show that tests were done at that DPI but no counts were obtained.
        # - append data to highcharts JSON object and table for each DPI found for highcharts visualization -- line charts
        """
        cursor, connection = connect_db()
        seq_format = "RNAseq"
        results = []
        table = []
        geneDict = getGID(geneList, noresults)
        for gid in geneDict:
                gene = geneDict[gid]
                #initialize temporary dictionary with highcharts format
                for study in studies:
                        # survival = "" if survival_status else "AND survival LIKE \"died\""
                        if survival_status:
                                query = """
                                SELECT DPI, avg(expression), virus, std(expression), count(expression), strain
                                FROM GENES JOIN RNAseq using(gid) JOIN SAMPLE USING (sid) JOIN PATIENT USING (pid) JOIN EXPERIMENT USING (EID)
                                WHERE gid = %s AND Study_Name LIKE %s and DPI >= 0
                                GROUP BY DPI, virus, strain
                                ORDER BY DPI;"""
                        else:
                                query = """
                                SELECT DPI, avg(expression), virus, std(expression), count(expression), strain
                                FROM GENES JOIN RNAseq using(gid) JOIN SAMPLE USING (sid) JOIN PATIENT USING (pid) JOIN EXPERIMENT USING (EID)
                                WHERE gid = %s AND Study_Name LIKE %s AND DPI >= 0 
                                GROUP BY DPI, virus, strain
                                ORDER BY DPI;"""
                        #get results
                        cursor.execute(query, (gid, "%" + study + "%"))
                        rows = cursor.fetchall()
                        #increment DPI in DPI list and add counts to JSON object
                        # DPI = -9
                        DPI = 0
                        counts = []
                        countserror = []

                        if rows:
                                for row in rows:
                                        # This loop accounts for missing data for each day,
                                        # simply moving onto the next day that does have data
                                        while DPI_list[DPI] != row[0]: # consider changing to just `DPI != row[0]`
                                                counts.append(None)
                                                countserror.append(None)
                                                DPI += 1
                                        conv = float(row[1])

                                        #GET SE
                                        sd = float(row[3])
                                        n = float(row[4])
                                        nsq = math.sqrt(n)
                                        logmin = 0
                                        logmax = 0
                                        if sd != 0:
                                                se = sd/nsq
                                                minimum = conv - se
                                                logmin = math.log(minimum,2)
                                                maximum = conv + se
                                                logmax = math.log(maximum,2)
                                        errorbar = []
                                        logconv = 0
                                        if conv != 0:
                                                logconv = math.log(conv, 2)
                                        counts.append(logconv)
                                        errorbar.append(logmin)
                                        errorbar.append(logmax)
                                        countserror.append(errorbar)

                                        DPI +=1
                                        virus = row[2]
                                        strain = row[5]

                                if len(counts) > 0:
                                        temp = {'name':gene + '_' + study + '_' + seq_format + ('_SURVIVORS' if survival_status else ''),
                                                        'data':counts}
                                        results.append(temp)
                                        temperror = {'name':gene + '_' + study + '_' + seq_format + '_error'  + ('_SURVIVORS' if survival_status else ''),
                                                                 'type':'errorbar',
                                                                 'data':countserror}
                                        results.append(temperror)
                                        tblrow = [gene, virus, seq_format, strain, study]
                                        tblrowfull = tblrow + [round(x, 2) if x is not None else None for x in counts]  # Round all counts to two decimal places
                                        table.append(tblrowfull)
                        if not cursor.rowcount:
                                noName = gene + '_' + study
                                if noName not in noresults:
                                        noresults.append(noName)

        return results, table, noresults
    
################# FOLD CHANGE TABLE FUNCTIONS #################

import math

def FCQUERY_virus(gene_list, dpi_list, studies, include_survivor_data, heatmap_x_axis):
    """
    PURPOSE: To get the fold change data for RNASeq studies in JSON and table formats.
    This function generates fold change values, constructs heat map data, and formats results for HighCharts.

    INPUTS:
    gene_dict (dict): Dictionary of gene symbols, {gid: ensembl or symbol}
                      Example: {1: 'BRCA1', 2: 'TP53'}
    dpi_list (list): List of DPIs (Days Post Infection) from 0 to the maximum DPI of all studies in the search
                     Example: [0, 1, 3, 7, 14]
    studies (list): List of study names that match the search parameters
                    Example: ['Study_A', 'Study_B']
    include_survivor_data (bool): True if user chose to view survivor data, False otherwise
    heatmap_x_axis (list): List of study + DPI terms to be used in the heat map x-axis
                           Example: []

    OUTPUTS:
    results (list): Results formatted into JSON objects for HighCharts
    table (list): Results formatted in 2D-array format for a data table
    heat_map_sortedby_study (list): Heat map data sorted by study
    heat_map_cats_sortedby_study (list): Categories for the heat map sorted by study
    heatmap_x_axis (list): Updated heat map x-axis
    """
    cursor, connection = connect_db()
    noresults = []
    gene_dict = getGID(gene_list, noresults)
    results = []
    table = []
    seq_format = "RNAseq"

    # Initialize heat map data
    heat_map_sortedby_study = []
    heat_map_cats_sortedby_study = []
    gene_list_for_heatmap = []

    # Collect all genes for the heat map categories
    for gene_id in gene_dict:
        gene_list_for_heatmap.append(gene_dict[gene_id])

    for study in studies:
        study_heatmap_data = []
        study_heatmap_data_survivors = []
        data_found = False
        survival_conditions = [" AND survival LIKE 'died'"]
        if include_survivor_data:
            survival_conditions.append(" AND (survival LIKE 'survived' OR survival LIKE 'delayed')")

        for survival_condition in survival_conditions:
            for gene_id in gene_dict:
                gene = gene_dict[gene_id]
                fold_changes = []
                dpi_index = 0
                heatmap_y = 0
                day_zero_expression = 0
                found_day_zero = False

                # Execute the appropriate query based on survival status
                if survival_condition == " AND survival LIKE 'died'":
                    query = """
                        SELECT DPI, AVG(expression), virus, strain
                        FROM GENES
                        JOIN RNAseq USING(gid)
                        JOIN SAMPLE USING(sid)
                        JOIN PATIENT USING(pid)
                        JOIN EXPERIMENT USING(EID)
                        WHERE gid = %s AND Study_Name LIKE %s AND DPI >= 0 AND survival LIKE 'died'
                        GROUP BY DPI, virus, strain
                        ORDER BY DPI;
                    """
                    cursor.execute(query, [gene_id, f"%{study}%"])
                else:
                    query = """
                        SELECT DPI, AVG(expression), virus, strain
                        FROM GENES
                        JOIN RNAseq USING(gid)
                        JOIN SAMPLE USING(sid)
                        JOIN PATIENT USING(pid)
                        JOIN EXPERIMENT USING(EID)
                        WHERE gid = %s AND Study_Name LIKE %s AND DPI >= 0 AND (survival LIKE 'survived' OR survival LIKE 'delayed')
                        GROUP BY DPI, virus, strain
                        ORDER BY DPI;
                    """
                    cursor.execute(query, [gene_id, f"%{study}%"])

                rows = cursor.fetchall()
                for row in rows:
                    if row[0] < 0:
                        continue
                    if row[0] == 0:
                        day_zero_expression = float(row[1])
                        found_day_zero = True
                    elif not found_day_zero:
                        while dpi_list[dpi_index] != row[0]:
                            fold_changes.append(None)
                            dpi_index += 1
                        if dpi_list[dpi_index] == row[0]:
                            day_zero_expression = float(row[1])
                            found_day_zero = True

                    while dpi_list[dpi_index] != row[0]:
                        fold_changes.append(None)
                        dpi_index += 1

                    current_expression = float(row[1])
                    if current_expression != 0 and day_zero_expression != 0:
                        fold_change = current_expression / day_zero_expression
                        logged_fc = math.log(fold_change, 2)
                    else:
                        logged_fc = 0
                    fold_changes.append(round(logged_fc, 2))

                    study_dpi_term = study + ('_survivors_' if (survival_condition != survival_conditions[0]) else "") + "_day_" + str(dpi_list[dpi_index])
                    heatmap_entry = [heatmap_x_axis.index(study_dpi_term) if study_dpi_term in heatmap_x_axis else len(heatmap_x_axis),
                                     heatmap_y, logged_fc, study_dpi_term, gene]
                    if survival_condition == survival_conditions[0]:
                        study_heatmap_data.append(heatmap_entry)
                    else:
                        study_heatmap_data_survivors.append(heatmap_entry)

                    if study_dpi_term not in heatmap_x_axis:
                        heatmap_x_axis.append(study_dpi_term)
                    dpi_index += 1
                    virus = row[2]
                    strain = row[3]
                    data_found = True

                if fold_changes:
                    results.append({'name': f"{gene}_{study}", 'data': fold_changes})
                    table.append([gene, virus, seq_format, strain, study] + fold_changes)
            
            if data_found:
                heat_map_sortedby_study.append(study_heatmap_data)
                heat_map_sortedby_study.append(study_heatmap_data_survivors)
    
    heat_map_cats_sortedby_study.append(gene_list_for_heatmap)

    return results, table, heat_map_sortedby_study, heat_map_cats_sortedby_study, heatmap_x_axis

################################################
# ENTER DATA FUNCTIONS
################################################

#######
# Function to get the EID from a study name in the EXPERIMENT table

def get_EID(study):
        cursor, connection = connect_db()
        query = """
        SELECT EID
        FROM EXPERIMENT
        WHERE STUDY_NAME = %s
        """
        try:
                cursor.execute(query, (study,))
                result = cursor.fetchone()
                if result:
                        return result[0]
        except pymysql.Error as e: 
                print(e, query)
                return None


#######
# Function to get the PubID from a paper name in the PAPERS table

def get_PUBID(title):
        cursor, connection = connect_db()
        query = """
        SELECT PUBID
        FROM PUBLICATION
        WHERE TITLE = %s
        """
        try:
                cursor.execute(query, (title,))
                result = cursor.fetchone()
                if result:
                        return result[0]
                else:
                        return None
        except pymysql.Error as e: 
                print(e, query)
                return None
######
# Function to check that this sample_id hasn't been entered before, and also to enter into database
def get_SID(sample_id):
        cursor, connection = connect_db()
        query = """
        SELECT SID
        FROM SAMPLE
        WHERE sample_id = %s
        """
        try:
                cursor.execute(query, (sample_id,))
                # cursor.execute(query)
                result = cursor.fetchone()
                if result:
                        return result[0]
                else:
                        return None
        except pymysql.Error as e: 
                print(e, query)
                return None

def get_Nanostring_SID(sample_id):
        cursor, connection = connect_db()
        query = """
        SELECT SID
        FROM NANOSTRING_SAMPLES
        WHERE Sample_ID = %s
        """
        try:
                cursor.execute(query, (sample_id,))
                # cursor.execute(query)
                result = cursor.fetchone()
                if result:
                        return result[0]
                else:
                        return None
        except pymysql.Error as e: 
                print(e, query)
                return None

# Functions to get GID and ensembl_ID for entering RNA sequencing data into the database
def get_bulk_GID(gene_list):
    cursor, connection = connect_db()
    query = """
    SELECT GID, ensembl_MMU
    FROM GENES
    WHERE WikiGene_Name_MMU in %s
    """
    try:
        cursor.execute(query, (gene_list,))
        result = cursor.fetchall()
        if result:
            # Flatten the list of tuples to a list of integers
            GID_list = [gid[0] for gid in result]
            ensembl_list = [gid[1] for gid in result]
            return GID_list, ensembl_list
        else:
            return None
    except pymysql.Error as e: 
        print(e, query)
        return None

def insert_names_into_genes(gene_list):
    query = """
    INSERT INTO GENES (WikiGene_Name_MMU)
    VALUES (%s)
    ON DUPLICATE KEY UPDATE ensembl_human = VALUES(ensembl_human);
    """

    # Execute the query for each gene
    cursor.executemany(query, [(gene,) for gene in gene_list])

    # Commit the transaction
    connection.commit()


def get_ensembl(gene_name):
        query = """
        SELECT ensembl_MMU
        FROM GENES
        WHERE WikiGene_Name_MMU = %s
        """
        try:
                cursor.execute(query, (gene_name,))
                result = cursor.fetchall()
                if result:
                        return result[0][0]  # Return the first element of the list
                else:
                        return None
        except pymysql.Error as e: 
                print(e, query)
                return None


def getPapers():
    cursor, connection = connect_db()
    query = """
        select TITLE
        from PUBLICATION
        order by PUBID asc
        """
    try:
        cursor.execute(query)    
    except pymysql.Error as e: 
        print(e,query)    

    results = cursor.fetchall()
    return(results)

def getRNAExperiments():
    cursor, connection = connect_db()
    query = """
        select STUDY_NAME
        from EXPERIMENT
        where SEQUENCING_TYPE = "RNAseq"
        order by STUDY_NAME asc
        """
    try:
        cursor.execute(query)    
    except pymysql.Error as e: 
        print(e,query)    

    results = cursor.fetchall()
    return(results)

def getNanoStringExperiments():
    cursor, connection = connect_db()
    query = """
        select STUDY_NAME
        from EXPERIMENT
        where SEQUENCING_TYPE = "Nanostring"
        order by STUDY_NAME asc
        """
    try:
        cursor.execute(query)    
    except pymysql.Error as e: 
        print(e,query)    

    results = cursor.fetchall()
    return(results)

def getExperimentStats(experiment):
    cursor, connection = connect_db()

    patient_query = """
    SELECT PID, PATIENT_NAME, PFU, survival, Vaccinated, EID, NHP_ID
    FROM PATIENT
    where EID = %s;
    """

    samples_query = """
    SELECT SID, sample_id, DPI, virus_count, Experimental_condition, PID
    FROM SAMPLE join PATIENT p using(PID)
    where p.EID = %s;
    """

    rna_samples_genes_query = """
    SELECT count(distinct(r.SID)) as samples, count(distinct(r.GID)) as genes
    FROM RNAseq r join SAMPLE st using(SID) join PATIENT using(PID)
    where EID = %s;
    """

    rna_missing_samples_query = """
    select sample_id as sample
    from SAMPLE join PATIENT using(PID)
    where SID not in (select SID from RNAseq rt) and EID = %s;
    """
    EID = get_EID(experiment)
    print(EID)
    try:
        cursor.execute(patient_query, (EID,))
        patients_results = cursor.fetchall()
    except pymysql.Error as e:
        print(e, patient_query)

    try:
        cursor.execute(samples_query, (EID,))
        samples_results = cursor.fetchall()
    except pymysql.Error as e:
        print(e, samples_query)

    try:
        cursor.execute(rna_samples_genes_query, (EID,))
        seq_stats_results = cursor.fetchone()
    except pymysql.Error as e:
        print(e, rna_samples_genes_query)

    try:
        cursor.execute(rna_missing_samples_query, (EID,))
        missing_samples_results = cursor.fetchall()
    except pymysql.Error as e:
        print(e, rna_missing_samples_query)

    response = {
            "patients": [],
            "samples": [],
            "seq_stats": []
            }

            # Convert seq_stats dictionary to an array of key-value pairs
    response["seq_stats"] = [
            {
    "Experiment_ID": EID,
    "Number_of_Samples": seq_stats_results[0] if seq_stats_results else 0,
    "Samples_without_Sequencing_Data": "No missing samples" if not missing_samples_results else [row[0] for row in missing_samples_results],
    "Number_of_Genes": seq_stats_results[1] if seq_stats_results else 0,
            }
    ]
    # for key, value in seq_stats_dict.items():
    #         response["seq_stats"].append({key : value})

    # Add patients
    for row in patients_results:
            response["patients"].append({
                    "PID": row[0],
                    "PATIENT_NAME": row[1],
                    "PFU": row[2],
                    "survival": row[3],
                    "Vaccinated": row[4],
                    "EID": row[5],
                    "NHP_ID": row[6]
            })

    # Add samples
    for row in samples_results:
            response["samples"].append({
                    "SID": row[0],
                    "sample_id": row[1],
                    "DPI": row[2],
                    "virus_count": row[3],
                    "Experimental_condition": row[4],
                    "PID": row[5]
            })
    return(response)
############ ENTER DATA FUNCTIONS #####################

def enterPaper(pmid, title, year, first_author, geoid):
    cursor, connection = connect_db()
    query = """
    INSERT INTO PUBLICATION (PMID, TITLE, YEAR, FIRST_AUTHOR, GEOID)
    VALUES (%s, %s, %s, %s, %s)
    """
    try:
        cursor.execute(query, (pmid, title, year, first_author, geoid))
        connection.commit()
        return("Successfully entered paper")
    except pymysql.Error as e: 
        return (e, query)
def enterExperiment(study_name, virus, strain, species, tissue_type, exposure_route, papername, approval, sequencing_type):
    cursor, connection = connect_db()
    pubid = get_PUBID(papername)

    # query = """
    # INSERT INTO EXPERIMENT (study_name, virus, strain, species, tissue_type, exposure_route,sequencing_type, pubid, approval )
    # VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    # """
    # try:
    #     cursor.execute(query, (study_name, virus, strain, species, tissue_type, exposure_route, sequencing_type, pubid, approval))
    query = """
    INSERT INTO EXPERIMENT (study_name, virus, strain, species, tissue_type, exposure_route,sequencing_type, pubid)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    try:
        cursor.execute(query, (study_name, virus, strain, species, tissue_type, exposure_route, sequencing_type, pubid))
        connection.commit()
        return("Successfully entered experiment")
    except pymysql.Error as e: 
        return (e, query)


def enterPatient():
    cursor, connection = connect_db()


def enterSample(sample_id, DPI, virus_count, experimental_condition, PID, experiment):
    cursor, connection = connect_db()
    EID = get_EID(form.getvalue(experiment))

    if virus_count == "NULL":
            virus_count = None

    query = """
    INSERT INTO SAMPLE_TEST (sample_id, DPI, virus_count, Experimental_condition, PID, EID)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    try:
        cursor.execute(query, (sample_id, DPI, virus_count, experimental_condition, PID, EID))
        connection.commit()
        return("Successfully entered sample")
    except pymysql.Error as e: 
        print(e, query)



def upload_nanoseq():
    return None



########### REGISTRATION FUNCTIONS ############

def registerUser(username, firstname, lastname, email, pword):
    password = hashlib.md5(pword.encode()).hexdigest()
    cursor, connection = connect_db()
    #define query
    query = """
    SELECT *
    FROM Users
    WHERE uName = %sOR email = %s;"""

    #define Insert query
    query2 = """
    INSERT
    INTO Users (uName,pword,fName,lName,email,Approval)
    VALUES (%s,%s,%s,%s,%s,'Pending');"""

    #Need to escape quotations because mysql is reading the variables in without the quotes
    results = cursor.execute(query, (username , email))  # Check if users credentials already exist
    print(results)
    print("yes")
    # status = [x[2] for x in result] # check existing users
    if results == 0:
        #insert data into users table
        cursor.execute(query2,(username, password, firstname, lastname, email))
        connection.commit()
        disconnect_db(cursor, connection)
        print(results)
        return("Your Registration Request was Processed. We will be in contact shortly.")
        
    else:
        disconnect_db(cursor, connection)
        return("Your Username or Email is already registered")

###### LOGIN FUNCTION #####

def loginUser(username, password):
    # Hash the password
    password = hashlib.md5(password.encode()).hexdigest()
    
    # Connect to the database
    cursor, connection = connect_db()

    # Define query
    query = """
    SELECT uName, pword, Approval, access_expir, pword_expir, Admin
    FROM Users
    WHERE uName = %s AND pword = %s;
    """
    
    # Execute the query
    cursor.execute(query, (username, password))
    
    # Fetch the result
    result = cursor.fetchone()

    # Close the connection
    disconnect_db(cursor, connection)
    
    # If no result is found
    if result is None:
        return {"response": "Username and Password Combination Not Found", "approval": None, "username": username, "admin":None}


    # Extract the relevant fields from the result
    uName, pword, approval, access_expir, pword_expir, admin = result
    
    # Get the current date
    # today = date.today()

    # Uncomment and adjust these lines if you want to check for expiration dates
    # if access_expir is None or access_expir < today:
    #     return {"response": "Your account has expired", "approval": approval, "username": uName}
    
    # if pword_expir < today:
    #     return {"response": "Your password has expired, please renew your password.", "approval": approval, "username": uName}
    
    if approval == "Yes":
        return {"response": "Successfully Logged In", "approval": approval, "username": uName, "admin":admin}
    
    if approval == "No":
        return {"response": "You have logged in, but you do not have approval to see unpublished results.", "approval": approval, "username": uName, "admin":admin}

########################
# PATHS FOR API
########################



# #----ADD GENES and DATASETS PATHS----# #
@app.route('/getgenes', methods=['POST'])
def get_genes():
    data=request.get_json()
    searchTerms = data.get('searchTerms')
    query_where = ""
    results = getGeneNames(searchTerms)
    # disconnect_db(cursor, connection)
    # print(results)
    return(json.dumps(results))
    # print results

    # disconnect from db

@app.route('/getgenefields', methods=['POST'])
def getgenefields():
    data = request.get_json()
    table_name = data.get('table')
    
    if not table_name:
        return json.dumps({"error": "Table name is required"}), 400

    return json.dumps(getFields(table_name))

@app.route('/getdatasets', methods=['POST'])
def getdata():
    data = request.get_json()
    virus = data.get('virus')
    strain = data.get('strain')
    species = data.get('species')
    approval = data.get('approval')
    sequencing_type = data.get('sequencing_type')
    return json.dumps(getDatasets(virus, strain, species, sequencing_type, approval))        
        
@app.route('/getGeneTable', methods=['POST'])
def getCountsResults():
    data = request.get_json()
    geneList = data.get('geneList')
    not_in_db = []
    geneGIDs = getGID(geneList, not_in_db)
    geneSummary = gene_summary(geneGIDs)
    return(json.dumps(geneSummary))

@app.route('/getCountsResults', methods=['POST'])
def getCountResults():
    data = request.get_json()
    experiments = data.get('experiments')
    geneList = data.get('geneList')
    survival_status = data.get('survival_status')
    DPI_List = getMaxDPI(experiments, survival_status)
    print(DPI_List)
    noresults = []
    heatmap_x_axis = []
    counts_results, counts_table, noresults = getCountsTable(geneList, DPI_List, experiments, noresults, survival_status)
    fold_change_results, fold_change_table, heat_map_sortedby_study, heat_map_cats_sortedby_study, heatmap_x_axis = FCQUERY_virus(geneList, DPI_List, experiments, survival_status, heatmap_x_axis)
    response_data = {
        'counts_results': counts_results,
        'counts_table': counts_table,
        'DPI_List': DPI_List,
        'noresults': noresults,
        'fold_change_results': fold_change_results,
        'fold_change_table': fold_change_table,
        'heat_map_cats_sortedby_study': heat_map_cats_sortedby_study,
        'heatmap_x_axis': heatmap_x_axis,
        'heat_map_sortedby_study': heat_map_sortedby_study
    }
    
    # Convert the dictionary to a JSON string and return it
    return json.dumps(response_data)

########## ENTER DATA PATHS ##########


@app.route('/fillOutEnterData', methods=['GET'])
def fillOutEnterData():
    papers = getPapers()
    experiments = getRNAExperiments()
    return json.dumps({"papers": papers, "experiments": experiments})

@app.route('/fillOutEnterDataNanostring', methods=['GET'])
def fillOutEnterDataNanostring():
    papers = getPapers()
    experiments = getNanoStringExperiments()
    return json.dumps({"experiments": experiments})


@app.route('/getExperimentStats', methods=['POST'])
def getExperimentTables():
    data = request.get_json()
    experiment = data.get('experiment')
    return json.dumps(getExperimentStats(experiment))   

@app.route('/enterPaper', methods=['POST'])
def enterPapers():
    data = request.get_json()
    pmid = data.get('pmid')
    title = data.get('title')
    year = data.get('year')
    first_author = data.get('first_author')
    geoid = data.get('geoid')
    response = enterPaper(pmid, title, year, first_author, geoid)
    return json.dumps({"response": response})


@app.route('/enterExperiment', methods=['POST'])
def enterExperiments():
    data = request.get_json()
    study_name = data.get('studyname')
    virus = data.get('virus')
    strain = data.get('strain')
    species = data.get('species')
    tissue_type = data.get('tissue_type')
    exposure_route = data.get('exposure_route')
    papername = data.get('papername')
    sequencing_type = data.get('sequencing_type')
    approval = data.get('approval')
    response = enterExperiment(study_name, virus, strain, species, tissue_type, exposure_route, papername, approval, sequencing_type)
    return json.dumps({"response": response})

@app.route('/enterPatients', methods=['POST'])
def enterPatients():
    return None


@app.route('/enterSample', methods=['POST'])
def enterSamples():
    data = request.get_json()
    sample_id = data.get('sample_id')
    DPI = data.get('DPI')
    virus_count = data.get('virus_count')
    experimental_condition = data.get('experimental_condition')
    PID = data.get('PID')
    experiment = data.get('experiment')
    enterSample(sample_id, DPI, virus_count, experimental_condition, PID, experiment)
    return json.dumps({"success": True})

@app.route('/enterRNAData', methods=['POST'])
def enterRNAData():
    return process_and_upload_rna()

def allowed_file(filename):
    # Define acceptable file extensions
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'csv'}
    
def process_and_upload_rna():
    if 'rna_file' not in request.files:
        return jsonify({'response': 'No file part'})

    file = request.files['rna_file']

    if file.filename == '':
        return jsonify({'response': 'No selected file'})

    if not allowed_file(file.filename):  # Function to check file extension
        return jsonify({'response': 'Invalid file format'})

    # PROCESS CSV
    data = pd.read_csv(file)
    genes_to_enter = []

    # Extract gene list and get GIDs
    gene_list = data.iloc[:, 0].tolist()
    gid_list, ensembl_list = get_bulk_GID(gene_list)
    # print(gid_list)

    # Identify genes needing new GIDs
    for gene, gid in zip(gene_list, gid_list):
        if gid is None:
            genes_to_enter.append(gene)

    # Insert missing genes into GENES table
    if genes_to_enter:
        insert_names_into_genes(genes_to_enter)
        # Refresh GIDs after insertion
        gid_list, ensembl_list = get_bulk_GID(gene_list)

    # Validate SIDs and create new data for CSV
    new_data = []
    sid_list = []
    for sample in data.columns[1:]:
        # print(sample)
        sid = get_SID(sample)
        if sid is None:
            return jsonify({'response': 'Sample ID for ' +sample + ' not found'})
        else:
            sid_list.append(sid)


    # Create new CSV content
    print(len(sid_list))
    print(sid_list)
    print(range(1, len(sid_list)))
    for i in range(1, len(data)):
        for j in range(1, len(sid_list)):
            expression = data.iloc[i, j]
            # print(sid_list[j-1], gid_list[i], ensembl_list[i], expression)
            new_data.append((sid_list[j], gid_list[i], ensembl_list[i], expression))

    # Save new data to CSV file
    if new_data:
        df = pd.DataFrame(new_data, columns=['SID', 'GID', 'ensembl', 'expression'])
        # Check for duplicates based on the primary key columns 'SID' and 'GID'
        duplicates = df[df.duplicated(subset=['SID', 'GID'], keep=False)]

        # If duplicates are found, print them or handle them as needed
        if not duplicates.empty:
            print("Warning: Found duplicates for the primary key (SID, GID):")
            print(duplicates)
            # Handle duplicates as needed, e.g., drop them, raise an error, etc.
            # Example: Remove duplicates and keep the first occurrence
            df = df.drop_duplicates(subset=['SID', 'GID'])
        filename = 'RNASEQ.csv'
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        pd.DataFrame(new_data, columns=['SID', 'GID', 'ensembl', 'expression']).to_csv(file_path, index=False)


        try:
            load_rna_data_infile(file_path)
        finally:
            os.remove(file_path)

        return jsonify({'response': 'File successfully uploaded and processed'})
    else:
        return jsonify({'response': 'No valid data to process'})

# Function to save and load the new CSV into the database
def load_rna_data_infile(file_path):
    cursor, connection = connect_db()
    query = """
    LOAD DATA INFILE %s
    INTO TABLE RNAseq
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS
    (SID, GID, ensembl, expression);
    """
    cursor.execute(query, (file_path,))
    connection.commit()
    cursor.close()
    connection.close()


@app.route('/enterNanostringData', methods=['POST'])
def enterNanostringData():
    return process_and_upload_nanostring()

def allowed_file(filename):
    # Define acceptable file extensions
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'csv'}
    
def process_and_upload_nanostring():
    # Calling it rna file even though its nanostring because im lazy
    if 'rna_file' not in request.files:
        return jsonify({'response': 'No file part'})

    file = request.files['rna_file']

    if file.filename == '':
        return jsonify({'response': 'No selected file'})

    if not allowed_file(file.filename):  # Function to check file extension
        return jsonify({'response': 'Invalid file format'})

    # PROCESS CSV
    data = pd.read_csv(file)
    genes_to_enter = []

    # Extract gene list and get GIDs
    gene_list = data.iloc[:, 0].tolist()
    gid_list, ensembl_list = get_bulk_GID(gene_list)
    print(gid_list)

    # Identify genes needing new GIDs
    for gene, gid in zip(gene_list, gid_list):
        if gid is None:
            print(gid)
            genes_to_enter.append(gene)

    # Insert missing genes into GENES table
    if genes_to_enter:
        insert_names_into_genes(genes_to_enter)
        # Refresh GIDs after insertion
        gid_list, ensembl_list = get_bulk_GID(gene_list)

    # Validate SIDs and create new data for CSV
    new_data = []
    sid_list = []
    for sample in data.columns[1:]:
        # print(sample)
        sid = get_Nanostring_SID(sample)
        if sid is None:
            return jsonify({'response': 'Sample ID for ' +sample + ' not found'})
        else:
            sid_list.append(sid)


    # Create new CSV content

    print(len(gid_list), len(data))
    for i in range(1, len(gid_list)):
        for j in range(1, len(sid_list)):
            expression = data.iloc[i, j]
            # print(sid_list[j], gid_list[i], expression)
            new_data.append((sid_list[j-1], gid_list[i], expression))

    # Save new data to CSV file
    if new_data:
        df = pd.DataFrame(new_data, columns=['SID', 'GID', 'expression'])
        # Check for duplicates based on the primary key columns 'SID' and 'GID'
        duplicates = df[df.duplicated(subset=['SID', 'GID'], keep=False)]

        # If duplicates are found, print them or handle them as needed
        if not duplicates.empty:
            print("Warning: Found duplicates for the primary key (SID, GID):")
            print(duplicates)
            # Handle duplicates as needed, e.g., drop them, raise an error, etc.
            # Example: Remove duplicates and keep the first occurrence
            df = df.drop_duplicates(subset=['SID', 'GID'])
        filename = 'NANOSTRING.csv'
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        pd.DataFrame(new_data, columns=['SID', 'GID', 'expression']).to_csv(file_path, index=False)


        try:
            load_nanostring_infile(file_path)
        finally:
            os.remove(file_path)

        return jsonify({'response': 'File successfully uploaded and processed'})
    else:
        return jsonify({'response': 'No valid data to process'})

def load_nanostring_infile(file_path):
    cursor, connection = connect_db()
    query = """
    LOAD DATA INFILE %s
    INTO TABLE NANOSTRING
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS
    (SID, GID, expression);
    """
    cursor.execute(query, (file_path,))
    connection.commit()
    cursor.close()
    connection.close()

@app.route('/enterNanostringSampleData', methods=['POST'])
def enterNanostringSampleData():
    return None

def load_nanostring_sample_infile(file_path):
    cursor, connection = connect_db()
    query = """
    LOAD DATA INFILE %s
    INTO TABLE NANOSTRING_SAMPLES
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS
    (SID, DPI, PATIENT_ID, Sample_ID);
    """
    cursor.execute(query, (file_path,))
    connection.commit()
    cursor.close()
    connection.close()

##### REGISTRATION and LOGIN PATHS #####

@app.route('/register', methods=['POST'])
def registerNewUser():
    data = request.get_json()
    username = data.get("uname")
    firstname = data.get("fname")
    lastname = data.get("lname")
    email = data.get("email")
    pword = data.get("pword")
    response = registerUser(username, firstname, lastname, email, pword)
    return json.dumps({"response": response})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("uname")
    pword = data.get("pword")
    response = loginUser(username, pword)
    return json.dumps(response)

######### ADMIN ROUTES ##########

@app.route('/getUsers', methods=['GET'])
def getUsers():
    cursor, connection = connect_db()

    query = '''
    SELECT uName, fName, lName, email, Approval, Admin
    From Users
    '''

    cursor.execute(query)
    results = cursor.fetchall()
    disconnect_db(cursor, connection)
    return json.dumps(results)

@app.route('/changeApproval', methods=['POST'])
def changeApproval():
    cursor, connection = connect_db()
    data = request.get_json()
    username = data.get('username')
    approval = data.get('approval')
    query = '''
    UPDATE Users
    SET Approval = %s
    WHERE uName = %s
    '''
    cursor.execute(query, (approval, username))
    connection.commit()
    disconnect_db(cursor, connection)
    return json.dumps({"success": True})

@app.route('/changeAdmin', methods=['POST'])
def changeAdmin():
    cursor, connection = connect_db()
    data = request.get_json()
    username = data.get('username')
    admin = data.get('admin')
    query = '''
    UPDATE Users
    SET admin = %s
    WHERE uName = %s
    '''
    cursor.execute(query, (admin, username))
    connection.commit()
    disconnect_db(cursor, connection)
    return json.dumps({"success": True})

@app.route('/getAdminExperiments', methods=['GET'])
def getAdminExperiments():
    cursor, connection = connect_db()
    RNA = getAdminRNAExperiments()
    Nanostring = getAdminNanoStringExperiments()
    return json.dumps({"RNA": RNA, "Nanostring": Nanostring})

def getAdminRNAExperiments():
    cursor, connection = connect_db()
    query = """
        select STUDY_NAME,VIRUS,STRAIN,SPECIES,TISSUE_TYPE,EXPOSURE_ROUTE, TITLE,APPROVAL
        from EXPERIMENT e left join PUBLICATION p using(PUBID)
        where SEQUENCING_TYPE = "RNAseq"
        order by STUDY_NAME asc
        """
    try:
        cursor.execute(query)    
    except pymysql.Error as e: 
        print(e,query)    

    results = cursor.fetchall()
    return(results)

def getAdminNanoStringExperiments():
    cursor, connection = connect_db()
    query = """
        select STUDY_NAME,VIRUS,STRAIN,SPECIES,TISSUE_TYPE,EXPOSURE_ROUTE, TITLE,APPROVAL
        from EXPERIMENT e left join PUBLICATION p using(PUBID)
        where SEQUENCING_TYPE = "Nanostring"
        order by STUDY_NAME asc
        """
    try:
        cursor.execute(query)    
    except pymysql.Error as e: 
        print(e,query)    

    results = cursor.fetchall()
    return(results)

@app.route('/changeExperimentApproval', methods=['POST'])
def changeExperimentApproval():
    cursor, connection = connect_db()
    data = request.get_json()
    STUDY_NAME = data.get('experiment')
    approval = data.get('approval')
    query = '''
    UPDATE EXPERIMENT
    SET Approval = %s
    WHERE STUDY_NAME = %s
    '''
    cursor.execute(query, (approval, STUDY_NAME))
    connection.commit()
    disconnect_db(cursor, connection)
    return json.dumps({"success": True})

@app.route('/deleteExperiment', methods=['DELETE'])
def deleteExperiment():
    cursor, connection = connect_db()
    data = request.get_json()
    STUDY_NAME = data.get('experiment')
    query = '''
    DELETE FROM EXPERIMENT
    WHERE STUDY_NAME = %s
    '''
    cursor.execute(query, (STUDY_NAME,))
    connection.commit()
    disconnect_db(cursor, connection)
    return json.dumps({"success": True})