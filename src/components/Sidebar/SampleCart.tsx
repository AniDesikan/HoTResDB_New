function SampleCart({
    samples,
    removeSample,
  }: {
    samples: string[];
    removeSample: (sample: string) => void;
  }) {
    const samplesList = samples.map((sample, index) => (
      <div key={index}>
        <a>
          {sample}
          <button
            className="xbutton"
            onClick={() => {
              removeSample(sample);
            }}
          >
            &#x2716;
          </button>
        </a>
        <br />
      </div>
    ));
  
    return (
      <div className="samplecart">
        {samples.length > 0 ? samplesList : "No Datasets in Cart"}
      </div>
    );
  }
  
  export default SampleCart;
  