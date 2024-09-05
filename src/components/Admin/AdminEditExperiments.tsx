import { useState, useEffect } from "react";
import ExperimentTableTemplate from "./AdminExperimentTableTemplate";
import PaperForm from "../AddData/PaperForm";
import ExperimentForm from "../AddData/ExperimentForm";

function EditExperiments(setSelectedExperiment: any, setCurrentTab: any) {
  const [RNAexperiments, setRNAExperiments] = useState([]);
  const [NanoStringExperiments, setNanoStringExperiments] = useState([]);

  const ExperimentFields = [
    "STUDY_NAME",
    "VIRUS",
    "STRAIN",
    "SPECIES",
    "TISSUE_TYPE",
    "EXPOSURE_ROUTE",
    "PAPER TITLE",
    "APPROVAL",
  ];

  useEffect(() => {
    fetch("/api/getAdminExperiments")
      .then((response) => response.json())
      .then((data) => {
        setRNAExperiments(data.RNA);
        setNanoStringExperiments(data.Nanostring);
      })
      .catch((error) => {
        console.error("Error fetching experiments:", error);
      });
  }, []);

  return (
    <div>
      <h2>RNA Experiments</h2>
      <ExperimentTableTemplate
        fields={ExperimentFields}
        data={RNAexperiments}
        setSelectedExperiment={setSelectedExperiment}
        setCurrentTab={setCurrentTab}
      />

      <h2>NanoString Experiments</h2>
      <ExperimentTableTemplate
        fields={ExperimentFields}
        data={NanoStringExperiments}
        setSelectedExperiment={setSelectedExperiment}
        setCurrentTab={setCurrentTab}
      />

      <PaperForm />
      <ExperimentForm />
    </div>
  );
}

export default EditExperiments;
