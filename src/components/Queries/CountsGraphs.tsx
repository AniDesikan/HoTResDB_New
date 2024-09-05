import LineChart from "../Queries/LineChart";

function CountsGraphs({ countsResults }: { countsResults: any }) {
  return <LineChart countData={countsResults} />;
}

export default CountsGraphs;
