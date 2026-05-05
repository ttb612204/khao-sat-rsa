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
  HomeOutlined,
  OrderedListOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

export default function AdminPage() {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dynamicQuestions, setDynamicQuestions] = useState<any[]>([]);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRes, queRes] = await Promise.all([
        fetch('/api/responses'),
        fetch('/api/admin/questions')
      ]);
      const resData = await resRes.json();
      const queData = await queRes.json();
      setResponses(Array.isArray(resData) ? resData : []);
      setDynamicQuestions(Array.isArray(queData) ? queData : []);
    } catch (error) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/responses?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        message.success('Đã xóa bản ghi');
        fetchData();
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
      
      dynamicQuestions.forEach(q => {
        const val = data[q.id];
        if (q.type === 'contact_list' && Array.isArray(val)) {
          row[`${q.number}. ${q.label}`] = val
            .filter(v => Object.values(v).some(val => val !== '' && val !== v.field))
            .map(v => {
              const details = Object.entries(v)
                .filter(([k]) => k !== 'field')
                .map(([k, v]) => `${k}: ${v}`)
                .join(' | ');
              return `${v.field}: ${details}`;
            })
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
        <Space orientation="vertical" size={0}>
          <Text>{text}</Text>
          <Tag color="cyan">{record.q12 || 'Hội viên'}</Tag>
        </Space>
      ),
    },
    {
      title: 'ĐẦU MỐI LIÊN HỆ',
      key: 'contact',
      render: (_: any, record: any) => (
        <Space orientation="vertical" size={0}>
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
        <Space orientation="vertical" size={0}>
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
          <div className="admin-logo" onClick={() => router.push('/admin')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon"><DashboardOutlined /></div>
            <div className="logo-text">VABSO <span>ADMIN</span></div>
          </div>
          <div className="nav-menu">
            <Button className="nav-btn active" icon={<HomeOutlined />} onClick={() => router.push('/admin')}>Trang chủ</Button>
            <Button className="nav-btn" icon={<BarChartOutlined />} onClick={() => router.push('/admin/statistics')}>Thống kê</Button>
            <Button className="nav-btn" icon={<OrderedListOutlined />} onClick={() => router.push('/admin/questions')}>Quản lý câu hỏi</Button>
            <Button className="nav-btn secondary" icon={<EyeOutlined />} onClick={() => router.push('/?preview=true')}>Xem khảo sát</Button>
            <span className="divider-vertical"></span>
            <Button className="logout-btn" icon={<LogoutOutlined />} onClick={handleLogout}>Đăng xuất</Button>
          </div>
        </div>
      </Header>

      <Content className="admin-content">
        <div className="content-inner">
          <div className="welcome-banner">
            <div className="banner-text">
              <Title level={2}>Chào mừng trở lại, Quản trị viên!</Title>
              <Text>Hệ thống hiện đang hoạt động ổn định. Bạn có {responses.length} phiếu khảo sát mới cần xem.</Text>
            </div>
            <div className="banner-actions">
              <Button 
                type="primary" 
                icon={<FileExcelOutlined />} 
                size="large"
                onClick={exportAllToExcel}
                className="premium-btn-export"
              >
                XUẤT BÁO CÁO EXCEL
              </Button>
            </div>
          </div>

          <Row gutter={[24, 24]} className="stats-row">
            <Col xs={24} sm={12} lg={8}>
              <motion.div whileHover={{ y: -8, transition: { duration: 0.2 } }} style={{ height: '100%' }}>
                <Card className="stat-card-premium total">
                  <div className="stat-icon-wrapper"><TeamOutlined /></div>
                  <div className="stat-info">
                    <Text className="stat-label">Tổng số lượt nộp</Text>
                    <Title level={2} className="stat-value" style={{ margin: 0 }}>{responses.length}</Title>
                    <Text className="stat-action-text">Dữ liệu từ lúc bắt đầu</Text>
                  </div>
                  <div className="stat-badge">Toàn thời gian</div>
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <motion.div whileHover={{ y: -8, transition: { duration: 0.2 } }} style={{ height: '100%' }}>
                <Card className="stat-card-premium today">
                  <div className="stat-icon-wrapper"><CalendarOutlined /></div>
                  <div className="stat-info">
                    <Text className="stat-label">Nộp mới hôm nay</Text>
                    <Title level={2} className="stat-value" style={{ margin: 0 }}>{responsesToday}</Title>
                    <Text className="stat-action-text">Phản hồi trong 24h qua</Text>
                  </div>
                  <div className="stat-badge">Hôm nay</div>
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} lg={8}>
              <motion.div whileHover={{ y: -8, transition: { duration: 0.2 } }} style={{ height: '100%' }}>
                <Card className="stat-card-premium reload" onClick={fetchData}>
                  <div className="stat-icon-wrapper"><ReloadOutlined spin={loading} /></div>
                  <div className="stat-info">
                    <Text className="stat-label">Trạng thái hệ thống</Text>
                    <Title level={2} className="stat-value" style={{ margin: 0, fontSize: '28px' }}>ỔN ĐỊNH</Title>
                    <Text className="stat-action-text">Nhấn để làm mới dữ liệu</Text>
                  </div>
                  <div className="stat-badge">Hệ thống</div>
                </Card>
              </motion.div>
            </Col>
          </Row>

          <Card className="table-card-premium">
            <div className="table-header-premium">
              <div className="header-left">
                <Title level={4}>Danh sách doanh nghiệp hội viên</Title>
                <Text type="secondary">Quản lý và xem chi tiết các phiếu khảo sát đã gửi</Text>
              </div>
              <div className="header-right">
                <Input
                  placeholder="Tìm kiếm thông tin..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  className="search-input-premium"
                  allowClear
                />
              </div>
            </div>
            <Table 
              columns={columns} 
              dataSource={filteredData} 
              loading={loading}
              rowKey="id"
              pagination={{ 
                pageSize: 10, 
                showTotal: (total) => `Tổng cộng ${total} bản ghi`,
                placement: ['bottomCenter'],
                showSizeChanger: false
              }}
              className="premium-table"
            />
          </Card>
        </div>
      </Content>

      <Modal
        title={
          <div className="premium-modal-header">
            <EyeOutlined /> <span>CHI TIẾT PHIẾU KHẢO SÁT VABSO</span>
          </div>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" type="primary" size="large" onClick={() => setDetailVisible(false)} className="premium-modal-btn">
            ĐÓNG LẠI
          </Button>
        ]}
        width={1000}
        centered
        className="premium-modal"
      >
        {selectedResponse && (
          <div className="modal-content-premium">
            <div className="detail-hero">
              <Title level={2}>{selectedResponse.q1}</Title>
              <div className="hero-meta">
                <Tag color="red" icon={<CalendarOutlined />}>
                  {dayjs(selectedResponse.submittedAt).format('DD/MM/YYYY HH:mm')}
                </Tag>
                <Text type="secondary">ID: {selectedResponse.id?.slice(0, 8).toUpperCase()}</Text>
              </div>
            </div>
            
            <Divider plain><Text strong style={{ color: '#888' }}>THÔNG TIN CHI TIẾT</Text></Divider>
            
            <div className="detail-grid">
              {dynamicQuestions.map(q => {
                const val = selectedResponse.data?.[q.id] || selectedResponse[q.id];
                if (q.type === 'contact_list') return null;
                return (
                  <div key={q.id} className="detail-card">
                    <div className="detail-label">{q.number}. {q.label}</div>
                    <div className="detail-value">
                      {Array.isArray(val) 
                        ? (val.length > 0 ? val.map((v: string) => <Tag key={v} color="processing" className="ans-tag-premium">{v}</Tag>) : '-')
                        : (val || '-')
                      }
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="detail-section-title">
              <BarChartOutlined /> <span>BẢNG ĐẦU MỐI KẾT NỐI CHUYÊN MÔN</span>
            </div>
            {dynamicQuestions.filter(q => q.type === 'contact_list').map(q => {
              const val = selectedResponse.data?.[q.id] || selectedResponse[q.id];
              const subFields = q.helperText ? q.helperText.split(',').map((s: string) => s.trim()) : ['Họ tên', 'Chức danh', 'Số điện thoại', 'Email'];
              const columns = [
                { title: 'Lĩnh vực', dataIndex: 'field', width: '25%', render: (t: any) => <Text strong style={{ color: '#1890ff' }}>{t}</Text> },
                ...subFields.map((f: string) => ({ title: f, dataIndex: f }))
              ];

              return (
                <div key={q.id} className="contact-table-wrapper">
                  <div className="table-subtitle">{q.number}. {q.label}</div>
                  <Table
                    size="small"
                    pagination={false}
                    dataSource={val}
                    rowKey="field"
                    columns={columns}
                    bordered
                    className="premium-inner-table"
                  />
                </div>
              );
            })}
          </div>
        )}
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

        .admin-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .logo-text {
          font-size: 20px;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.5px;
        }

        .logo-text span {
          color: #ef4444;
          font-weight: 500;
          font-size: 14px;
          margin-left: 4px;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-btn {
          border: none !important;
          background: transparent !important;
          color: #64748b !important;
          font-weight: 600 !important;
          height: 40px !important;
          border-radius: 8px !important;
          transition: all 0.2s !important;
        }

        .nav-btn:hover {
          background: #f1f5f9 !important;
          color: #1e293b !important;
        }

        .nav-btn.active {
          background: #eef2ff !important;
          color: #4f46e5 !important;
        }

        .nav-btn.secondary {
          background: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          margin-left: 8px;
        }

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

        .admin-content {
          padding: 40px 60px;
        }

        .content-inner {
          max-width: 1400px;
          margin: 0 auto;
        }

        .welcome-banner {
          background: linear-gradient(105deg, #1e293b 0%, #334155 100%);
          padding: 40px;
          border-radius: 24px;
          margin-bottom: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          box-shadow: 0 20px 40px rgba(30, 41, 59, 0.15);
        }

        .welcome-banner h2 { color: white !important; margin-bottom: 8px !important; }
        .welcome-banner span { color: #cbd5e1 !important; font-size: 16px; }

        .premium-btn-export {
          background: #10b981 !important;
          border: none !important;
          height: 52px !important;
          padding: 0 32px !important;
          border-radius: 14px !important;
          font-weight: 700 !important;
          box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3) !important;
          transition: all 0.3s !important;
        }

        .premium-btn-export:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(16, 185, 129, 0.4) !important;
        }

        .stat-card-premium {
          border-radius: 24px;
          border: none;
          padding: 30px 24px;
          height: 100%;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.03);
          background: white;
          transition: all 0.3s ease;
        }

        .stat-icon-wrapper {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 12px;
        }

        .total .stat-icon-wrapper { background: #eff6ff; color: #3b82f6; }
        .total .stat-value { color: #1e3a8a !important; }

        .today .stat-icon-wrapper { background: #f0fdf4; color: #22c55e; }
        .today .stat-value { color: #14532d !important; }

        .reload { cursor: pointer; border: 1px dashed #e2e8f0; }
        .reload .stat-icon-wrapper { background: #fff7ed; color: #f59e0b; }
        .reload .stat-value { color: #9a3412 !important; }

        .stat-label { color: #64748b; font-weight: 600; font-size: 14px; }
        .stat-value { margin: 4px 0 !important; font-weight: 800 !important; font-size: 36px !important; }
        .stat-badge { position: absolute; top: 24px; right: 24px; background: #f1f5f9; padding: 4px 12px; border-radius: 20px; font-size: 12px; color: #475569; font-weight: 700; }
        .stat-action-text { font-size: 12px; color: #94a3b8; font-weight: 500; }

        .stats-row {
          margin-bottom: 48px !important;
        }

        .table-card-premium {
          border-radius: 24px;
          border: none;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          padding: 10px;
          margin-top: 0;
          background: white;
        }

        .table-header-premium {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 10px 30px;
        }

        .header-left h4 { margin: 0 0 4px 0 !important; font-weight: 800 !important; color: #1e293b; }

        .search-input-premium {
          width: 350px;
          height: 48px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .premium-table .ant-table { background: transparent; }
        .premium-table .ant-table-thead > tr > th {
          background: #f8fafc;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #f1f5f9;
        }

        .premium-table .ant-table-tbody > tr > td { padding: 20px 16px; }
        .premium-table .ant-table-tbody > tr:hover > td { background: #f8fafc !important; }

        /* Modal Premium */
        .premium-modal .ant-modal-content { border-radius: 28px; padding: 0; overflow: hidden; }
        .premium-modal-header { display: flex; align-items: center; gap: 12px; color: #1e293b; font-weight: 800; font-size: 18px; padding: 24px 32px; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
        .modal-content-premium { padding: 32px; }
        .detail-hero { margin-bottom: 32px; }
        .hero-meta { display: flex; align-items: center; gap: 16px; margin-top: 12px; }
        .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; }
        .detail-card { background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #f1f5f9; }
        .detail-label { color: #64748b; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
        .detail-value { color: #1e293b; font-size: 15px; font-weight: 500; }
        .detail-section-title { display: flex; align-items: center; gap: 12px; margin: 40px 0 20px; color: #3b82f6; font-weight: 800; font-size: 16px; }
        .ans-tag-premium { margin-bottom: 4px; border-radius: 6px; }
        .table-subtitle { font-weight: 700; margin-bottom: 12px; color: #475569; }
        .premium-modal-btn { border-radius: 14px !important; height: 50px !important; font-weight: 700 !important; width: 200px; }

        @media (max-width: 1024px) {
          .admin-header { padding: 0 20px; }
          .admin-content { padding: 20px; }
          .welcome-banner { flex-direction: column; text-align: center; gap: 24px; }
          .search-input-premium { width: 100%; }
          .table-header-premium { flex-direction: column; align-items: stretch; gap: 20px; }
        }
      `}</style>
    </Layout>
  );
}
