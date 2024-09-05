import { Card, Container, Row, Col } from "react-bootstrap";

const FAQCard = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <Card
    className="mb-3"
    style={{ margin: "0 0 10px 0", color: "#0066cc", marginTop: "20px" }}
  >
    <Card.Body>
      <Card.Title className="text-center font-weight-bold">
        {question}
      </Card.Title>
      <Card.Text className="text-center mt-4">{answer}</Card.Text>
    </Card.Body>
  </Card>
);

function Help() {
  return (
    <Container>
      <Row>
        <Col md={12}>
          <FAQCard
            question="What information can I access through the HotRes Database?"
            answer="The database stores gene expression data from VHF studies on non-human primates. Expression levels for specific genes under viral infection or control conditions can be accessed."
          />
          <FAQCard
            question="How can I search the HotRes Database?"
            answer="Select the type of virus (Ebola, Marburg, Lassa) and strain of interest, as well as the type of gene expression analysis tool (RNA-seq or Microarray). Enter a list of one or more genes (separated per line) whose expression values you wish to retrieve."
          />
          <FAQCard
            question="What are the required input formats?"
            answer="Gene names must be in one of the following supported formats: WikiGene symbol, UniProt ID, Ensembl Human or Ensembl Macaque. Please use the corresponding text box for each format. Genes can be separated by tab or newline. Outputs will be in Human Gene Symbol and Ensembl Human ID."
          />
          <FAQCard
            question="What kind of data can I get from this search?"
            answer="The search will take you to the tab with successful hits in the database, including corresponding EnsemblID and a GeneCards link for more information. You can click through any of the other results tabs for tables of the results of your search by gene expression or fold change over time, line graphs of counts over days post infection, line graphs of fold change over days post infection, and clustered heat maps on fold change data."
          />
          <FAQCard
            question="Can I use search results in a publication?"
            answer="Currently this database is meant as an exploratory tool to visualize data. It is not recommended for use as a rigorous analytical tool. However, data downloads are available for further analysis."
          />
        </Col>
        <Col md={12}>
          <FAQCard
            question="What types of files can I download?"
            answer="Spreadsheets (.csv) containing the requested gene expression levels or fold change can be downloaded. Additionally, all graphs are downloadable via the options button in the top right of each graph area."
          />
          <FAQCard
            question="Can the graphs be downloaded?"
            answer="Yes, the graphs have a built-in download function. Simply click the context menu in the top right corner of the graph to download a PNG, JPEG, PDF, or SVG copy of the graph."
          />
          <FAQCard
            question="How do I create an account?"
            answer="Accounts will only be created for Connor lab members and collaborators. Please click on 'Register' on the database homepage and follow the instructions."
          />
          <FAQCard
            question="I can't seem to find the gene I am looking for. How can I search for it?"
            answer="Our search page has a 'Browse Database' tab that will allow you to search for genes included in the datasets. If your gene was not found, it is likely not included in the available datasets. Please contact us if you have further questions about your gene."
          />
          <FAQCard
            question="Where can I get more information about the Nanostring Codeset?"
            answer="The NanoString datasets from the USAMRIID work resulted in the NHP Immunology NanoString codset. More information can be found on the NanoString website."
          />
          <FAQCard
            question="When was the database last updated?"
            answer="The data was last updated on 8/29/2024."
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Help;
