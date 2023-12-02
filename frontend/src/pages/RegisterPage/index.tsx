import React from 'react';
import { Button, Form, Input, Card, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as yup from 'yup'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { API } from '../../utils/API';

interface AddUserInterface {
  username: string;
  password: string;
}

const initialValues = {
  username: '',
  password: ''
}

const validationSchema = yup.object({
  username: yup
    .string()
    .required("Please insert your username here"),
  password: yup
    .string()
    .required('Please Enter your password')
});

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: AddUserInterface) => {
    const body = {
      username: values.username,
      password: values.password,
    }

    fetch(API + '/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Error while register');
      }
      return response.json();
    }).then((data) => {
      console.log("Success register :", data);
      Swal.fire({
        title: `Register Success !`,
        icon: 'success',
        width: 600,
        padding: '3em',
        color: '#716add',
      })
    }).catch((error) => {
      console.log(error);
      Swal.fire({
        title: `Sorry, username is not available !`,
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
    <Card title="Register Account" style={{ padding: '20px' }}>
      <Form style={{ width: '320px', marginTop: '15px' }}
        onFinish={formMik.handleSubmit}
        name="normal_register"
        className="register-form"
        initialValues={{ remember: true }}
      >
        <div id='username-div'>
          <Input prefix={<UserOutlined
            className="site-form-item-icon" />}
            placeholder="Username"
            allowClear
            value={formMik.values.username}
            onChange={formMik.handleChange('username')}
            status={formMik.errors.username && 'error'}
          />
        </div>
        <Form.Item style={{ marginBottom: '5px' }}>
          {formMik.errors.username && (
            <Typography >{formMik.errors.username}</Typography>
          )}
        </Form.Item>

        <div id='password-div'>
          <Input prefix={<LockOutlined
            className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            value={formMik.values.password}
            onChange={formMik.handleChange('password')}
            status={formMik.errors.password && 'error'}
          />
        </div>
        <Form.Item style={{ marginBottom: '5px' }}>
          {formMik.errors.password && (
            <Typography >{formMik.errors.password}</Typography>
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" style={{ marginBottom: '15px', marginRight: '20px' }}>Register</Button>
          <Button type="primary" className="login-link" onClick={() => { navigate('/') }}>Sign In</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RegisterPage;