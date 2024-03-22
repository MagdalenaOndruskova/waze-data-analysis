const StatsTile = ({ icon, tileTitle, tileType }) => {
  return (
    <div className="cardbody" style={{ minWidth: 200 }}>
      <div>
        {icon}
        <h3>{tileTitle}</h3>
      </div>
      <div>{tileType}</div>
    </div>
  );
};

export default StatsTile;
