import TableTemplate from "../Misc/TableTemplate";

interface ExpressionDataProps {
  countsTable: any[]; // Change to the actual type of countsTable
  foldChangeTable: any[];
  DPIList: number[];
}

const ExpressionData: React.FC<ExpressionDataProps> = ({
  countsTable,
  foldChangeTable,
  DPIList,
}) => {
  const staticFields = ["Gene", "Virus", "Datatype", "Strain", "Study_Name"];
  // Dynamic DPI fields
  const dpiFields = DPIList.map((dpi) => `${dpi} DPI`);

  // Combine static fields and dynamic DPI fields
  const Fields = [...staticFields, ...dpiFields];
  console.log(foldChangeTable);
  return (
    <div>
      <h3>
        Expression Pattern Over Time (Counts Per Million) - Days Post Infection
      </h3>
      <div>
        <TableTemplate
          data={countsTable}
          fields={Fields}
          showAddToCart={false}
        />
      </div>
      <br />
      <h3>Fold Change Over Time (Log2) - Days Post Infection</h3>
      <TableTemplate
        data={foldChangeTable}
        fields={Fields}
        showAddToCart={false}
      />
    </div>
  );
};

export default ExpressionData;
