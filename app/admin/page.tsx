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
  Divider 
} from 'antd';
import { 
  ArrowLeftOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  FileExcelOutlined,
  SearchOutlined,
  ReloadOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { QUESTIONS } from '@/constants/survey';

const { Title, Text } = Typography;

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

    // Flatten data for Excel
    const excelData = responses.map(item => {
      const row: any = {
        'Thời gian nộp': dayjs(item.submittedAt).format('DD/MM/YYYY HH:mm:ss'),
      };
      
      QUESTIONS.forEach(q => {
        const val = item[q.id];
        row[`${q.number}. ${q.label}`] = Array.isArray(val) ? val.join(', ') : val;
      });

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Responses');
    XLSX.writeFile(workbook, `Tong-hop-khao-sat-${dayjs().format('YYYY-MM-DD')}.xlsx`);
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên Doanh nghiệp',
      dataIndex: 'q1',
      key: 'q1',
      sorter: (a: any, b: any) => a.q1?.localeCompare(b.q1),
    },
    {
      title: 'Người liên hệ',
      dataIndex: 'q2',
      key: 'q2',
    },
    {
      title: 'SĐT',
      dataIndex: 'q4',
      key: 'q4',
    },
    {
      title: 'Thời gian gửi',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a: any, b: any) => dayjs(a.submittedAt).unix() - dayjs(b.submittedAt).unix(),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              icon={<EyeOutlined />} 
              onClick={() => {
                setSelectedResponse(record);
                setDetailVisible(true);
              }} 
            />
          </Tooltip>
          <Popconfirm 
            title="Xóa bản ghi này?" 
            description="Dữ liệu sẽ bị xóa vĩnh viễn khỏi server."
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredData = responses.filter(item => 
    item.q1?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.q2?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/')} style={{ marginBottom: 16 }}>
            Quay lại trang khảo sát
          </Button>
          <Title level={2} style={{ margin: 0 }}>Quản lý câu trả lời khảo sát</Title>
          <Text type="secondary">Hệ thống tổng hợp dữ liệu RSA / CLB Sao Đỏ</Text>
        </div>
        <Space size="middle">
          <Button icon={<ReloadOutlined />} onClick={fetchResponses} size="large">Làm mới</Button>
          <Button 
            type="primary" 
            icon={<FileExcelOutlined />} 
            onClick={exportAllToExcel}
            size="large"
            style={{ background: '#1d6f42', borderColor: '#1d6f42' }}
          >
            Xuất Excel Tổng Hợp ({responses.length})
          </Button>
          <Button 
            danger 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            size="large"
          >
            Đăng xuất
          </Button>
        </Space>
      </header>

      <Card className="section-card">
        <div style={{ marginBottom: 24 }}>
          <Input
            placeholder="Tìm kiếm theo tên doanh nghiệp hoặc người liên hệ..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ maxWidth: 500, height: '40px' }}
            allowClear
          />
        </div>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (total) => `Tổng số ${total} bản ghi` }}
        />
      </Card>

      {/* Chi tiết câu trả lời */}
      <Modal
        title={
          <Space>
            <EyeOutlined style={{ color: '#1677ff' }} />
            <span>CHI TIẾT PHIẾU KHẢO SÁT</span>
          </Space>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setDetailVisible(false)}>Đóng lại</Button>
        ]}
        width={900}
        centered
      >
        {selectedResponse && (
          <div style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: 16, paddingLeft: 8 }}>
            <Title level={4} style={{ color: '#002766', marginTop: 0 }}>{selectedResponse.q1}</Title>
            <Text type="secondary">Nộp vào lúc: {dayjs(selectedResponse.submittedAt).format('DD/MM/YYYY HH:mm:ss')}</Text>
            <Divider />
            
            {QUESTIONS.map(q => {
              const val = selectedResponse[q.id];
              return (
                <div key={q.id} style={{ marginBottom: 20 }}>
                  <Text strong style={{ color: '#555', fontSize: '15px' }}>{q.number}. {q.label}</Text>
                  <div style={{ marginTop: 8, padding: '12px', background: '#f9f9f9', borderRadius: '8px', borderLeft: '4px solid #1677ff' }}>
                    {Array.isArray(val) 
                      ? (val.length > 0 ? val.map((v: string) => <Tag key={v} color="blue" style={{ marginBottom: 4 }}>{v}</Tag>) : <Text type="secondary">Chưa trả lời</Text>)
                      : (val ? <Text style={{ whiteSpace: 'pre-wrap' }}>{val}</Text> : <Text type="secondary">Chưa trả lời</Text>)
                    }
                  </div>
                </div>
              );
            })}
            
            <Title level={5} style={{ marginTop: 32, color: '#1677ff' }}>Phần 4: Đầu mối kết nối</Title>
            <Table
              size="small"
              pagination={false}
              dataSource={selectedResponse.q21}
              rowKey="key"
              columns={[
                { title: 'Lĩnh vực', dataIndex: 'field', width: '20%' },
                { title: 'Họ tên', dataIndex: 'name', width: '20%' },
                { title: 'Chức danh', dataIndex: 'position', width: '20%' },
                { title: 'SĐT', dataIndex: 'phone', width: '20%' },
                { title: 'Email', dataIndex: 'email', width: '20%' },
              ]}
              bordered
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
