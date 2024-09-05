import { useState } from "react";
import Card from "react-bootstrap/Card";
import Pills from "../Misc/TabTemplate";
import ExecuteSearch from "../Queries/ExecuteSearch.tsx";
import AddGenes from "../Queries/AddGenes.tsx";
import AddDatasets from "../Queries/AddDatasets.tsx";
import SearchResults from "../Queries/SearchResults";
import ExpressionData from "../Queries/ExpressionData";
import CountsGraphs from "../Queries/CountsGraphs.tsx";
import FoldChangeGraphs from "../Queries/FoldChangeGraphs";
import HeatMaps from "../Queries/HeatMaps";
import BrowseEnterData from "../Queries/BrowseEnterData.tsx";
import FullSidebar from "../Sidebar/FullSidebar.tsx"; // import the sidebar component

function Queries() {
  const [currentTab, setCurrentTab] = useState("ExecuteSearch");

  // States managed by Queries component
  const [GenesTableData, setGenesTableData] = useState([]);
  const [DatasetTableData, setDatasetTableData] = useState([]);

  const [strain, setStrain] = useState("");
  const [species, setSpecies] = useState("");
  const [virus, setVirus] = useState("");

  const [geneTable, setGeneTable] = useState([]);
  const [countsTable, setCountsTable] = useState([]);
  // const [countsFields, setCountsFields] = useState([]);
  const [foldChangeTable, setFoldChangeTable] = useState([]); // add a setter in a second
  // const [foldChangeFields, setFoldChangeFields] = useState([]);
  const [DPIList, setDPIList] = useState([]);

  const [samples, setSamples] = useState([]);
  const [genes, setGenes] = useState([]);

  //States for plotting in highcharts
  const [countsResults, setCountsResults] = useState([]);
  const [foldChangeResults, setFoldChangeResults] = useState([]);
  const [sequencing_type, setSequencingType] = useState("Nanostring");

  const renderTabContent = () => {
    switch (currentTab) {
      case "ExecuteSearch":
        return (
          <ExecuteSearch
            setGeneTable={setGeneTable}
            setCurrentTab={setCurrentTab}
            setCountsTable={setCountsTable}
            setFoldChangeTable={setFoldChangeTable}
            setCountsResults={setCountsResults}
            setFoldChangeResults={setFoldChangeResults}
            setMaxDPI={setDPIList}
            genes={genes}
            setGenes={setGenes}
            samples={samples}
            setSamples={setSamples}
            setVirus={setVirus}
          />
        );
      case "AddGenes":
        return (
          <AddGenes
            tableData={GenesTableData}
            setTableData={setGenesTableData}
            // genes={genes}
            setGenes={setGenes}
          />
        );
      case "AddDatasets":
        return (
          <AddDatasets
            tableData={DatasetTableData}
            setTableData={setDatasetTableData}
            strain={strain}
            setStrain={setStrain}
            species={species}
            setSpecies={setSpecies}
            // samples={samples}
            setSamples={setSamples}
            virus={virus}
            setVirus={setVirus}
            sequencing_type={sequencing_type}
            setSequencingType={setSequencingType}
          />
        );
      case "SearchResults":
        console.log(geneTable);
        return <SearchResults geneTable={geneTable} />;
      case "ExpressionData":
        return (
          <ExpressionData
            countsTable={countsTable}
            foldChangeTable={foldChangeTable}
            DPIList={DPIList}
          />
        );
      case "CountsGraphs":
        return <CountsGraphs countsResults={countsResults} />;
      case "FoldChangeGraphs":
        return <FoldChangeGraphs foldChangeResults={foldChangeResults} />;
      case "HeatMaps":
        return <HeatMaps />;
      case "BrowseEnterData":
        return <BrowseEnterData />;
      default:
        return (
          <ExecuteSearch
            setGeneTable={setGeneTable}
            setCurrentTab={setCurrentTab}
            setCountsTable={setCountsTable}
            setFoldChangeTable={setFoldChangeTable}
            setCountsResults={setCountsResults}
            setFoldChangeResults={setFoldChangeResults}
            setMaxDPI={setDPIList}
            genes={genes}
            setGenes={setGenes}
            samples={samples}
            setSamples={setSamples}
            setVirus={setVirus}
          />
        );
    }
  };

  return (
    <div id="QueriesFullFlex">
      <div id="QueriesLeftSide">
        <Pills setCurrentTab={setCurrentTab} currentTab={currentTab} />
        <Card
          style={{
            width:
              currentTab === "AddGenes" ||
              currentTab === "AddDatasets" ||
              currentTab === "ExecuteSearch"
                ? "70%"
                : "100%",
            marginTop: "20px",
          }}
        >
          <Card.Body>{renderTabContent()}</Card.Body>
        </Card>
      </div>
      {(currentTab === "AddGenes" ||
        currentTab === "AddDatasets" ||
        currentTab === "ExecuteSearch") && (
        <div id="QueriesRightSide">
          <FullSidebar
            samples={samples}
            setSamples={setSamples}
            genes={genes}
            setGenes={setGenes}
            setCurrentTab={setCurrentTab}
          />
        </div>
      )}
    </div>
  );
}

export default Queries;
