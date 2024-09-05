import { useState } from "react";
import { Card } from "react-bootstrap";
import AdminTabTemplate from "./AdminTabTemplate";
import EditUsers from "./AdminEditUsers";
import EditExperiments from "./AdminEditExperiments";
import AddData from "../AddData/AddData";
import AddNanostringData from "../AddData/AddNanostringData";

function Admin() {
  const [currentTab, setCurrentTab] = useState("EditUsers");
  const [selectedExperiment, setSelectedExperiment] = useState("");
  const renderTabContent = () => {
    switch (currentTab) {
      case "EditUsers":
        return <EditUsers />;
      case "EditExperiments":
        return (
          <EditExperiments
            setSelectedExperiment={setSelectedExperiment}
            setCurrentTab={setCurrentTab}
          />
        );
      case "AddRNAData":
        console.log(selectedExperiment);
        return <AddData selectedExperiment={selectedExperiment} />;
      case "AddNanostringData":
        console.log(selectedExperiment);
        return <AddNanostringData selectedExperiment={selectedExperiment} />;
    }
  };
  return (
    <div>
      <AdminTabTemplate setCurrentTab={setCurrentTab} currentTab={currentTab} />
      <Card>
        <Card.Body>{renderTabContent()}</Card.Body>
      </Card>
    </div>
  );
}

export default Admin;
