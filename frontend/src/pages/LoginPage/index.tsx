import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Card, Typography } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { API } from '../../utils/API';

interface LoginInterface {
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
    .required("Username can't be blank"),
  password: yup
    .string()
    .required('Please Enter your password')
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const handleSubmit = async (values: LoginInterface) => {
    const body = {
      username: values.username,
      password: values.password,
    }
    await fetch(API + '/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error while login');
        }
        return response.json();
      }).then((data) => {
        localStorage.setItem('token', data.token); // input data token to local storage
        navigate('/dashboard');
        Swal.fire({
          title: `Login Success !`,
          icon: 'success',
          width: 600,
          padding: '3em',
          color: '#716add',
        })
      }).catch((error) => {
        console.log(error);
        Swal.fire({
          title: `Username or Password do not match, Please try again !`,
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
    <>
      <Card title="Login to Platform" style={{ padding: '20px', margin: 'auto' }}>
        <Form style={{ width: '310px' }}
          onFinish={formMik.handleSubmit}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
        >
          <div id='username-div' style={{ marginTop: '15px' }}>
            <Input prefix={<UserOutlined
              className="site-form-item-icon" />}
              placeholder="Enter Username"
              allowClear
              value={formMik.values.username}
              onChange={formMik.handleChange('username')}
              status={formMik.errors.username && 'error'}
            />
          </div>
          <Form.Item style={{ marginBottom: '5px' }}>
            {formMik.errors.username && (
              <Typography>{formMik.errors.username}</Typography>
            )}
          </Form.Item>

          <div id='passord-div'>
            <Input prefix={<LockOutlined
              className="site-form-item-icon" />}
              type="password"
              allowClear
              placeholder="Enter Password"
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
            <Button type="primary" htmlType="submit" className="login-form-button" style={{ margin: '15px' }}>Sign In</Button>
            <br />Don't have an account? <br />
            You can register <a type="primary" className="login-link" onClick={() => { navigate('/register') }}>here</a>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default LoginPage;