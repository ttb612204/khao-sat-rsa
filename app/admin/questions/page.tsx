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
  PlusSquareOutlined,
  EditOutlined, 
  DeleteOutlined, 
  ArrowLeftOutlined,
  BarsOutlined,
  OrderedListOutlined,
  FolderAddOutlined,
  DashboardOutlined,
  HomeOutlined,
  BarChartOutlined,
  EyeOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text } = Typography;
const { Header, Content } = Layout;
const { Option } = Select;

export default function QuestionsManagement() {
  const [sections, setSections] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  
  // Question Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [form] = Form.useForm();
  
  // Section Modal
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [sectionForm] = Form.useForm();

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      message.error('Không thể đăng xuất');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddEdit = (record?: any, sectionId?: string) => {
    setEditingQuestion(record || null);
    if (record) {
      form.setFieldsValue({
        ...record,
        options: Array.isArray(record.options) ? record.options : []
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ id: `q_${Date.now()}`, order_index: questions.length + 1, options: [] });
      if (sectionId) {
        form.setFieldsValue({ section_id: sectionId });
      }
    }
    setIsModalOpen(true);
  };

  const handleSectionAddEdit = (record?: any) => {
    setEditingSection(record || null);
    if (record) {
      sectionForm.setFieldsValue(record);
    } else {
      sectionForm.resetFields();
      sectionForm.setFieldsValue({ id: `section_${Date.now()}`, order_index: sections.length + 1 });
    }
    setIsSectionModalOpen(true);
  };

  const handleAddSubQuestion = (parentRecord: any) => {
    // Tìm xem đã có bao nhiêu con rồi để gợi ý số hiệu tiếp theo
    const parentNum = parentRecord.number.toString();
    const children = questions.filter(q => q.number.toString().startsWith(parentNum + '.'));
    const nextSub = children.length + 1;
    const nextNum = `${parentNum}.${nextSub}`;
    
    setEditingQuestion(null);
    form.resetFields();
    form.setFieldsValue({ 
      id: `q_${Date.now()}`, 
      section_id: parentRecord.section_id,
      number: nextNum,
      order_index: parentRecord.order_index + nextSub, // Đặt ngay sau cha
      options: [],
      required: false
    });
    setIsModalOpen(true);
  };

  const onFinish = async (values: any) => {
    try {
      // Tự động tính toán order_index từ số hiệu (number)
      // Ví dụ: 9.1 -> 910, 10 -> 1000 để đảm bảo sắp xếp đúng
      const numVal = parseFloat(values.number);
      const orderVal = isNaN(numVal) ? questions.length + 1 : Math.round(numVal * 100);

      const payload = { 
        ...values,
        order_index: orderVal,
        required: !!values.required
      };
      
      // Đảm bảo options là array và chỉ tồn tại cho radio/checkbox
      if (values.type === 'text' || values.type === 'textarea') {
        payload.options = null;
      }

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

  const onSectionFinish = async (values: any) => {
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        message.success(editingSection ? 'Đã cập nhật phần' : 'Đã thêm phần mới');
        setIsSectionModalOpen(false);
        fetchData();
      }
    } catch (error) {
      message.error('Lỗi khi lưu phần');
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

  const handleBulkDelete = async (ids?: React.Key[]) => {
    const targetIds = ids || selectedRowKeys;
    if (targetIds.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/questions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: targetIds, action: 'delete' }),
      });
      
      if (res.ok) {
        message.success(` Đã xóa thành công ${targetIds.length} câu hỏi`);
        setSelectedRowKeys([]);
        fetchData();
      }
    } catch (error) {
      message.error('Lỗi khi xóa hàng loạt');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    const qIds = questions.filter(q => q.section_id === sectionId).map(q => q.id);
    
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa toàn bộ phần này?',
      content: `Hành động này sẽ xóa phần và ${qIds.length} câu hỏi thuộc phần này.`,
      okText: 'Xóa ngay',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        setLoading(true);
        try {
          // Xóa câu hỏi trước
          if (qIds.length > 0) {
            await fetch('/api/admin/questions/bulk', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ids: qIds, action: 'delete' }),
            });
          }
          // Xóa phần
          await fetch(`/api/admin/sections?id=${sectionId}`, { method: 'DELETE' });
          message.success('Đã xóa phần và các câu hỏi liên quan');
          fetchData();
        } catch (error) {
          message.error('Lỗi khi xóa phần');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleRenumber = async () => {
    setLoading(true);
    try {
      const sorted = [...questions].sort((a, b) => a.order_index - b.order_index);
      let mainCounter = 0;
      let subCounter = 0;
      let lastMainNumber = 0;

      const updates = sorted.map((q) => {
        const isSub = q.number.toString().includes('.');
        
        if (!isSub) {
          mainCounter++;
          subCounter = 0;
          lastMainNumber = mainCounter;
          const newNum = mainCounter.toString();
          return { ...q, number: newNum, order_index: mainCounter * 100 };
        } else {
          subCounter++;
          const newNum = `${lastMainNumber}.${subCounter}`;
          return { ...q, number: newNum, order_index: lastMainNumber * 100 + subCounter };
        }
      });

      const res = await fetch('/api/admin/questions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: updates }),
      });
      
      if (res.ok) {
        message.success('Đã đánh số thông minh lại toàn bộ!');
        fetchData();
      }
    } catch (error) {
      message.error('Lỗi khi đánh số lại');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'SỐ HIỆU',
      dataIndex: 'number',
      key: 'number',
      width: 80,
      render: (val: string) => <Tag color="blue" style={{ fontWeight: 'bold' }}>{val}</Tag>
    },
    {
      title: 'NỘI DUNG CÂU HỎI',
      dataIndex: 'label',
      key: 'label',
      render: (text: string, record: any) => (
        <div>
          <Text strong style={{ fontSize: '15px' }}>{text}</Text>
          <div style={{ marginTop: 4 }}>
            <Tag color="orange">
              {record.type === 'contact_list' ? 'DANH SÁCH ĐẦU MỐI' : 
               record.type === 'info' ? 'THÔNG TIN' : 
               record.type === 'textarea' ? 'VĂN BẢN DÀI' : 
               record.type === 'radio' ? 'CHỌN MỘT' : 
               record.type === 'checkbox' ? 'CHỌN NHIỀU' : 'DÒNG NGẮN'}
            </Tag>
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
          <Button 
            icon={<PlusSquareOutlined />} 
            onClick={() => handleAddSubQuestion(record)} 
            title="Thêm câu hỏi con"
            style={{ color: '#52c41a', borderColor: '#52c41a' }}
          />
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
          <div className="admin-logo" onClick={() => router.push('/admin')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon"><OrderedListOutlined /></div>
            <div className="logo-text">VABSO <span>QUESTIONS</span></div>
          </div>
          <div className="nav-menu">
            <Button className="nav-btn" icon={<HomeOutlined />} onClick={() => router.push('/admin')}>Trang chủ</Button>
            <Button className="nav-btn" icon={<BarChartOutlined />} onClick={() => router.push('/admin/statistics')}>Thống kê</Button>
            <Button className="nav-btn active" icon={<OrderedListOutlined />} onClick={() => router.push('/admin/questions')}>Quản lý câu hỏi</Button>
            <Button className="nav-btn secondary" icon={<EyeOutlined />} onClick={() => router.push('/?preview=true')}>Xem khảo sát</Button>
            <span className="divider-vertical"></span>
            <Button className="logout-btn" icon={<LogoutOutlined />} onClick={handleLogout}>Đăng xuất</Button>
          </div>
        </div>
      </Header>

      <Content className="admin-content">
        <div className="content-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0 }}>QUẢN LÝ NỘI DUNG KHẢO SÁT</Title>
            <Button 
              icon={<OrderedListOutlined />} 
              onClick={handleRenumber}
              loading={loading}
            >
              Đánh số lại
            </Button>
          </div>
          <AnimatePresence>
            {sections.map((section, idx) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{ marginBottom: 32 }}
              >
                <Card 
                  title={
                    <Space>
                      <OrderedListOutlined style={{ color: '#d32f2f' }} />
                      <span style={{ fontSize: 18, fontWeight: 800 }}>{section.title}</span>
                      <Button type="text" icon={<EditOutlined />} onClick={() => handleSectionAddEdit(section)} />
                    </Space>
                  }
                  className="section-card"
                  extra={
                    <Space size="middle">
                      {selectedRowKeys.length > 0 && (
                        <Button 
                          danger 
                          type="primary" 
                          onClick={() => handleBulkDelete()}
                        >
                          Xóa {selectedRowKeys.length} câu đã chọn
                        </Button>
                      )}
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={() => handleAddEdit(null, section.id)}
                        className="btn-add-q"
                      >
                        Thêm câu hỏi
                      </Button>
                      <Tag color="purple" style={{ margin: 0 }}>Thứ tự: {section.order_index}</Tag>
                    </Space>
                  }
                >
                  {section.description && <div style={{ marginBottom: 16, color: '#666', fontStyle: 'italic' }}>{section.description}</div>}
                  <Table 
                    rowSelection={{
                      selectedRowKeys,
                      onChange: (keys) => setSelectedRowKeys(keys),
                    }}
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

      {/* Question Modal */}
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
            <Form.Item name="id" label="Mã ID (Tự động)">
              <Input disabled />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item 
              name="number" 
              label="Số hiệu câu hỏi" 
              rules={[{ required: true }]}
              tooltip="Nhập số (1, 2) hoặc số thập phân (9.1, 9.2). Hệ thống sẽ tự động dùng số này để sắp xếp thứ tự."
            >
              <Input placeholder="VD: 1, 2, 9.1, 9.2..." />
            </Form.Item>
            <Form.Item name="type" label="Loại câu hỏi" rules={[{ required: true }]}>
              <Select>
                <Option value="text">Dòng ngắn (Text)</Option>
                <Option value="textarea">Văn bản dài (Textarea)</Option>
                <Option value="radio">Chọn một (Radio)</Option>
                <Option value="checkbox">Chọn nhiều (Checkbox)</Option>
                <Option value="info">Chỉ hiển thị văn bản (Title/Info)</Option>
                <Option value="contact_list">Danh sách đầu mối (Contact List)</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              if (type === 'contact_list') {
                return (
                  <Form.Item 
                    name="helperText" 
                    label="Các trường thông tin con (Cách nhau bằng dấu phẩy)" 
                    tooltip="Ví dụ: Họ tên, Chức danh, Số điện thoại, Email"
                  >
                    <Input placeholder="Họ tên, Chức danh, Số điện thoại, Email..." />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item name="label" label="Nội dung câu hỏi" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Nhập nội dung câu hỏi..." />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              if (type === 'radio' || type === 'checkbox' || type === 'contact_list') {
                return (
                  <Card title={type === 'contact_list' ? "Danh sách các Lĩnh vực/Đầu mối" : "Danh sách lựa chọn"} size="small" style={{ marginBottom: 24, background: '#f8fafc' }}>
                    <Form.List name="options">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map((field, index) => {
                            const { key, ...restField } = field;
                            return (
                              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                  {...restField}
                                  label={`Lựa chọn ${index + 1}`}
                                  required={true}
                                  style={{ marginBottom: 0, width: '400px' }}
                                >
                                  <Input placeholder="Nhập tên lựa chọn..." />
                                </Form.Item>
                                <Button type="text" danger onClick={() => remove(field.name)} icon={<DeleteOutlined />} />
                              </Space>
                            );
                          })}
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginTop: 8 }}>
                            Thêm lựa chọn mới
                          </Button>
                        </>
                      )}
                    </Form.List>
                  </Card>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              if (type !== 'info') {
                return (
                  <Form.Item name="required" label="Bắt buộc trả lời" valuePropName="checked">
                    <Switch checkedChildren="Có" unCheckedChildren="Không" />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>
        </Form>
      </Modal>

      {/* Section Modal */}
      <Modal
        title={<Title level={4} style={{ margin: 0 }}>{editingSection ? 'SỬA THÔNG TIN PHẦN' : 'THÊM PHẦN MỚI'}</Title>}
        open={isSectionModalOpen}
        onCancel={() => setIsSectionModalOpen(false)}
        onOk={() => sectionForm.submit()}
        centered
        okText="Lưu phần"
        cancelText="Hủy"
      >
        <Form form={sectionForm} layout="vertical" onFinish={onSectionFinish} style={{ marginTop: 24 }}>
          <Form.Item name="id" label="Mã ID Phần">
            <Input disabled />
          </Form.Item>
          <Form.Item name="title" label="Tiêu đề Phần" rules={[{ required: true }]}>
            <Input placeholder="VD: PHẦN 6. THÔNG TIN KHÁC" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (Không bắt buộc)">
            <Input.TextArea rows={2} placeholder="Nhập mô tả ngắn cho phần này..." />
          </Form.Item>
          <Form.Item name="order_index" label="Thứ tự hiển thị" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .admin-layout {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', sans-serif !important;
        }

        .admin-header {
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(12px);
          padding: 0 60px;
          height: 80px;
          line-height: 80px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .admin-logo { display: flex; align-items: center; gap: 12px; }
        .logo-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          color: white; font-size: 20px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .logo-text { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: -0.5px; }
        .logo-text span { color: #10b981; font-weight: 500; font-size: 14px; margin-left: 4px; }

        .nav-menu { display: flex; align-items: center; gap: 8px; }
        .nav-btn {
          border: none !important; background: transparent !important; color: #64748b !important;
          font-weight: 600 !important; height: 40px !important; border-radius: 8px !important;
          transition: all 0.2s !important;
        }
        .nav-btn:hover { background: #f1f5f9 !important; color: #1e293b !important; }
        .nav-btn.active { background: #eef2ff !important; color: #4f46e5 !important; }
        .nav-btn.secondary { background: #f8fafc !important; border: 1px solid #e2e8f0 !important; margin-left: 8px; }

        .divider-vertical {
          width: 1px;
          height: 32px;
          background: #e2e8f0;
          margin: 0 12px;
        }

        .logout-btn {
          background: #fff1f0 !important;
          color: #f5222d !important;
          border: 1px solid #ffccc7 !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
        }

        .admin-content { padding: 40px 60px; }
        .content-inner { max-width: 1400px; margin: 0 auto; }
        
        .section-card { 
          border-radius: 24px; border: none; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.04); 
          overflow: hidden; margin-bottom: 32px;
        }
        .section-card .ant-card-head { background: #f8fafc; border-bottom: 1px solid #f1f5f9; padding: 20px 24px; }
        .btn-add-q { background: #d32f2f !important; border-radius: 10px !important; height: 40px !important; font-weight: 700 !important; }
        
        @media (max-width: 768px) {
          .admin-header { padding: 0 20px; }
          .admin-content { padding: 20px; }
          .header-content { flex-direction: column; height: auto; padding: 15px 0; gap: 15px; }
        }
      `}</style>
    </Layout>
  );
}
