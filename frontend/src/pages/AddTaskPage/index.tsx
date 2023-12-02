import React from 'react';
import { Button, Form, Input, Card, Typography, Select, DatePicker } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../../utils/API';

const { Option } = Select;
interface AddTaskInterface {
  title: string;
  status: string;
  priority: string;
  duedate: string;
}

const initialValues = {
  title: '',
  status: '',
  priority: '',
  duedate: ''
}

const validationSchema = yup.object({
  title: yup
    .string()
    .required("Please insert title here"),
  status: yup
    .string()
    .required("Please insert status here"),
  priority: yup
    .string()
    .required("Please insert priority here"),
  duedate: yup
    .string()
    .required('Please insert due date here')
});

const AddTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const validate = localStorage.getItem('token');
  if (!validate) {
    navigate('/')
  }

  const handleSubmit = (values: AddTaskInterface) => {
    const body = {
      title: values.title,
      status: values.status,
      priority: values.priority,
      duedate: values.duedate
    }

    axios.post(API + '/api/tasks', body, { headers: { Authorization: `Bearer ${validate}` } })
      .then((response) => {
        console.log("Success add task :", response.data);
        Swal.fire({
          title: `Add Task Success!`,
          icon: 'success',
          width: 600,
          padding: '3em',
          color: '#716add',
        })
        navigate('/dashboard')
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: `Sorry you don't have permission!`,
          icon: 'error',
          width: 600,
          padding: '3em',
          color: '#716add',
        })
      });
  }

  const formMik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: validationSchema
  })

  return (
    <Card title="Add Task" style={{ padding: '20px' }}>
      <Form style={{ width: '320px', marginTop: '15px' }}
        onFinish={formMik.handleSubmit}
        name="normal_addTask"
        className="addTask-form"
        initialValues={{ remember: true }}
      >
        <div id='title-div'>
          <Input
            placeholder="Input Title"
            allowClear
            value={formMik.values.title}
            onChange={formMik.handleChange('title')}
            status={formMik.errors.title && 'error'} />
        </div>
        <Form.Item style={{ marginBottom: '5px' }}>
          {formMik.errors.title && (
            <Typography >{formMik.errors.title}</Typography>
          )}
        </Form.Item>

        <div id='status-div' style={{ width: 300 }}>
          <Select style={{ width: 320 }}
            placeholder="Select Status"
            value={formMik.values.status}
            onChange={(value) => formMik.setFieldValue('status', value)}
            status={formMik.errors.status && 'error'}
          >
            <Option value="not started">Not Started</Option>
            <Option value="in progress">In Progress</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </div>
        <Form.Item style={{ marginBottom: '5px' }}>
          {formMik.errors.status && (
            <Typography>{formMik.errors.status}</Typography>
          )}
        </Form.Item>

        <div id='priority-div'>
          <Select style={{ width: 320 }}
            placeholder="Select Priority"
            value={formMik.values.priority}
            onChange={(value) => formMik.setFieldValue('priority', value)}
            status={formMik.errors.priority && 'error'}
          >
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
          </Select>
        </div>
        <Form.Item style={{ marginBottom: '5px' }}>
          {formMik.errors.priority && (
            <Typography>{formMik.errors.priority}</Typography>
          )}
        </Form.Item>

        <div id='duedate-div'>
          <DatePicker
            placeholder="Select Due Date"
            // value={formMik.values.duedate ? moment(formMik.values.duedate) : null}
            onChange={(dateString) => {
              formMik.setFieldValue('duedate', dateString);
            }}
            format="YYYY-MM-DD"
          />
        </div>
        <Form.Item style={{ marginBottom: '5px' }}>
          {formMik.errors.duedate && (
            <Typography >{formMik.errors.duedate}</Typography>
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" style={{ marginBottom: '15px', marginRight: '20px' }}>Add Task</Button>
          <Button type="primary" className="login-link" onClick={() => { navigate('/dashboard') }}>Back</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddTaskPage;