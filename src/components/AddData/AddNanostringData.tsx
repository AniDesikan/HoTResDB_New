import ExperimentStats from "../Queries/ExperimentStats"; // assuming ExperimentStats is a separate component
import NanostringUploadForm from "../Nanostring/NanostringUploadForm";
import NanostringSampleUploadForm from "../Nanostring/NanostringSampleUploadForm";

const AddData = ({ selectedExperiment }: { selectedExperiment?: any }) => {
  if (!selectedExperiment) {
    return (
      <div>
        <NanostringUploadForm />
        <NanostringSampleUploadForm />
      </div>
    );
  }

  return <ExperimentStats experiment={selectedExperiment} />;
};

export default AddData;
