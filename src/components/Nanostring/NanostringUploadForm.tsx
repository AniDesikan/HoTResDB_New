import React, { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import {
  submitFileData,
  fetchNanostringExperiments,
} from "../AddData/FormHelpers"; // assuming the helper functions are in a separate file

const NanostringUploadForm: React.FC = () => {
  const [experimentNanostring, setExperimentNanostring] = useState("");
  const [NanostringData, setNanostringData] = useState<FileList | null>(null);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNanostringExperiments(setExperiments);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await submitFileData(
      "/api/enterNanostringData",
      NanostringData,
      setLoading
    );
  };

  return (
    <div>
      <Card>
        <Card.Header>
          <h3>Enter Nanostring Sequencing Data</h3>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <div>Choose Experiment:</div>
            <div className="search">
              <select
                id="experiment_nanostring"
                name="experiment_nanostring"
                value={experimentNanostring}
                onChange={(e) => setExperimentNanostring(e.target.value)}
              >
                <option value="">Select an experiment</option>
                {experiments.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.name}
                  </option>
                ))}
              </select>
            </div>
            <div>Upload Nanostring File:</div>
            <div className="search">
              <input
                type="file"
                id="nanostring_file"
                name="nanostring_file"
                onChange={(e) => setNanostringData(e.target.files || null)}
              />
            </div>
            <div>
              <input
                type="submit"
                name="upload_nanostring"
                value="Upload Nanostring"
              />
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

export default NanostringUploadForm;
