function ExecuteSearch({
  setGeneTable,
  setCurrentTab,
  setCountsTable,
  setFoldChangeTable,
  setCountsResults,
  setFoldChangeResults,
  setMaxDPI,
  genes,
  setGenes,
  samples,
  setVirus,
}: {
  setGeneTable: any;
  setCurrentTab: any;
  setCountsTable: any;
  setFoldChangeTable: any;
  setCountsResults: any;
  setFoldChangeResults: any;
  setMaxDPI: any;
  genes: string[];
  setGenes: any;
  samples: string[];
  setSamples: any;
  setVirus: any;
}) {
  const handleGeneInputChange = (event: { target: { value: string } }) => {
    const inputGenes = event.target.value
      .split(/\s+/)
      .filter((gene) => gene.trim() !== "");
    setGenes(inputGenes);
  };

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    console.log(genes);

    try {
      const geneTableResponse = await fetch("/api/getGeneTable", {
        method: "POST",
        body: JSON.stringify({ geneList: genes }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const geneTableData = await geneTableResponse.json();
      setGeneTable(geneTableData);
      console.log(geneTableData);

      const countsResultsResponse = await fetch("/api/getCountsResults", {
        method: "POST",
        body: JSON.stringify({
          experiments: samples,
          geneList: genes,
          survival_status: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const countsResultsData = await countsResultsResponse.json();
      setCountsTable(countsResultsData.counts_table);
      setFoldChangeTable(countsResultsData.fold_change_table);
      setMaxDPI(countsResultsData.DPI_List);
      setCountsResults(countsResultsData.counts_results);
      setFoldChangeResults(countsResultsData.fold_change_results);
      console.log(countsResultsData);
      setCurrentTab("SearchResults");
    } catch (error) {
      console.error("Error fetching table results:", error);
    }
  };

  const addEbolaDataset = () => {
    setVirus("EBOV");
    setCurrentTab("AddDatasets");
  };

  const addLassaDataset = () => {
    setVirus("LASV");
    setCurrentTab("AddDatasets");
  };

  const addMarburgDataset = () => {
    setVirus("MASV");
    setCurrentTab("AddDatasets");
  };

  const addExampleGenes = () => {
    setGenes(["isg15", "irf3"]);
  };
  return (
    <div>
      <form id="searchGene" name="VHFform" onSubmit={handleFormSubmit}>
        <div className="search_data_outer_div" id="outer">
          <div className="search_field_row">
            <h3>Data for new users:</h3>
            <input
              type="button"
              value="Add Ebola Dataset"
              onClick={addEbolaDataset}
            />
            <input
              type="button"
              value="Add Lassa Dataset"
              onClick={addLassaDataset}
            />
            <input
              type="button"
              value="Add Marburg Dataset"
              onClick={addMarburgDataset}
            />
            <input
              type="button"
              value="Add Example Genes"
              onClick={addExampleGenes}
            />
          </div>

          <div className="text_searcharea">
            <div className="search_field_row"></div>
            <div className="search_field_list">
              <textarea
                id="gene_inner"
                name="genes"
                cols={80}
                rows={5}
                className="input_textarea"
                value={genes.join(" ")}
                onChange={handleGeneInputChange}
              ></textarea>
              <br />
              <p>
                (eg: isg15, cxcl10, stat1 Separated by space, tab, or new line)
              </p>

              <div className="Pointer"></div>
              <div className="search_field_row"></div>
              <div className="search_field_list">
                <textarea
                  id="sample_inner"
                  style={{ backgroundColor: "lightgrey" }}
                  name="samples"
                  cols={80}
                  rows={5}
                  className="input_textarea"
                  value={samples.join(" ")}
                  readOnly
                ></textarea>
                <br />
                <div className="Pointer"></div>
              </div>
            </div>
          </div>
          <div className="center_browse">
            <input
              type="checkbox"
              id="include_survivors"
              name="include_survivors"
            />
            Include Survivors
            <div className="search_field_title">
              <input type="submit" value="Search" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ExecuteSearch;
