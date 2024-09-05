import React, { useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import { submitRequest } from "./FormHelpers"; // assuming the helper functions are in a separate file

const PaperForm: React.FC = () => {
  const [pmid, setPmid] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [firstAuthor, setFirstAuthor] = useState("");
  const [geoid, setGeoid] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await submitRequest(
      "/api/enterpaper",
      "POST",
      {
        pmid: pmid,
        title: title,
        year: year,
        first_author: firstAuthor,
        geoid: geoid,
      },
      setLoading
    );
  };

  return (
    <div>
      <Card>
        <Card.Header>
          <h3>Enter Publication</h3>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
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

export default PaperForm;
