import { useEffect } from 'react';
import { Form, Input, Modal, Button, Select } from 'antd';
import { User } from '../types/userTypes';

interface UserFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: { id: string; email: string; name: string; password: string; role: string }) => void;
    initialValues?: User;
    loading: boolean;
}

export const UserForm = ({ visible, onCancel, onSubmit, initialValues, loading }: UserFormProps) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue(initialValues);
            } else {
                form.resetFields();
            }
        }
    }, [visible, initialValues, form]);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            onSubmit(values);
        });
    };

    return (
        <Modal
            title={initialValues ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
                    {initialValues ? 'Cập nhật' : 'Thêm'}
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                >
                    <Input placeholder="Nhập tên người dùng" />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                >
                    <Input placeholder="Nhập email"  disabled={!!initialValues}/>
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
                <Form.Item
                    name="role"
                    label="Vai trò"
                    rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                >
                    <Select placeholder="Chọn vai trò">
                        <Select.Option value="admin">Admin</Select.Option>
                        <Select.Option value="user">User</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};
