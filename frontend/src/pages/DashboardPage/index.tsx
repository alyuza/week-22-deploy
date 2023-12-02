import React, { useEffect, useState } from 'react';
import { Form, Button, Space, Table, Card } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { API } from '../../utils/API';

const showAlert = (title: string, icon: 'success' | 'error') => {
  Swal.fire({
    title,
    icon,
    width: 600,
    padding: '3em',
    color: '#716add',
  });
}

interface DataType {
  id: string;
  title: string;
  status: string;
  priority: string;
  duedate: string;
  maker: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const validate = localStorage.getItem('token');
  if (!validate) {
    navigate('/')
  }

  const [dataList, setData] = useState<DataType[]>([]);
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API + '/api/tasks',
        { headers: { Authorization: `Bearer ${validate}` } });
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(API + `/api/tasks/${id}`,
        { headers: { Authorization: `Bearer ${validate}` } });
      showAlert('Delete Success !', 'success');
      fetchData();
    } catch (error) {
      console.error(error);
      showAlert(`Sorry, you don't have permission to delete user`, 'error');
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Do you really want to Logout ?',
      width: 600,
      padding: '3em',
      color: '#716add',
      showCancelButton: true,
      confirmButtonText: 'Logout',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear()
        navigate('/');
      }
    });
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '300px'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '160px'
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: '160px'
    },
    // {
    //   title: 'Maker',
    //   dataIndex: 'maker',
    //   key: 'maker',
    //   width: '120px'
    // },
    {
      title: 'Due Date',
      dataIndex: 'duedate',
      key: 'duedate',
      width: '180px',
      render: (duedate: string) => {
        const date = new Date(duedate);
        const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
        return <span>{formattedDate}</span>;

      },
    },
    {
      title: 'Action',
      key: 'action',
      width: '145px',
      render: (_, data) => (
        <Space size="middle">
          <Button type='primary' onClick={() => navigate(`/editTask/${data.id}`)}><EditOutlined /></Button>

          <Button type="primary" danger ghost onClick={() => handleDelete(data.id)}><DeleteOutlined /></Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="TO DO LIST" className="category-card" style={{ width: '1200px' }}>
      <Form.Item>
        <Button type="primary" className="add-button" onClick={() => navigate('/addTask')} style={{ marginRight: '950px' }}>Add New Task</Button>
        <Button type="primary" className="logout-button" onClick={handleLogout} >Logout</Button>
      </Form.Item>

      {dataList.length > 0 ? (
        <Table
          dataSource={dataList}
          columns={columns}
          pagination={{ pageSize: 5, total: dataList.length }}
          className="data-table"
        />
      ) : (
        <div></div>
      )}
    </Card>
  );
};

export default DashboardPage;