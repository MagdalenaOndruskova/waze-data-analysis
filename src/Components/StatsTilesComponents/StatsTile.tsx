const LiveTile = ({ icon, tileTitle, tileType }) => {
  return (
    <div className="cardbody" style={{ minWidth: 250 }}>
      <div>
        {icon}
        <h3>{tileTitle}</h3>
      </div>
      <div>{tileType}</div>
    </div>
  );
};

export default LiveTile;
