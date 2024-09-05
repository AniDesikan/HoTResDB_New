import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";

function Pills({
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
            <Nav.Link eventKey="ExecuteSearch">Execute Search</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="AddGenes">Add Genes</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="AddDatasets">Add Datasets</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="SearchResults">Search Results</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="ExpressionData">Expression Data</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="CountsGraphs">Counts Graphs</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="FoldChangeGraphs">Fold Change Graphs</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="HeatMaps">Heat Maps</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="BrowseEnterData">Browse/Enter Data</Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Body>
    </Card>
  );
}

export default Pills;
