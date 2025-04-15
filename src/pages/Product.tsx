import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { getProducts, addProduct, editProduct, removeProduct } from "../features/product/productSlice";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Table, Button, Modal, Form, Input, InputNumber } from "antd";
import { Product } from "../types/productTypes";

const ProductPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { products, loading } = useSelector((state: RootState) => state.product);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const { isAuthenticated, isAdmin } = useAuth();

    const [form] = Form.useForm();

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getProducts());
        }
    }, [dispatch, isAuthenticated]);

    if (isAuthenticated && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleAddProduct = () => {
        setEditingProduct(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        form.setFieldsValue(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = (id: number) => {
        dispatch(removeProduct(id));
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingProduct) {
                dispatch(editProduct({ ...editingProduct, ...values }));
            } else {
                const newProduct: Product = {
                    id: Date.now(), // Tạm dùng ID giả
                    ...values,
                };
                dispatch(addProduct(newProduct));
            }
            form.resetFields();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Validate Failed:", err);
        }
    };

    const handleModalCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price: number) => `$${price}`,
        },
        {
            title: "Stock",
            dataIndex: "stock",
            key: "stock",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: unknown, record: Product) => (
                <div className="flex gap-2">
                    <Button type="link" onClick={() => handleEditProduct(record)}>
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDeleteProduct(record.id)}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Product Management</h1>
                <Button type="primary" onClick={handleAddProduct}>
                    Add Product
                </Button>
            </div>
            <Table dataSource={products} columns={columns} rowKey="id" loading={loading} />
            <Modal
                title={editingProduct ? "Edit Product" : "Add Product"}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText={editingProduct ? "Update" : "Add"}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: "Please enter the product name" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true, message: "Please enter the product price" }]}
                    >
                        <InputNumber min={0} className="w-full" />
                    </Form.Item>
                    <Form.Item
                        name="stock"
                        label="Stock"
                        rules={[{ required: true, message: "Please enter the product stock" }]}
                    >
                        <InputNumber min={0} className="w-full" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductPage;
