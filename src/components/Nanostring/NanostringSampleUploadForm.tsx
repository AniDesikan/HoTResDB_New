import React, { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import {
  submitFileData,
  fetchNanostringExperiments,
} from "../AddData/FormHelpers"; // assuming the helper functions are in a separate file

const NanostringSampleUploadForm: React.FC = () => {
  const [experimentSample, setExperimentSample] = useState("");
  const [SampleData, setSampleData] = useState<FileList | null>(null);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNanostringExperiments(setExperiments);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await submitFileData("/api/enterNanostringSample", SampleData, setLoading);
  };

  return (
    <div>
      <Card>
        <Card.Header>
          <h3>Upload Nanostring Sample Data</h3>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <div>Choose Experiment:</div>
            <div className="search">
              <select
                id="experiment_sample"
                name="experiment_sample"
                value={experimentSample}
                onChange={(e) => setExperimentSample(e.target.value)}
              >
                <option value="">Select an experiment</option>
                {experiments.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.name}
                  </option>
                ))}
              </select>
            </div>
            <div>Upload Nanostring Sample File:</div>
            <div className="search">
              <input
                type="file"
                id="sample_file"
                name="sample_file"
                onChange={(e) => setSampleData(e.target.files || null)}
              />
            </div>
            <div>
              <input type="submit" name="upload_sample" value="Upload Sample" />
            </div>
          </form>
          <p>
            Download an example CSV file:
            <a href="src/csvs/Example_Samples_CSV.csv" download>
              Example_Samples.csv
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
  {
  }
};

export default NanostringSampleUploadForm;
