function HelpTable({ fillExample }: { fillExample: () => void }) {
    return (
      <div className="help_table">
        <div className="sidebar_header">First time here?</div>
        <div className="sidebar">
          - Click{" "}
          <a target="_blank" href="Help">
            here
          </a>{" "}
          for help.
          <br />-
          <u style={{ cursor: "pointer" }} onClick={() => fillExample()}>
            Example Search
          </u>
          {/* Add onClick to the above statement to do */}
        </div>
      </div>
    );
  }
  
  export default HelpTable;
  