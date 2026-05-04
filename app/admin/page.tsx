'use client';

import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Card, 
  Typography, 
  Modal, 
  message, 
  Tag, 
  Input, 
  Tooltip, 
  Popconfirm, 
  Divider,
  Layout,
  Statistic,
  Row,
  Col
} from 'antd';
import { 
  DeleteOutlined, 
  EyeOutlined, 
  FileExcelOutlined,
  SearchOutlined,
  ReloadOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { QUESTIONS } from '@/constants/survey';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

export default function AdminPage() {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/responses');
      const data = await res.json();
      setResponses(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/responses?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        message.success('Đã xóa bản ghi');
        fetchResponses();
      }
    } catch (error) {
      message.error('Lỗi khi xóa');
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        message.success('Đã đăng xuất');
        router.push('/login');
      }
    } catch (error) {
      message.error('Lỗi khi đăng xuất');
    }
  };

  const exportAllToExcel = () => {
    if (responses.length === 0) {
      message.warning('Không có dữ liệu để xuất');
      return;
    }

    const excelData = responses.map(item => {
      const data = item.data || item;
      const row: any = {
        'Thời gian nộp': dayjs(item.submittedAt || data.submittedAt).format('DD/MM/YYYY HH:mm:ss'),
      };
      
      QUESTIONS.forEach(q => {
        const val = data[q.id];
        if (q.id === 'q21' && Array.isArray(val)) {
          row[`${q.number}. ${q.label}`] = val
            .filter(v => v.name || v.phone || v.email)
            .map(v => `${v.field}: ${v.name || 'N/A'} (${v.position || 'N/A'}) - SĐT: ${v.phone || 'N/A'} - Email: ${v.email || 'N/A'}`)
            .join('\n');
        } else if (Array.isArray(val)) {
          row[`${q.number}. ${q.label}`] = val.join(', ');
        } else {
          row[`${q.number}. ${q.label}`] = val || '';
        }
      });

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Responses');
    XLSX.writeFile(workbook, `Tong-hop-VABSO-${dayjs().format('YYYY-MM-DD')}.xlsx`);
  };

  const columns = [
    {
      title: 'DOANH NGHIỆP',
      dataIndex: 'q1',
      key: 'q1',
      render: (text: string, record: any) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text strong style={{ fontSize: '15px' }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.q2 || 'N/A'}</Text>
        </div>
      ),
      sorter: (a: any, b: any) => (a.q1 || '').localeCompare(b.q1 || ''),
    },
    {
      title: 'HỘI VIÊN CHÍNH',
      dataIndex: 'q11',
      key: 'q11',
      render: (text: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text>{text}</Text>
          <Tag color="cyan">{record.q12 || 'Hội viên'}</Tag>
        </Space>
      ),
    },
    {
      title: 'ĐẦU MỐI LIÊN HỆ',
      key: 'contact',
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.q16}</Text>
          <Text type="secondary">{record.q18_phone}</Text>
        </Space>
      ),
    },
    {
      title: 'THỜI GIAN',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date: string) => (
        <Space direction="vertical" size={0}>
          <Text>{dayjs(date).format('DD/MM/YYYY')}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{dayjs(date).format('HH:mm')}</Text>
        </Space>
      ),
      sorter: (a: any, b: any) => dayjs(a.submittedAt).unix() - dayjs(b.submittedAt).unix(),
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Chi tiết">
            <Button 
              shape="circle"
              icon={<EyeOutlined />} 
              onClick={() => {
                setSelectedResponse(record);
                setDetailVisible(true);
              }} 
              className="action-btn-view"
            />
          </Tooltip>
          <Popconfirm 
            title="Xác nhận xóa?" 
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button 
              shape="circle" 
              icon={<DeleteOutlined />} 
              danger 
              className="action-btn-delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredData = responses.filter(item => 
    item.q1?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.q11?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.q16?.toLowerCase().includes(searchText.toLowerCase())
  );

  const responsesToday = responses.filter(r => dayjs(r.submittedAt).isSame(dayjs(), 'day')).length;

  return (
    <Layout className="admin-layout">
      <Header className="admin-header">
        <div className="header-content">
          <Space size="large">
            <div className="admin-logo">
              <DashboardOutlined /> VABSO <span>Admin</span>
            </div>
          </Space>
          <Space>
            <Button icon={<HomeOutlined />} onClick={() => router.push('/')}>Trang chủ</Button>
            <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>Đăng xuất</Button>
          </Space>
        </div>
      </Header>

      <Content className="admin-content">
        <div className="content-inner">
          <Row gutter={[24, 24]} className="stats-row">
            <Col xs={24} sm={12} lg={8}>
              <motion.div whileHover={{ y: -5 }}>
                <Card className="stat-card">
                  <Statistic 
                    title="Tổng số lượt nộp" 
                    value={responses.length} 
                    prefix={<TeamOutlined />} 
                    valueStyle={{ color: '#1890ff', fontWeight: 800 }}
                  />
                  <div className="stat-footer">Tất cả dữ liệu từ trước đến nay</div>
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <motion.div whileHover={{ y: -5 }}>
                <Card className="stat-card">
                  <Statistic 
                    title="Nộp mới trong ngày" 
                    value={responsesToday} 
                    prefix={<CalendarOutlined />} 
                    valueStyle={{ color: '#52c41a', fontWeight: 800 }}
                  />
                  <div className="stat-footer">Cập nhật lúc {dayjs().format('HH:mm')}</div>
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} lg={8}>
              <div className="action-box">
                <Button 
                  type="primary" 
                  icon={<FileExcelOutlined />} 
                  block 
                  size="large"
                  onClick={exportAllToExcel}
                  className="btn-export"
                >
                  XUẤT DỮ LIỆU EXCEL
                </Button>
                <Button 
                  icon={<ReloadOutlined />} 
                  block 
                  size="large"
                  onClick={fetchResponses}
                  style={{ marginTop: 12 }}
                >
                  LÀM MỚI DỮ LIỆU
                </Button>
              </div>
            </Col>
          </Row>

          <Card className="table-card">
            <div className="table-header">
              <Title level={4}>Danh sách hội viên đã nộp phiếu</Title>
              <Input
                placeholder="Tìm kiếm doanh nghiệp, hội viên, đầu mối..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="search-input"
                allowClear
              />
            </div>
            <Table 
              columns={columns} 
              dataSource={filteredData} 
              loading={loading}
              rowKey="id"
              pagination={{ 
                pageSize: 10, 
                showTotal: (total) => `Tổng số ${total} bản ghi`,
                position: ['bottomCenter']
              }}
              className="custom-table"
            />
          </Card>
        </div>
      </Content>

      <Modal
        title={
          <div className="modal-title">
             <EyeOutlined /> CHI TIẾT PHIẾU KHẢO SÁT VABSO
          </div>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" type="primary" size="large" onClick={() => setDetailVisible(false)} className="btn-modal-close">
            ĐÓNG LẠI
          </Button>
        ]}
        width={1000}
        centered
        className="detail-modal"
      >
        {selectedResponse && (
          <div className="modal-body">
            <div className="modal-info-header">
              <Title level={3} style={{ margin: 0, color: '#d32f2f' }}>{selectedResponse.q1}</Title>
              <Text type="secondary">Mã số phiếu: {selectedResponse.id?.slice(0, 8).toUpperCase()}</Text>
              <br />
              <Tag color="gold" style={{ marginTop: 8 }}>
                Nộp lúc: {dayjs(selectedResponse.submittedAt).format('DD/MM/YYYY HH:mm:ss')}
              </Tag>
            </div>
            
            <Divider />
            
            <div className="questions-grid">
              {QUESTIONS.map(q => {
                const val = selectedResponse[q.id];
                if (q.id === 'q21') return null; // Hiển thị bảng riêng
                return (
                  <div key={q.id} className="question-item">
                    <Text className="q-label">{q.number}. {q.label}</Text>
                    <div className="q-answer">
                      {Array.isArray(val) 
                        ? (val.length > 0 ? val.map((v: string) => <Tag key={v} color="blue" className="ans-tag">{v}</Tag>) : <Text type="secondary">Trống</Text>)
                        : (val ? <Text className="ans-text">{val}</Text> : <Text type="secondary">Trống</Text>)
                      }
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Divider><Title level={5} style={{ color: '#1890ff' }}>BẢNG ĐẦU MỐI KẾT NỐI (PHẦN 4)</Title></Divider>
            <Table
              size="small"
              pagination={false}
              dataSource={selectedResponse.q21}
              rowKey="key"
              columns={[
                { title: 'Lĩnh vực', dataIndex: 'field', width: '20%', render: (t) => <Text strong>{t}</Text> },
                { title: 'Họ tên', dataIndex: 'name', width: '20%' },
                { title: 'Chức danh', dataIndex: 'position', width: '20%' },
                { title: 'SĐT', dataIndex: 'phone', width: '20%' },
                { title: 'Email', dataIndex: 'email', width: '20%' },
              ]}
              bordered
              className="inner-table"
            />
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .admin-layout {
          min-height: 100vh;
          background: #f0f2f5;
        }

        .admin-header {
          background: #fff;
          padding: 0 40px;
          height: 70px;
          line-height: 70px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .admin-logo {
          font-size: 20px;
          font-weight: 800;
          color: #d32f2f;
          letter-spacing: 1px;
        }

        .admin-logo span {
          color: #666;
          font-weight: 400;
        }

        .admin-content {
          padding: 32px 40px;
        }

        .content-inner {
          max-width: 1400px;
          margin: 0 auto;
        }

        .stats-row {
          margin-bottom: 32px;
        }

        .stat-card {
          border-radius: 16px;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          padding: 10px;
        }

        .stat-footer {
          margin-top: 12px;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #f0f0f0;
          padding-top: 8px;
        }

        .action-box {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .btn-export {
          height: 48px !important;
          background: #1d6f42 !important;
          border-color: #1d6f42 !important;
          border-radius: 12px !important;
          font-weight: 700 !important;
          box-shadow: 0 4px 10px rgba(29,111,66,0.2) !important;
        }

        .table-card {
          border-radius: 16px;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .search-input {
          max-width: 400px;
          height: 44px;
          border-radius: 12px;
        }

        .custom-table .ant-table-thead > tr > th {
          background: #fafafa;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 12px;
          color: #888;
        }

        .action-btn-view:hover {
          color: #1890ff !important;
          border-color: #1890ff !important;
          background: #e6f7ff !important;
        }

        .action-btn-delete:hover {
          background: #fff1f0 !important;
        }

        /* Modal Styles */
        .modal-title {
          font-size: 18px;
          font-weight: 800;
          color: #1890ff;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-body {
          padding: 10px 0;
        }

        .modal-info-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .questions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .question-item {
          background: #fcfcfc;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #f0f0f0;
        }

        .q-label {
          display: block;
          margin-bottom: 10px;
          color: #555;
          font-size: 14px;
          font-weight: 600;
        }

        .q-answer {
          color: #000;
          font-size: 15px;
        }

        .ans-text {
          white-space: pre-wrap;
          line-height: 1.6;
        }

        .ans-tag {
          margin-bottom: 6px;
          font-size: 13px;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .inner-table {
          border-radius: 12px;
          overflow: hidden;
        }

        .btn-modal-close {
          border-radius: 10px !important;
          padding: 0 40px !important;
        }

        @media (max-width: 768px) {
          .admin-header { padding: 0 20px; }
          .admin-content { padding: 20px; }
          .questions-grid { grid-template-columns: 1fr; }
          .header-content { flex-direction: column; height: auto; padding: 15px 0; gap: 10px; }
          .table-header { flex-direction: column; align-items: stretch; }
          .search-input { max-width: 100%; }
        }
      `}</style>
    </Layout>
  );
}
