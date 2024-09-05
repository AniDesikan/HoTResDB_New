import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";

function AdminTabTemplate({
  setCurrentTab,
  currentTab,
}: {
  setCurrentTab: any;
  currentTab: any;
}) {
  return (
    <Card
      className="mb-3"
      style={{ backgroundColor: "#F2F2F2", marginTop: "30px", width: "60%" }}
    >
      <Card.Body>
        <Nav
          variant="pills"
          activeKey={currentTab}
          onSelect={(selectedKey) => setCurrentTab(selectedKey)}
        >
          <Nav.Item>
            <Nav.Link eventKey="EditUsers">Edit Users</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="EditExperiments">Edit Experiments</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="AddRNAData">Add RNA Data</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="AddNanostringData">
              Add Nanostring Data
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Body>
    </Card>
  );
}

export default AdminTabTemplate;
