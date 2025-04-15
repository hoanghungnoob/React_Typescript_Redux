import { Button, Popconfirm, Space, Table, message } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import type { RootState } from "../app/store"
import { UserForm } from "../components/UserForm"
import { addUser, editUser, getUsers, removeUser } from "../features/user/userSlice"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { useAuth } from "../hooks/useAuth"
import type { User } from "../types/userTypes"

export const Home = () => {
  const dispatch = useAppDispatch()
  const { users, loading, error } = useSelector((state: RootState) => state.user)
  const { isAuthenticated, isAdmin } = useAuth()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    // Only fetch users if authenticated
    if (isAuthenticated) {
      dispatch(getUsers())
    }
  }, [dispatch, isAuthenticated])

  // Redirect non-admin users to a different page
  if (isAuthenticated && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  // Redirect non-authenticated users to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const showAddModal = () => {
    setEditingUser(undefined)
    setIsModalVisible(true)
  }

  const showEditModal = (user: User) => {
    setEditingUser(user)
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingUser(undefined)
  }

  const handleSubmit = async (values: { id: string,email: string ,name : string, password:string, role:string}) => {
    setFormLoading(true)
    try {
      if (editingUser) {
        await dispatch(
          editUser({ 
            id: editingUser.id, 
            user: { ...values, role: values.role as "user" | "admin" } 
          })
        ).unwrap()
        message.success("Cập nhật người dùng thành công")
      } else {
        await dispatch(addUser({ ...values, role: values.role as "user" | "admin" })).unwrap()
        message.success("Thêm người dùng thành công")
      }
      setIsModalVisible(false)
    } catch (err) {
      console.log(err);
      message.error("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await dispatch(removeUser(id)).unwrap()
      message.success("Xóa người dùng thành công")
    } catch (err) {
      console.log(err);      
      message.error("Xóa người dùng thất bại")
    }
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string | null) => email || "Không có tên",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (name: string | null) => name || "Không có tên",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string | null) => role || "Không có tên",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => (date ? new Date(date).toLocaleString() : "Invalid Date"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date: string) => (date ? new Date(date).toLocaleString() : "Invalid Date"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: User) => (
        <Space size="middle">
          <Button type="link" onClick={() => showEditModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="pt-5 px-5">
      <div className=" flex flex-row justify-between items-center">
        <h1>Admin Panel</h1>
        {error && <div style={{ color: "red", marginBottom: "10px" }}>Lỗi: {error}</div>}
        <Button type="primary" onClick={showAddModal} style={{ marginBottom: "20px" }}>
          Thêm người dùng
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        locale={{ emptyText: "Không có người dùng nào" }}
      />
      <UserForm
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        initialValues={editingUser}
        loading={formLoading}
      />
    </div>
  )
}
