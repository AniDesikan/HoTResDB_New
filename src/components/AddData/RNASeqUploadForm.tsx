import React, { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import { submitFileData, fetchExperiments } from "./FormHelpers"; // assuming the helper functions are in a separate file

const RNASeqUploadForm: React.FC = () => {
  const [experimentRNA, setExperimentRNA] = useState("");
  const [RNAData, setRNAData] = useState<FileList | null>(null);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExperiments(setExperiments);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await submitFileData("/api/enterRNAData", RNAData, setLoading);
  };

  return (
    <div>
      <Card>
        <Card.Header>
          <h3>Enter RNA Sequencing Data</h3>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <div>Choose Experiment:</div>
            <div className="search">
              <select
                id="experiment_rna"
                name="experiment_rna"
                value={experimentRNA}
                onChange={(e) => setExperimentRNA(e.target.value)}
              >
                <option value="">Select an experiment</option>
                {experiments.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.name}
                  </option>
                ))}
              </select>
            </div>
            <div>Upload RNA File:</div>
            <div className="search">
              <input
                type="file"
                id="rna_file"
                name="rna_file"
                onChange={(e) => setRNAData(e.target.files || null)}
              />
            </div>
            <div>
              <input type="submit" name="upload_rna" value="Upload RNA" />
            </div>
          </form>
          <p>
            Download an example CSV file:
            <a href="src/csvs/Example_RNA_Sequencing.csv" download>
              Example_RNA_Sequencing.csv
            </a>
          </p>
        </Card.Body>
      </Card>
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
    </div>
  );
};

export default RNASeqUploadForm;
