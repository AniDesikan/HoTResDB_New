function GeneCart({
    genes,
    removeGene,
  }: {
    genes: string[];
    removeGene: (Gene: string) => void;
  }) {
    const GenesList = genes.map((gene, index) => (
      <div key={index}>
        <a>
          {gene}
          <button
            className="xbutton"
            onClick={() => {
              removeGene(gene);
            }}
          >
            &#x2716;
          </button>
        </a>
        <br />
      </div>
    ));
  
    return (
      <div className="Genecart">
        {genes.length > 0 ? GenesList : "No Datasets in Cart"}
      </div>
    );
  }
  
  export default GeneCart;
  