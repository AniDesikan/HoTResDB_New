import { Table, Button } from "react-bootstrap";

interface ExperimentTableTemplateProps {
  data: (string | number)[][];
  fields: string[];
  setSelectedExperiment: any; // New prop
  setCurrentTab: any;
}

function ExperimentTableTemplate({
  data,
  fields,
  setSelectedExperiment, // Destructure the new prop
  setCurrentTab,
}: ExperimentTableTemplateProps) {
  // Function to handle Approval changes
  const handleApprovalChange = (experimentId: string, newApproval: string) => {
    fetch("/api/changeExperimentApproval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ experiment: experimentId, approval: newApproval }),
    })
      .then((response) => response.json())
      .then(() => {
        alert(
          `Approval for Experiment ID ${experimentId} has been changed to ${newApproval}`
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Function to handle cascading delete
  const handleDeleteExperiment = (experimentId: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete Experiment ID ${experimentId} and all related information?`
    );
    if (confirmDelete) {
      fetch("/api/deleteExperiment", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ experiment: experimentId }),
      })
        .then((response) => response.json())
        .then(() => {
          alert(
            `Experiment ID ${experimentId} and all related information have been deleted.`
          );
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  // Function to handle editing an experiment
  const handleAddData = (studyName: string) => {
    setSelectedExperiment(studyName);
    setCurrentTab("AddData");
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            {fields.map((field, index) => (
              <th key={index}>{field}</th>
            ))}
            <th>Actions</th> {/* Additional column for actions like Delete */}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row[0]}</td> {/* STUDY_NAME */}
              <td>{row[1]}</td> {/* VIRUS */}
              <td>{row[2]}</td> {/* STRAIN */}
              <td>{row[3]}</td> {/* SPECIES */}
              <td>{row[4]}</td> {/* TISSUE_TYPE */}
              <td>{row[5]}</td> {/* EXPOSURE_ROUTE */}
              <td>{row[6]}</td> {/* TITLE */}
              <td>
                <select
                  value={row[7]}
                  onChange={(e) => {
                    const newApproval = e.target.value;
                    handleApprovalChange(row[0] as string, newApproval); // row[0] is assumed to be the unique identifier (experiment ID)
                  }}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleAddData(row[0] as string)} // row[0] is assumed to be the Study Name
                >
                  Add Data
                </Button>{" "}
                {/* Add the Edit button */}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteExperiment(row[0] as string)} // row[0] is assumed to be the unique identifier (experiment ID)
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ExperimentTableTemplate;
