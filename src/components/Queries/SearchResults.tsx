import TableTemplate from "../Misc/TableTemplate";

interface SearchResultsProps {
  geneTable: any[]; // Change to the actual type of geneTable
}

function SearchResults({ geneTable }: SearchResultsProps) {
  const geneFields: string[] = [
    "Human Ensembl ID",
    "Human Gene Symbol",
    "Macaque Ensembl ID",
    "Macaque Gene Symbol",
  ];

  return (
    <div>
      <TableTemplate
        data={geneTable}
        fields={geneFields}
        showAddToCart={false}
        showGeneCardsLink={true}
      />
    </div>
  );
}

export default SearchResults;
