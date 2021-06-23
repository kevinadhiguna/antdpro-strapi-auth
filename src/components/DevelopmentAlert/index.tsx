import { Alert } from 'antd';

const DevelopmentAlert = () => {
  return (
    <Alert
      message="Warning"
      description="This page is currently under the development..."
      type="warning"
      showIcon
      closable
      style={{ marginBottom: '8px' }}
    />
  );
};

export default DevelopmentAlert;
