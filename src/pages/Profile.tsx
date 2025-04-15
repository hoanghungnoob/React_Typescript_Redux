"use client"

import { useState } from "react"
import { Card, Button, Form, Input, message } from "antd"
import { useAuth } from "../hooks/useAuth"

export const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [form] = Form.useForm()

  const handleEdit = () => {
    form.setFieldsValue({
      name: user?.name,
      email: user?.email,
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSubmit = (values: unknown) => {
    // Here you would dispatch an action to update the user profile
    console.log("Updated profile:", values)
    message.success("Cập nhật thông tin thành công")
    setIsEditing(false)
  }

  return (
    <div className="pt-5 px-5">
      <h1>Thông tin cá nhân</h1>

      {!isEditing ? (
        <Card
          title="Thông tin người dùng"
          extra={
            <Button type="primary" onClick={handleEdit}>
              Chỉnh sửa
            </Button>
          }
        >
          <p>
            <strong>Tên người dùng:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Vai trò:</strong> {user?.role === "admin" ? "Quản trị viên" : "Người dùng"}
          </p>
        </Card>
      ) : (
        <Card title="Chỉnh sửa thông tin">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              name: user?.name,
              email: user?.email,
            }}
          >
            <Form.Item
              name="name"
              label="Tên người dùng"
              rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                Lưu
              </Button>
              <Button onClick={handleCancel}>Hủy</Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      <Card title="Đổi mật khẩu" className="mt-4">
        <Form layout="vertical">
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"))
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary">Đổi mật khẩu</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
