'use client';

import React from 'react';
import { Result, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { CheckCircleFilled, HomeOutlined, PrinterOutlined } from '@ant-design/icons';

const ThankYouPage = () => {
  const router = useRouter();

  return (
    <div style={{ padding: '100px 20px', minHeight: '100vh', background: '#fff' }}>
      <Result
        status="success"
        icon={<CheckCircleFilled style={{ color: '#52c41a' }} />}
        title="Cảm ơn bạn đã hoàn thành khảo sát!"
        subTitle="Thông tin của bạn đã được ghi nhận vào mạng lưới RSA / CLB Sao Đỏ. Chúng tôi sẽ sớm kết nối với doanh nghiệp của bạn."
        extra={[
          <Button 
            type="primary" 
            key="home" 
            icon={<HomeOutlined />} 
            onClick={() => router.push('/')}
          >
            Quay lại trang chủ
          </Button>,
          <Button 
            key="print" 
            icon={<PrinterOutlined />} 
            onClick={() => window.print()}
          >
            In phiếu khảo sát
          </Button>,
        ]}
      />
    </div>
  );
};

export default ThankYouPage;
