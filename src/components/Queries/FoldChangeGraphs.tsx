import LineChart from "./LineChart";

function FoldChangeGraphs({ foldChangeResults }: { foldChangeResults: any }) {
  return <LineChart countData={foldChangeResults} />;
}
export default FoldChangeGraphs;
