import ExperimentStats from "../Queries/ExperimentStats"; // assuming ExperimentStats is a separate component
import RNASeqUploadForm from "./RNASeqUploadForm";
import SampleUploadForm from "./SampleUploadForm";

const AddData = ({ selectedExperiment }: { selectedExperiment?: any }) => {
  if (!selectedExperiment) {
    return (
      <div>
        <RNASeqUploadForm />
        <SampleUploadForm />
      </div>
    );
  }

  return <ExperimentStats experiment={selectedExperiment} />;
};

export default AddData;
