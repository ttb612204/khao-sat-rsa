'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success) {
        message.success('Đăng nhập thành công');
        router.push('/admin');
      } else {
        message.error(result.message || 'Sai thông tin đăng nhập');
      }
    } catch (error) {
      message.error('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at top left, #fff1f0 0%, #ffffff 50%, #fff8f7 100%)',
      padding: '24px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card 
          className="section-card"
          style={{ width: '100%', maxWidth: 400, padding: '24px 12px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Title level={2} style={{ 
              color: '#ff4d4f', 
              fontFamily: 'Times New Roman, serif',
              marginBottom: 8
            }}>
              QUẢN TRỊ VIÊN
            </Title>
            <Text type="secondary">Vui lòng đăng nhập để tiếp tục</Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
                placeholder="Tên đăng nhập" 
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Mật khẩu"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                style={{ 
                  height: '48px', 
                  borderRadius: '8px',
                  background: '#ff4d4f',
                  borderColor: '#ff4d4f',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                ĐĂNG NHẬP
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Button 
                type="link" 
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push('/')}
                style={{ color: '#8c8c8c' }}
              >
                Quay lại trang chủ
              </Button>
            </div>
          </Form>
        </Card>
      </motion.div>

      <style jsx global>{`
        .section-card {
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(12px) !important;
          border-radius: 20px !important;
          border: 1px solid rgba(255, 255, 255, 0.4) !important;
          box-shadow: 0 8px 32px 0 rgba(135, 31, 31, 0.07) !important;
        }
      `}</style>
    </div>
  );
}
