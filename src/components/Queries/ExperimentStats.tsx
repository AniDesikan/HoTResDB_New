import RNASeqUploadForm from "../AddData/RNASeqUploadForm";
import SampleUploadForm from "../AddData/SampleUploadForm";
import TableTemplate from "../Misc/TableTemplate";
import { useEffect, useState } from "react";
function ExperimentStats(selectedExperiment: any) {
  const [patientsTable, setPatientsTable] = useState([]);
  const [samplesTable, setSamplesTable] = useState([]);
  const [rnaSeqStatsTable, setRNASeqStatsTable] = useState([]);

  useEffect(() => {
    fetchExperimentData(selectedExperiment);
  }, []);

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
  return (
    <div>
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

      <RNASeqUploadForm />
      <SampleUploadForm />
    </div>
  );
}

export default ExperimentStats;
