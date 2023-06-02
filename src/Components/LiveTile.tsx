import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import { WarningOutlined } from '@ant-design/icons';

const Icon = <WarningOutlined />;

const LiveTile = ({ icon, tileTitle, tileType }) => {
  return (
    <Card className="cardbody">
      <Meta avatar={icon} title={tileTitle} description={tileType} />
    </Card>
  );
};

export default LiveTile;
