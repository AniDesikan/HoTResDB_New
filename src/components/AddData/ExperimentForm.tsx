import React, { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import { submitRequest, fetchPapersAndExperiments } from "./FormHelpers"; // assuming the helper functions are in a separate file

interface Paper {
  id: number;
  name: string;
}

const ExperimentForm: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [studyname, setStudyname] = useState("");
  const [virus, setVirus] = useState("");
  const [strain, setStrain] = useState("");
  const [species, setSpecies] = useState("");
  const [tissuetype, setTissuetype] = useState("");
  const [paper, setPaper] = useState("");
  const [exposureroute, setExposureroute] = useState("");
  const [sequencingType, setSequencingType] = useState(""); // New state for sequencing type
  const [approval, setApproval] = useState(""); // New state for approval
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPapersAndExperiments(setPapers);
    console.log(papers);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await submitRequest(
      "/api/enterExperiment",
      "POST",
      {
        studyname: studyname,
        virus: virus,
        strain: strain,
        species: species,
        tissue_type: tissuetype,
        exposure_route: exposureroute,
        papername: paper,
        sequencing_type: sequencingType, // RNAseq or Nanostring
        approval: approval === "Yes", // Convert to boolean
      },
      setLoading
    );
  };

  return (
    <div>
      <Card>
        <Card.Header>
          <h3>Enter Experiment Data</h3>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <div>Study Name:</div>
            <div className="search">
              <input
                type="text"
                id="studyname"
                name="studyname"
                value={studyname}
                onChange={(e) => setStudyname(e.target.value)}
              />
            </div>
            <div>Virus:</div>
            <div className="search">
              <input
                type="text"
                id="virus"
                name="virus"
                value={virus}
                onChange={(e) => setVirus(e.target.value)}
              />
            </div>
            <div>Strain:</div>
            <div className="search">
              <input
                type="text"
                id="strain"
                name="strain"
                value={strain}
                onChange={(e) => setStrain(e.target.value)}
              />
            </div>
            <div>Species:</div>
            <div className="search">
              <input
                type="text"
                id="species"
                name="species"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
              />
            </div>
            <div>Tissue Type:</div>
            <div className="search">
              <input
                type="text"
                id="tissuetype"
                name="tissuetype"
                value={tissuetype}
                onChange={(e) => setTissuetype(e.target.value)}
              />
            </div>
            <div>Exposure Route:</div>
            <div className="search">
              <input
                type="text"
                id="exposureroute"
                name="exposureroute"
                value={exposureroute}
                onChange={(e) => setExposureroute(e.target.value)}
              />
            </div>
            <div>Paper:</div>
            <div className="search">
              <select
                id="paper"
                name="paper"
                value={paper}
                onChange={(e) => setPaper(e.target.value)}
              >
                <option value="">Select a paper</option>
                {papers.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>Sequencing Type:</div>
            <div className="search">
              <select
                id="sequencingType"
                name="sequencingType"
                value={sequencingType}
                onChange={(e) => setSequencingType(e.target.value)}
              >
                <option value="">Select Sequencing Type</option>
                <option value="RNAseq">RNAseq</option>
                <option value="Nanostring">Nanostring</option>
              </select>
            </div>
            <div>Approval:</div>
            <div className="search">
              <select
                id="approval"
                name="approval"
                value={approval}
                onChange={(e) => setApproval(e.target.value)}
              >
                <option value="">Select Approval</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <input
                type="submit"
                name="enter_experiment"
                value="Enter Experiment"
              />
            </div>
          </form>
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

export default ExperimentForm;
