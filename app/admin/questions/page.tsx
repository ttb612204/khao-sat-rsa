'use client';

import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Card, 
  Typography, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Switch, 
  message, 
  Tag, 
  Divider,
  Layout,
  Popconfirm,
  Collapse
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ArrowLeftOutlined,
  BarsOutlined,
  OrderedListOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text } = Typography;
const { Header, Content } = Layout;
const { Option } = Select;
const { Panel } = Collapse;

export default function QuestionsManagement() {
  const [sections, setSections] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [form] = Form.useForm();
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sectionsRes, questionsRes] = await Promise.all([
        fetch('/api/admin/sections'),
        fetch('/api/admin/questions')
      ]);
      const sectionsData = await sectionsRes.json();
      const questionsData = await questionsRes.json();
      
      setSections(Array.isArray(sectionsData) ? sectionsData : []);
      setQuestions(Array.isArray(questionsData) ? questionsData : []);
    } catch (error) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddEdit = (record?: any) => {
    setEditingQuestion(record || null);
    if (record) {
      form.setFieldsValue({
        ...record,
        options: record.options ? JSON.stringify(record.options, null, 2) : '[]'
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const onFinish = async (values: any) => {
    try {
      // Parse options JSON
      let parsedOptions = [];
      try {
        parsedOptions = JSON.parse(values.options || '[]');
      } catch (e) {
        return message.error('Định dạng tùy chọn (JSON) không hợp lệ');
      }

      const payload = {
        ...values,
        options: parsedOptions,
        id: editingQuestion?.id || `q_${Date.now()}`
      };

      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        message.success(editingQuestion ? 'Đã cập nhật câu hỏi' : 'Đã thêm câu hỏi mới');
        setIsModalOpen(false);
        fetchData();
      }
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/questions?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        message.success('Đã xóa câu hỏi');
        fetchData();
      }
    } catch (error) {
      message.error('Lỗi khi xóa');
    }
  };

  const columns = [
    {
      title: 'TT',
      dataIndex: 'order_index',
      key: 'order_index',
      width: 60,
      render: (val: number) => <Tag color="blue">{val}</Tag>
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'NỘI DUNG CÂU HỎI',
      dataIndex: 'label',
      key: 'label',
      render: (text: string, record: any) => (
        <div>
          <Text strong style={{ fontSize: '15px' }}>{record.number}. {text}</Text>
          <div style={{ marginTop: 4 }}>
            <Tag color="orange">{record.type.toUpperCase()}</Tag>
            {record.required && <Tag color="red">BẮT BUỘC</Tag>}
          </div>
        </div>
      )
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleAddEdit(record)} />
          <Popconfirm title="Xóa câu hỏi này?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="admin-layout">
      <Header className="admin-header">
        <div className="header-content">
          <Space size="large">
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/admin')}>Quay lại Dashboard</Button>
            <div className="admin-logo">
              <BarsOutlined /> QUẢN LÝ CÂU HỎI <span>VABSO</span>
            </div>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => handleAddEdit()}>
            THÊM CÂU HỎI MỚI
          </Button>
        </div>
      </Header>

      <Content className="admin-content">
        <div className="content-inner">
          <AnimatePresence>
            {sections.map((section, idx) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{ marginBottom: 24 }}
              >
                <Card 
                  title={
                    <Space>
                      <OrderedListOutlined style={{ color: '#d32f2f' }} />
                      <span style={{ fontSize: 18, fontWeight: 800 }}>{section.title}</span>
                    </Space>
                  }
                  className="section-card"
                  extra={<Tag color="purple">Phần {section.order_index}</Tag>}
                >
                  <Table 
                    columns={columns} 
                    dataSource={questions.filter(q => q.section_id === section.id)}
                    pagination={false}
                    rowKey="id"
                    loading={loading}
                    className="question-table"
                  />
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Content>

      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            {editingQuestion ? 'CẬP NHẬT CÂU HỎI' : 'THÊM CÂU HỎI MỚI'}
          </Title>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={700}
        centered
        okText="Lưu lại"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="section_id" label="Thuộc phần" rules={[{ required: true }]}>
              <Select placeholder="Chọn phần">
                {sections.map(s => <Option key={s.id} value={s.id}>{s.title}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="id" label="Mã ID (Duy nhất)" tooltip="VD: q1, q2, q9_capital...">
              <Input placeholder="Tự động tạo nếu để trống" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <Form.Item name="number" label="Số thứ tự" rules={[{ required: true }]}>
              <Input placeholder="VD: 1, 2, 20.1..." />
            </Form.Item>
            <Form.Item name="type" label="Loại câu hỏi" rules={[{ required: true }]}>
              <Select>
                <Option value="text">Dòng ngắn (Text)</Option>
                <Option value="textarea">Văn bản dài (Textarea)</Option>
                <Option value="radio">Chọn một (Radio)</Option>
                <Option value="checkbox">Chọn nhiều (Checkbox)</Option>
              </Select>
            </Form.Item>
            <Form.Item name="order_index" label="Vị trí sắp xếp" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item name="label" label="Nội dung câu hỏi" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Nhập nội dung câu hỏi..." />
          </Form.Item>

          <Form.Item name="options" label="Danh sách lựa chọn (Định dạng JSON)" tooltip="Chỉ dùng cho Radio/Checkbox. VD: ['A', 'B', 'C']">
            <Input.TextArea rows={4} placeholder='VD: ["Lựa chọn 1", "Lựa chọn 2"]' />
          </Form.Item>

          <Form.Item name="required" label="Bắt buộc trả lời" valuePropName="checked">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .admin-layout { min-height: 100vh; background: #f0f2f5; }
        .admin-header { background: #fff; padding: 0 40px; height: 70px; line-height: 70px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100; }
        .header-content { display: flex; justify-content: space-between; align-items: center; max-width: 1400px; margin: 0 auto; width: 100%; }
        .admin-logo { font-size: 20px; font-weight: 800; color: #d32f2f; letter-spacing: 1px; }
        .admin-logo span { color: #666; font-weight: 400; }
        .admin-content { padding: 32px 40px; }
        .content-inner { max-width: 1400px; margin: 0 auto; }
        .section-card { border-radius: 16px; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; }
        .section-card .ant-card-head { background: #fafafa; border-bottom: 1px solid #f0f0f0; }
        .question-table .ant-table-thead > tr > th { background: #fff; font-weight: 700; color: #888; font-size: 12px; }
      `}</style>
    </Layout>
  );
}
