"use client"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../app/store"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { getUsers } from "../features/user/userSlice"
import { Card, Row, Col, Statistic } from "antd"
import { UserOutlined } from "@ant-design/icons"
import { useAuth } from "../hooks/useAuth"

export const Dashboard = () => {
  const dispatch = useAppDispatch()
  const { users } = useSelector((state: RootState) => state.user)
  const { user } = useAuth()

  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch])

  return (
    <div className="pt-5 px-5">
      <h1>Dashboard</h1>
      <p>Xin chào, {user?.name || "Người dùng"}!</p>

      <Row gutter={16} className="mt-4">
        <Col span={8}>
          <Card>
            <Statistic title="Tổng số người dùng" value={users.length} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Người dùng mới trong tháng"
              value={
                users.filter((user) => {
                  const createdDate = new Date(user.created_at)
                  const now = new Date()
                  return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
                }).length
              }
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Vai trò của bạn" value={user?.role === "admin" ? "Quản trị viên" : "Người dùng"} />
          </Card>
        </Col>
      </Row>

      <div className="mt-5">
        <h2>Thông tin tài khoản</h2>
        <Card>
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
      </div>
    </div>
  )
}
