// TODO: This code is extremely spaghetti, break down later

import { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";

interface Paper {
  id: number;
  name: string;
}

function EnterRNAData() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [studyname, setStudyname] = useState("");
  const [virus, setVirus] = useState("");
  const [strain, setStrain] = useState("");
  const [species, setSpecies] = useState("");
  const [tissuetype, setTissuetype] = useState("");
  const [paper, setPaper] = useState("");
  const [exposureroute, setExposureroute] = useState("");
  const [pmid, setPmid] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [firstAuthor, setFirstAuthor] = useState("");
  const [geoid, setGeoid] = useState("");
  const [experimentSample, setExperimentSample] = useState("");
  const [experimentRNA, setExperimentRNA] = useState("");
  const [experiments, setExperiments] = useState<any[]>([]); // Define a proper type for experiments if available
  const [RNAData, setRNAData] = useState<FileList | null>(null);
  const [SampleData, setSampleData] = useState<FileList | null>(null);

  const [loading, setLoading] = useState(false); // Loading state

  ///////////////////////// TEMPLATE FUNCTIONS /////////////////////////////////

  // This is the function that is the template for submitting forms to the server, the url is the path to send to the api
  const submitRequest = async (
    url: any,
    method = "POST",
    bodyData = {},
    headers = { "Content-Type": "application/json" }
  ) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify(bodyData),
        headers: headers,
      });
      const result = await response.json();
      console.log("Server Response:", result);
      if (response.ok) {
        alert(result.response);
      } else {
        alert("Submission failed. Please check your input and try again.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("An error occurred during submission. Please try again later.");
    } finally {
      setLoading(false); // End loading
    }
  };

  // This function is very similar to the previous function but it is used for file uploads like Sample and RNA CSVs.

  const submitFileData = async (url: string, fileList: FileList | null) => {
    console.log("test");
    if (fileList && fileList.length > 0) {
      const formData = new FormData();
      formData.append("rna_file", fileList[0]); // Assuming a single file is selected
      console.log(formData);
      console.log("test");
      try {
        setLoading(true);
        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.response);
        } else {
          alert("Submission failed. Please check your input and try again.");
        }
      } catch (error) {
        console.error("Error during submission:", error);
        alert("An error occurred during submission. Please try again later.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("No file selected");
    }
  };

  //////////////////////////// END OF TEMPLATE FUNCTIONS /////////////////////////
  //////////////////////////// Fill out dropdown entries /////////////////////////
  const fetchPapers = () => {
    fetch("/api/fillOutEnterData")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.papers);
        setPapers(data.papers);
        console.log(data.experiments);
        setExperiments(data.experiments);
      })
      .catch((error) => {
        console.error("Error fetching papers:", error);
      });
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  //////////////////////////// SUBMIT FUNCTIONS /////////////////////////

  const submitPaper = () => {
    submitRequest("/api/enterpaper", "POST", {
      pmid: pmid,
      title: title,
      year: year,
      first_author: firstAuthor,
      geoid: geoid,
    });
  };
  const submitExperiment = () => {
    submitRequest("/api/enterExperiment", "POST", {
      studyname: studyname,
      virus: virus,
      strain: strain,
      species: species,
      tissue_type: tissuetype,
      exposure_route: exposureroute,
      papername: paper,
    });
  };

  const submitSample = () => {
    submitFileData("/api/enterSample", SampleData);
  };

  const submitRNASeq = () => {
    console.log("submi");
    submitFileData("/api/enterRNAData", RNAData);
  };

  //////////////////////////// FORM HANDLERS /////////////////////////

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await submitExperiment(); // Await the submission
  };

  const handlePaperSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await submitPaper(); // Await the submission
  };

  const handleSampleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await submitSample(); // Await the submission
  };

  const handleRNASeqSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await submitRNASeq(); // Await the submission
  };

  //////////////////////////// HTML /////////////////////////
  return (
    <div id="rna-data-html">
      <Card>
        <Card.Header>
          <h3>Enter Publication</h3>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handlePaperSubmit}>
            <div>PMID:</div>
            <div className="search">
              <input
                type="text"
                id="pmid"
                name="pmid"
                value={pmid}
                onChange={(e) => setPmid(e.target.value)}
              />
            </div>
            <div>Title:</div>
            <div className="search">
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>Year:</div>
            <div className="search">
              <input
                type="text"
                id="year"
                name="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div>First Author:</div>
            <div className="search">
              <input
                type="text"
                id="firstAuthor"
                name="firstAuthor"
                value={firstAuthor}
                onChange={(e) => setFirstAuthor(e.target.value)}
              />
            </div>
            <div>GEOID:</div>
            <div className="search">
              <input
                type="text"
                id="geoid"
                name="geoid"
                value={geoid}
                onChange={(e) => setGeoid(e.target.value)}
              />
            </div>
            <div>
              <input type="submit" name="enter_paper" value="Enter Paper" />
            </div>
          </form>
        </Card.Body>
      </Card>

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

      <Card>
        <Card.Header>
          <h3>Upload Sample Data</h3>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSampleSubmit}>
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
            <div>Upload Sample File:</div>
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

      <Card>
        <Card.Header>
          <h3>Enter RNA Sequencing Data</h3>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleRNASeqSubmit}>
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
}

export default EnterRNAData;
