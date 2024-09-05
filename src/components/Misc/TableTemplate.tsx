import { useState } from "react";
import { Table, Button } from "react-bootstrap";

interface TableTemplateProps {
  data: (string | number | null)[][]; // Array of arrays where each element can be string, number, or null
  fields: string[]; // Array of column names
  showAddToCart?: boolean; // Optional boolean to show "Add to Cart" button
  onAddToCart?: (row: (string | number | null)[]) => void; // Optional function to handle add to cart action
  showGeneCardsLink?: boolean; // Optional boolean to show GeneCards Link column
}

function TableTemplate({
  data,
  fields,
  showAddToCart = false, // Default to false if not provided
  onAddToCart,
  showGeneCardsLink = false, // Default to false if not provided
}: TableTemplateProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const dataToShow = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Determine columns to display
  const columns = [...fields];
  if (showGeneCardsLink) {
    columns.push("GeneCards Link");
  }

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((field, index) => (
              <th key={index}>{field}</th>
            ))}
            {showAddToCart && <th>Add to Cart</th>}{" "}
            {/* Add column header for Add to Cart */}
          </tr>
        </thead>
        <tbody>
          {dataToShow.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => {
                const isGeneCardsLinkColumn =
                  columns[cellIndex] === "GeneCards Link";
                return (
                  <td key={cellIndex}>
                    {isGeneCardsLinkColumn && showGeneCardsLink ? (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`http://www.genecards.org/cgi-bin/carddisp.pl?gene=${row[3]}`}
                      >
                        Click for more information
                      </a>
                    ) : cell !== null ? (
                      cell
                    ) : (
                      "N/A"
                    )}
                  </td>
                );
              })}
              {showAddToCart && (
                <td>
                  <Button
                    onClick={() => onAddToCart && onAddToCart(row)}
                    variant="primary"
                  >
                    Add to Cart
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
        Page {currentPage + 1} of {totalPages}
      </div>
      <Button onClick={prevPage} disabled={currentPage === 0}>
        Previous
      </Button>
      <Button onClick={nextPage} disabled={currentPage === totalPages - 1}>
        Next
      </Button>
    </div>
  );
}

export default TableTemplate;
