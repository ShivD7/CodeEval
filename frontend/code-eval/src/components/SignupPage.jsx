import React from 'react'
import './SignupPage.css'
import { Form, Input } from 'antd';
import {Link} from 'react-router-dom'
const SignupPage = () => {
  return (
    <div className = "main-container">
        <div className = "input-box">
            <h1 className = "main-title">Sign-Up</h1>
            <Form layout="vertical">
            <Form.Item
                label={<span style={{ color: '#00ffaa'}}>E-mail Address</span>}
                name="e-mail"
                rules={[
                { required: true, message: 'Please input your e-mail!' },
                ]}
                help={<span style={{ color: '#00ffaa'}}>Please enter a valid e-mail!</span>}
                style={{ marginBottom: 60, marginTop: 50, width: 200 }}
            >
                <Input placeholder="example123@gmail.com" />
            </Form.Item>
            <Form.Item
                label={<span style={{ color: '#00ffaa'}}>Password</span>}
                name="password"
                rules={[
                { required: true, message: 'Please input your password!' },
                { min: 8, max: 20, message: 'Must be 8–20 characters long.' }
                ]}
                help={<span style={{ color: '#00ffaa'}}>Must be 8–20 characters long.</span>}
                style={{ marginBottom: 50, width: 200 }}
            >
                <Input.Password placeholder="" />
            </Form.Item>
            </Form>
            <button className = "log-in-button">Sign-Up</button>
            <h5 className = "sign-up">Already have an account? Log in <Link to="/login">here</Link></h5>
        </div>
    </div>
  )
}

export default SignupPage