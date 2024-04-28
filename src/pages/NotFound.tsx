import { Button, Result } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {};

const NotFound = (props: Props) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('pageNotExist')}
      extra={
        <Button style={{ backgroundColor: '#d4041c' }} type="primary" onClick={() => navigate('/waze-data-analysis/')}>
          {t('backHome')}
        </Button>
      }
    />
  );
};

export default NotFound;
