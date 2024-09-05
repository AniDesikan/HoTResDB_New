import { Table } from "react-bootstrap";

interface UserTableTemplateProps {
  data: (string | number)[][];
  fields: string[];
}

function UserTableTemplate({ data, fields }: UserTableTemplateProps) {
  // Function to handle Approval changes
  const handleApprovalChange = (username: string, newApproval: string) => {
    fetch("/api/changeApproval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, approval: newApproval }),
    })
      .then((response) => response.json())
      .then(() => {
        alert(`Approval for ${username} has been changed to ${newApproval}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Function to handle Admin status changes
  const handleAdminChange = (username: string, newAdminStatus: string) => {
    fetch("/api/changeAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, admin: newAdminStatus }),
    })
      .then((response) => response.json())
      .then(() => {
        alert(
          `Admin status for ${username} has been changed to ${newAdminStatus}`
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            {fields.map((field, index) => (
              <th key={index}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row[0]}</td> {/* uName */}
              <td>{row[1]}</td> {/* fName */}
              <td>{row[2]}</td> {/* lName */}
              <td>{row[3]}</td> {/* email */}
              <td>
                <select
                  value={row[4]}
                  onChange={(e) => {
                    const newApproval = e.target.value;
                    handleApprovalChange(row[0] as string, newApproval); // row[0] is the username
                  }}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
              <td>
                <select
                  value={row[5]}
                  onChange={(e) => {
                    const newAdminStatus = e.target.value;
                    handleAdminChange(row[0] as string, newAdminStatus); // row[0] is the username
                  }}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default UserTableTemplate;
