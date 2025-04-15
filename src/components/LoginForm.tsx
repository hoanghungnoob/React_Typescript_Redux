"use client"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { Form, Input, Button, Card, Alert, Typography } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { login, selectAuth } from "../features/auth/authSlice"
import type { AppDispatch } from "../app/store"

const { Title, Text } = Typography

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoading, error } = useSelector(selectAuth)

  // Get the intended destination from location state or default to dashboard
  // Define a type for the location state
  interface LocationState {
    from?: {
      pathname: string;
    };
  }
  
  const from = (location.state as LocationState)?.from?.pathname || "/dashboard";

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await dispatch(login(values)).unwrap()
      // Navigate to the page the user was trying to access
      navigate(from, { replace: true })
    } catch (err) {
      console.log("Login error:", err);
    }
  }

  return (
    <div
      className="login-page"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card style={{ width: 400, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={2}>Đăng nhập</Title>
          <Text type="secondary">Nhập thông tin đăng nhập của bạn</Text>
        </div>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} />}

        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item name="email" rules={[{ required: true, message: "Vui lòng nhập email đăng nhập!" }]}>
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block size="large">
              Đăng nhập
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <a href="#">Quên mật khẩu?</a>
          </div>
        </Form>
      </Card>

      <div className="footer" style={{ marginTop: "30px", color: "#666" }}>
        © {new Date().getFullYear()} Admin Panel
      </div>
    </div>
  )
}
