'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined, RocketOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

      const data = await response.json();

      if (data.success) {
        message.success('Đăng nhập thành công!');
        router.push('/admin');
      } else {
        message.error(data.message || 'Sai tên đăng nhập hoặc mật khẩu');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Blobs for Visual Interest */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Card className="login-card">
          <div className="login-header">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="logo-icon"
            >
              <RocketOutlined />
            </motion.div>
            <Title level={2} className="login-title">VABSO ADMIN</Title>
            <Text className="login-subtitle">Chào mừng bạn quay trở lại hệ thống quản trị</Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input 
                prefix={<UserOutlined className="input-icon" />} 
                placeholder="Tên đăng nhập" 
                className="custom-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Mật khẩu"
                className="custom-input"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                block
                className="login-submit-btn"
              >
                XÁC NHẬN ĐĂNG NHẬP
              </Button>
            </Form.Item>
          </Form>

          <div className="login-footer">
            <Link href="/" className="back-link">
              <ArrowLeftOutlined /> Quay lại trang chủ
            </Link>
          </div>
        </Card>
      </motion.div>

      <style jsx global>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fdf2f2; /* Nền hồng nhạt theo tông cũ */
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        .bg-blob {
          position: absolute;
          width: 500px;
          height: 500px;
          filter: blur(80px);
          border-radius: 50%;
          z-index: 0;
          opacity: 0.5;
        }

        .blob-1 {
          background: #ff4d4f;
          top: -100px;
          right: -100px;
          animation: float 10s infinite alternate;
        }

        .blob-2 {
          background: #1890ff;
          bottom: -100px;
          left: -100px;
          animation: float 15s infinite alternate-reverse;
        }

        @keyframes float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border: 1px solid rgba(255,255,255,0.7);
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          z-index: 1;
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-icon {
          font-size: 48px;
          color: #ff4d4f;
          margin-bottom: 16px;
        }

        .login-title {
          margin-bottom: 8px !important;
          letter-spacing: 2px;
          color: #d32f2f !important;
          font-weight: 800 !important;
        }

        .login-subtitle {
          color: #666;
          font-size: 14px;
        }

        .custom-input {
          border-radius: 12px !important;
          padding: 12px 16px !important;
          background: rgba(255,255,255,0.8) !important;
          border: 1px solid #eee !important;
          transition: all 0.3s;
        }

        .custom-input:hover, .custom-input:focus {
          border-color: #ff4d4f !important;
          box-shadow: 0 0 0 2px rgba(255,77,79,0.1) !important;
        }

        .input-icon {
          color: #bfbfbf;
        }

        .login-submit-btn {
          height: 52px !important;
          border-radius: 12px !important;
          font-weight: 700 !important;
          background: linear-gradient(135deg, #ff4d4f 0%, #d32f2f 100%) !important;
          border: none !important;
          box-shadow: 0 8px 16px rgba(211,47,47,0.2) !important;
          margin-top: 10px;
        }

        .login-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 20px rgba(211,47,47,0.3) !important;
        }

        .login-footer {
          text-align: center;
          margin-top: 24px;
        }

        .back-link {
          color: #999;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .back-link:hover {
          color: #ff4d4f;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}
