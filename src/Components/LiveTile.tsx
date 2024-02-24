import { Avatar, Card, Col, Row } from 'antd';
import Meta from 'antd/es/card/Meta';
import { WarningOutlined } from '@ant-design/icons';

const Icon = <WarningOutlined />;

const LiveTile = ({ icon, tileTitle, tileType }) => {
  return (
    <div className="cardbody" style={{ minWidth: 250 }}>
      {/* <Meta avatar={icon} title={tileTitle} description={tileType} /> */}
      <div>
        {icon}
        <h3>{tileTitle}</h3>
      </div>
      <div>{tileType}</div>
    </div>
  );
};

export default LiveTile;
