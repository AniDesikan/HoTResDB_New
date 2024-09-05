import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";

function BrowseDataTabs({
  setDataTab,
  currentDataTab,
}: {
  setDataTab: any;
  currentDataTab: any;
}) {
  return (
    <Card
      className="mb-3"
      style={{ backgroundColor: "#F2F2F2", marginTop: "30px", width: "60%" }}
    >
      <Card.Body>
        <Nav
          variant="pills"
          activeKey={currentDataTab}
          onSelect={(selectedKey) => setDataTab(selectedKey)}
        >
          <Nav.Item>
            <Nav.Link eventKey="BrowseExperiments">Browse Experiments</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="RNA">Enter RNA Sequencing Data</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="EnterDataHelp">Help</Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Body>
    </Card>
  );
}

export default BrowseDataTabs;
