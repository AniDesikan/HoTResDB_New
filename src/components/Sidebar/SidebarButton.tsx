function SidebarButton({
    value,
    handleClick,
  }: {
    value: string;
    handleClick: () => void;
  }) {
    return (
      <div className="sidebar_button">
        <input type="button" value={value} onClick={handleClick} />
      </div>
    );
  }
  
  export default SidebarButton;
  