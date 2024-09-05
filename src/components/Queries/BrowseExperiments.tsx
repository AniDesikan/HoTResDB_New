import React, { useState, useEffect } from "react";
import TableTemplate from "../Misc/TableTemplate";

function BrowseExperiments() {
  const [selectedExperiment, setSelectedExperiment] = useState("");
  const [experimentList, setExperimentList] = useState([]);
  const [patientsTable, setPatientsTable] = useState([]);
  const [samplesTable, setSamplesTable] = useState([]);
  const [rnaSeqStatsTable, setRNASeqStatsTable] = useState([]);

  useEffect(() => {
    fetchExperimentsAndPapers();
  }, []);

  useEffect(() => {
    fetchExperimentData(selectedExperiment);
  }, [selectedExperiment]);
  const fetchExperimentsAndPapers = async () => {
    try {
      const response = await fetch("/api/fillOutEnterData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched data:", data); // Log the fetched data
      setExperimentList(data.experiments);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchExperimentData = async (experiment: any) => {
    try {
      const response = await fetch("/api/getExperimentStats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ experiment }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Fetched data:", data);
      // We want to process the data into arrays of arrays for the TableTemplate component
      // Process and set the Patients Table data
      const processedPatientsData = data.patients.map((patient: any) => [
        patient.PID,
        patient.PATIENT_NAME,
        patient.PFU,
        patient.survival,
        patient.Vaccinated,
        patient.EID,
        patient.NHP_ID,
      ]);
      setPatientsTable(processedPatientsData);

      // Process and set the Samples Table data
      const processedSamplesData = data.samples.map((sample: any) => [
        sample.SID,
        sample.sample_id,
        sample.DPI,
        sample.virus_count,
        sample.Experimental_condition,
        sample.PID,
      ]);
      setSamplesTable(processedSamplesData);

      // Process and set the RNA Seq Stats Table data (example structure, adjust as needed)
      const processedRNASeqStatsData = data.seq_stats.map((seqStat: any) => [
        seqStat.Experiment_ID,
        seqStat.Number_of_Samples,
        seqStat.Samples_without_Sequencing_Data,
        seqStat.Number_of_Genes,
      ]);
      setRNASeqStatsTable(processedRNASeqStatsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleExperimentChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = event.target.value;
    setSelectedExperiment(selected);
    console.log("Selected experiment:", selected);
  };

  return (
    <div id="experiment-html">
      <div>Choose Experiment:</div>
      <div className="search">
        <select
          id="experiment_experiments"
          name="experiment"
          onChange={handleExperimentChange}
        >
          <option value="">Select an experiment</option>
          {experimentList.map((experiment, index) => (
            <option key={index} value={experiment}>
              {experiment}
            </option>
          ))}
        </select>
      </div>

      <h2>RNA Sequencing Stats</h2>
      <TableTemplate
        data={rnaSeqStatsTable}
        fields={[
          "Experiment ID",
          "Number of Samples",
          "Samples without Sequencing Data",
          "Number of Genes",
        ]}
      />

      <h2>Patients Table</h2>
      <TableTemplate
        data={patientsTable}
        fields={[
          "PID",
          "PATIENT_NAME",
          "PFU",
          "survival",
          "Vaccinated",
          "EID",
          "NHP_ID",
        ]}
      />

      <h2>Samples Table</h2>
      <TableTemplate
        data={samplesTable}
        fields={[
          "SID",
          "sample_id",
          "DPI",
          "virus_count",
          "Experimental_condition",
          "PID",
        ]}
      />
    </div>
  );
}

export default BrowseExperiments;
