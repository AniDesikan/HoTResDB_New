import TableTemplate from "../Misc/TableTemplate"; // Make sure this is the correct path to your TableTemplate component
import Cookies from "js-cookie";

function AddDatasets({
  tableData,
  setTableData,
  strain,
  setStrain,
  species,
  setSpecies,
  // samples,
  setSamples,
  virus,
  setVirus,
  sequencing_type,
  setSequencingType,
}: {
  tableData: any;
  setTableData: any;
  strain: any;
  setStrain: any;
  species: any;
  setSpecies: any;
  // samples: any;
  setSamples: any;
  virus: any;
  setVirus: any;
  sequencing_type: any;
  setSequencingType: any;
}) {
  const approval = Cookies.get("approval");
  const fetchTableResults = () => {
    fetch("/api/getdatasets", {
      method: "POST",
      body: JSON.stringify({
        virus: virus || null,
        strain: strain || null,
        species: species || null,
        sequencing_type: sequencing_type || null,
        approval: approval || null,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setTableData(data);
        console.log(approval);
        // console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching table results:", error);
      });
  };

  const handleSearch = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log(virus, strain, species);
    fetchTableResults();
  };

  const tableFields = [
    "VIRUS",
    "STRAIN",
    "SPECIES",
    "TISSUE_TYPE",
    "EXPOSURE_ROUTE",
    "TITLE",
  ];

  const handleAddToCart = (row: (string | number | null)[]) => {
    const Sample = row[5] as string; // Assuming WikiGene_Name_human is the second column
    setSamples((prevSamples: any) => {
      if (!prevSamples.includes(Sample)) {
        return [...prevSamples, Sample];
      }
      return prevSamples;
    });
  };
  return (
    <div id="tabs-8">
      <div className="gene_table_outer">
        <div className="search_field_row browse_outer">
          <div className="browse_inner">
            <div className="search_field_title">
              Search for a dataset of interest:
            </div>

            <form id="SampSearch" name="SampSearch" onSubmit={handleSearch}>
              <select
                name="virus"
                className="browse_select"
                value={virus}
                onChange={(e) => setVirus(e.target.value)}
              >
                <option value="">All Viruses</option>
                <option value="EBOV">Ebola</option>
                <option value="LASV">Lassa</option>
                <option value="MARV">Marburg</option>
                <option value="TAFV">Tai Forest</option>
                <option value="BOMV">Bombali</option>
              </select>
              <select
                name="strain"
                className="browse_select"
                value={strain}
                onChange={(e) => setStrain(e.target.value)}
              >
                <option value="">All Strains</option>
                <option value="Mayinga">Ebola - Mayinga</option>
                <option value="Makona">Ebola - Makona</option>
                <option value="Kikwit">Ebola - Kikwit</option>
                <option value="Josiah">Lassa - Josiah</option>
                <option value="Z-132">Lassa - Z-132</option>
                <option value="Soromba">Lassa - Soromba</option>
                <option value="Angola">Marburg - Angola</option>
              </select>
              <select
                name="species"
                className="browse_select"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
              >
                <option value="">All Species</option>
                <option value="Macaca mulatta">Macaca Mulatta</option>
                <option value="Macaca fascicularis">Macaca Fascicularis</option>
                <option value="Homo sapiens">Homo Sapiens</option>
              </select>
              <select
                name="sequencing_type"
                className="browse_select"
                value={sequencing_type}
                onChange={(e) => setSequencingType(e.target.value)}
              >
                <option value="All">All Data</option>
                <option value="RNAseq">RNAseq</option>
                <option value="Nanostring">Nanostring</option>
              </select>
              <div className="search_field_title">
                <input className="sample_search" type="submit" value="Search" />
              </div>
            </form>
          </div>
          <div className="search_field_title clear_table">
            <input
              type="button"
              value="Clear Table"
              onClick={() => setTableData([])}
            />
          </div>
        </div>
        <div className="search_field_row">
          <div className="sample_table_header">
            Matching datasets in the database
          </div>
          <TableTemplate
            data={tableData}
            fields={tableFields}
            showAddToCart={true}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
}

export default AddDatasets;
