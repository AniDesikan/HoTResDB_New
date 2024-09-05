import BrowseDataTabs from "./BrowseDataTabs";
import { useState } from "react";
import BrowseExperiments from "./BrowseExperiments";
import EnterRNAData from "../AddData/EnterRNAData";
import { Card } from "react-bootstrap";
import EnterDataHelp from "../AddData/EnterDataHelp";

function BrowseEnterData() {
  const [currentDataTab, setDataTab] = useState("BrowseExperiments");
  const renderTabContent = () => {
    switch (currentDataTab) {
      case "BrowseExperiments":
        return <BrowseExperiments />;
      case "RNA":
        return <EnterRNAData />;
      case "EnterDataHelp":
        return <EnterDataHelp />;
    }
  };
  return (
    <div>
      <BrowseDataTabs currentDataTab={currentDataTab} setDataTab={setDataTab} />
      <Card>
        <Card.Body>{renderTabContent()}</Card.Body>
      </Card>
    </div>
  );
}
export default BrowseEnterData;
