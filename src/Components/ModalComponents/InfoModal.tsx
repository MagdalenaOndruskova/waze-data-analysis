import { Button, Col, Modal, Row } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Brno from '../../assets/Brno.png';
import fit from '../../assets/fit.png';

const InfoModal = ({ openInfoModalState, setOpenInfoModalState, setOpenTour }) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={openInfoModalState}
      onCancel={() => setOpenInfoModalState(false)}
      title={t('app.title')}
      width={800}
      footer={
        <Row>
          <Col span={5}>
            <a href="https://www.brno.cz/" target="_blank">
              <img src={Brno} alt="Brno" />
            </a>
          </Col>
          <Col span={12}></Col>
          <Col span={5}>
            <a href="https://www.fit.vut.cz/" target="_blank">
              <img src={fit} alt="Fakulta informačných technológii VUT" style={{ width: '200px' }} />
            </a>
          </Col>
          <Col span={3}></Col>
        </Row>
      }
    >
      <p>{t('appDescription')}</p>
      <br />
      <div className="modalButtonDiv">
        <Button type="primary" onClick={() => setOpenTour(true)} className="modalButton">
          {t('tourButton')}
        </Button>
      </div>
    </Modal>
  );
};

export default InfoModal;
