'use client';

import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Spin, 
  message,
  Layout,
  Button,
  Divider
} from 'antd';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  BarChartOutlined,
  HomeOutlined,
  EyeOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRes, queRes] = await Promise.all([
        fetch('/api/responses'),
        fetch('/api/admin/questions')
      ]);
      const resData = await resRes.json();
      const queData = await queRes.json();
      
      setData(Array.isArray(resData) ? resData : []);
      setQuestions(Array.isArray(queData) ? queData : []);
    } catch (error) {
      message.error('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  const getLineData = () => {
    const counts: any = {};
    const last7Days = Array.from({length: 7}).map((_, i) => dayjs().subtract(i, 'day').format('DD/MM')).reverse();
    
    last7Days.forEach(date => counts[date] = 0);
    
    data.forEach(item => {
      const date = dayjs(item.submittedAt).format('DD/MM');
      if (counts[date] !== undefined) {
        counts[date] += 1;
      }
    });
    return Object.keys(counts).map(date => ({ name: date, count: counts[date] }));
  };

  const getRegionData = () => {
    const counts: any = {};
    data.forEach(item => {
      const regions = item.data?.q6 || item.q6;
      if (Array.isArray(regions)) {
        regions.forEach(r => counts[r] = (counts[r] || 0) + 1);
      }
    });
    return Object.keys(counts).map(r => ({ name: r, value: counts[r] }));
  };

  const getInterestData = () => {
    const counts: any = {};
    data.forEach(item => {
      const interests = item.data?.q15 || item.q15;
      if (Array.isArray(interests)) {
        interests.forEach(i => counts[i] = (counts[i] || 0) + 1);
      }
    });
    return Object.keys(counts)
      .map(i => ({ name: i, count: counts[i] }))
      .sort((a,b) => b.count - a.count)
      .slice(0, 6);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      message.error('Lỗi khi đăng xuất');
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}><Spin size="large" description="Đang phân tích dữ liệu..." /></div>;

  return (
    <Layout className="admin-layout">
      <Header className="admin-header">
        <div className="header-content">
          <div className="admin-logo" onClick={() => router.push('/admin')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon"><BarChartOutlined /></div>
            <div className="logo-text">VABSO <span>ANALYTICS</span></div>
          </div>
          <div className="nav-menu">
            <Button className="nav-btn" icon={<HomeOutlined />} onClick={() => router.push('/admin')}>Trang chủ</Button>
            <Button className="nav-btn active" icon={<BarChartOutlined />} onClick={() => router.push('/admin/statistics')}>Thống kê</Button>
            <Button className="nav-btn" icon={<OrderedListOutlined />} onClick={() => router.push('/admin/questions')}>Quản lý câu hỏi</Button>
            <Button className="nav-btn secondary" icon={<EyeOutlined />} onClick={() => router.push('/?preview=true')}>Xem khảo sát</Button>
            <span className="divider-vertical"></span>
            <Button className="logout-btn" icon={<LogoutOutlined />} onClick={handleLogout}>Đăng xuất</Button>
          </div>
        </div>
      </Header>

      <Content className="admin-content">
        <div className="content-inner">
          <div className="analytics-header">
            <div className="header-title-box">
              <Title level={2}>Báo cáo Phân tích Mạng lưới RSA</Title>
              <Text type="secondary">Phân tích chuyên sâu dữ liệu khảo sát và khả năng kết nối của hội viên VABSO</Text>
            </div>
            <div className="header-date-badge">
              <CalendarOutlined /> {dayjs().format('MMMM YYYY')}
            </div>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="premium-stat-card bg-blue">
                <div className="card-top">
                  <div className="icon-box"><TeamOutlined /></div>
                  <div className="growth-tag">+12%</div>
                </div>
                <div className="card-bottom">
                  <Statistic title="Tổng phiếu hội viên" value={data.length} />
                  <div className="card-desc">Tăng trưởng ổn định so với tháng trước</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="premium-stat-card bg-red">
                <div className="card-top">
                  <div className="icon-box"><CalendarOutlined /></div>
                  <div className="growth-tag">Mới</div>
                </div>
                <div className="card-bottom">
                  <Statistic title="Phản hồi hôm nay" value={data.filter(r => dayjs(r.submittedAt).isSame(dayjs(), 'day')).length} />
                  <div className="card-desc">Số lượng phiếu tiếp nhận trong 24h qua</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="premium-stat-card bg-indigo">
                <div className="card-top">
                  <div className="icon-box"><ProjectOutlined /></div>
                  <div className="growth-tag">Động</div>
                </div>
                <div className="card-bottom">
                  <Statistic title="Cấu trúc câu hỏi" value={questions.length} />
                  <div className="card-desc">Các tiêu chí đánh giá đang được áp dụng</div>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={16}>
              <Card title="Nhịp độ phản hồi (7 ngày gần nhất)" className="premium-chart-card">
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <AreaChart data={getLineData()}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                      />
                      <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Phân bổ khu vực" className="premium-chart-card">
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={getRegionData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={8}
                        cornerRadius={10}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {getRegionData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24}>
              <Card title="Phân tích nhu cầu & Lĩnh vực ưu tiên" className="premium-chart-card">
                <div style={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <BarChart data={getInterestData()} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={220} axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 13, fontWeight: 500}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} />
                      <Bar dataKey="count" fill="#ef4444" radius={[0, 10, 10, 0]} barSize={25}>
                        {getInterestData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

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
          background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          color: white; font-size: 20px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        .logo-text { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: -0.5px; }
        .logo-text span { color: #4f46e5; font-weight: 500; font-size: 14px; margin-left: 4px; }

        .nav-menu { display: flex; align-items: center; gap: 8px; }
        .nav-btn {
          border: none !important; background: transparent !important; color: #64748b !important;
          font-weight: 600 !important; height: 40px !important; border-radius: 8px !important;
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

        .logout-btn { background: #fff1f0 !important; color: #f5222d !important; border: 1px solid #ffccc7 !important; border-radius: 8px !important; font-weight: 600 !important; }

        .admin-content { padding: 40px 60px; }
        .content-inner { max-width: 1400px; margin: 0 auto; }

        .analytics-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
        .header-title-box h2 { margin-bottom: 8px !important; font-weight: 800 !important; }
        .header-date-badge { background: white; padding: 10px 20px; border-radius: 12px; font-weight: 700; color: #1e293b; box-shadow: 0 4px 12px rgba(0,0,0,0.03); display: flex; align-items: center; gap: 10px; }

        .premium-stat-card { border-radius: 24px; border: none; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.03); transition: all 0.3s; }
        .premium-stat-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.07); }
        .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .icon-box { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .growth-tag { background: rgba(255,255,255,0.5); padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 12px; }
        
        .bg-blue { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); }
        .bg-blue .icon-box { background: #3b82f6; color: white; }
        .bg-blue .growth-tag { color: #1e40af; }

        .bg-red { background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); }
        .bg-red .icon-box { background: #ef4444; color: white; }
        .bg-red .growth-tag { color: #991b1b; }

        .bg-indigo { background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%); }
        .bg-indigo .icon-box { background: #4f46e5; color: white; }
        .bg-indigo .growth-tag { color: #3730a3; }

        .card-desc { margin-top: 10px; color: #64748b; font-size: 13px; font-weight: 500; }
        .premium-chart-card { border-radius: 24px; border: none; box-shadow: 0 10px 30px rgba(0,0,0,0.04); background: white; }
        .ant-card-head { border-bottom: none; padding: 24px 24px 0; }
        .ant-card-head-title { font-weight: 800; font-size: 18px; color: #1e293b; }

        @media (max-width: 768px) {
          .admin-header { padding: 0 20px; }
          .admin-content { padding: 20px; }
          .analytics-header { flex-direction: column; align-items: flex-start; gap: 20px; }
        }
      `}</style>
    </Layout>
  );
}
