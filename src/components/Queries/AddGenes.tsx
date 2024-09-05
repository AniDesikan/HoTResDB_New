import React, { useState } from "react";
import TableTemplate from "../Misc/TableTemplate";

function AddGenes({
  tableData,
  setTableData,
  // genes,
  setGenes,
}: {
  tableData: (string | number | null)[][];
  setTableData: any;
  // genes: string[];
  setGenes: any;
}) {
  const [searchTerms, setSearchTerms] = useState([
    { searchCategory: "DescgenePart", searchValue: "", booleanOperator: "AND" },
  ]);

  // Function to fetch table results with query parameters
  const fetchTableResults = () => {
    fetch("/api/getgenes", {
      method: "POST",
      body: JSON.stringify({
        searchTerms: searchTerms,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Update the state with the fetched data
        setTableData(data);
        console.log(tableData);
      })
      .catch((error) => {
        console.error("Error fetching table results:", error);
      });
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const updatedSearchTerms = [...searchTerms];
    updatedSearchTerms[index] = { ...updatedSearchTerms[index], [name]: value };
    setSearchTerms(updatedSearchTerms);
  };

  const handleAddSearchTerm = () => {
    setSearchTerms([
      ...searchTerms,
      {
        searchCategory: "DescgenePart",
        searchValue: "",
        booleanOperator: "AND",
      },
    ]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchTableResults();
  };

  // Callback to handle adding gene to cart
  const handleAddToCart = (row: (string | number | null)[]) => {
    const geneName = row[3] as string; // Assuming WikiGene_Name_human is the second column
    setGenes((prevGenes: any) => {
      if (!prevGenes.includes(geneName)) {
        return [...prevGenes, geneName];
      }
      return prevGenes;
    });
  };

  const tableFields = [
    "ensembl_MMU",
    "ensembl_human",
    "WikiGene MMU Name",
    "WikiGene Human Name",
    "Description",
  ];

  return (
    <div id="tabs-2">
      <div className="gene_table_outer">
        <div className="search_field_row browse_outer">
          <div className="browse_inner">
            <div className="search_field_title">
              Enter a part of the Macaque or Human Gene Symbol, or of a Gene
              Description:
            </div>
            <form onSubmit={handleSubmit}>
              {searchTerms.map((term, index) => (
                <div key={index} className="search-term-row">
                  {index > 0 && (
                    <select
                      name="booleanOperator"
                      value={term.booleanOperator}
                      onChange={(event) => handleInputChange(index, event)}
                      className="boolean-operator-select"
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                      <option value="NOT">NOT</option>
                    </select>
                  )}
                  <select
                    className="browse_select"
                    name="searchCategory"
                    value={term.searchCategory}
                    onChange={(event) => handleInputChange(index, event)}
                  >
                    <option value="MMUgenePart">Macaque Gene Symbol</option>
                    <option value="HumangenePart">Human Gene Symbol</option>
                    <option value="DescgenePart">Gene Description</option>
                    <option value="GOPart">Gene Ontology Term</option>
                  </select>
                  <input
                    type="text"
                    name="searchValue"
                    id="browse_search"
                    className="browse_searchbar"
                    value={term.searchValue}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                </div>
              ))}
              <div className="search_field_title">
                <input
                  className="combined_search"
                  type="submit"
                  value="Search"
                />
              </div>
              <input
                type="button"
                value="Add Search Term"
                onClick={handleAddSearchTerm}
              />
            </form>
          </div>
          <div className="search_field_title clear_table">
            {/* <input type="button" value="Clear Table" onClick={deleteResults} /> */}
          </div>
        </div>
        <div className="search_field_row">
          <div className="gene_table_header">
            Matching genes in the database
          </div>
          <TableTemplate
            data={tableData}
            fields={tableFields}
            showAddToCart={true}
            onAddToCart={handleAddToCart} // Pass the callback function
          />
        </div>
      </div>
    </div>
  );
}

export default AddGenes;
