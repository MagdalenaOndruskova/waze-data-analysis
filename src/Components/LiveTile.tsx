import { Avatar, Card, Col, Row } from 'antd';
import Meta from 'antd/es/card/Meta';
import { WarningOutlined } from '@ant-design/icons';

const Icon = <WarningOutlined />;

const LiveTile = ({ icon, tileTitle, tileType }) => {
  return (
    <Card className="cardbody">
      {/* <Meta avatar={icon} title={tileTitle} description={tileType} /> */}
      <Row>
        <Col lg={12}>{icon}</Col>
        <Col lg={12}>
          <h3>{tileTitle}</h3>
        </Col>
      </Row>
      <Row>{tileType}</Row>
    </Card>
  );
};

export default LiveTile;
