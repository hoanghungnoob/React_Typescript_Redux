import axios from "axios";
import { Product } from "../types/productTypes";

interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: Product[];
}
interface SingleProductResponse {
  success: boolean;
  status: number;
  message: string;
  data: Product;
}
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get<ApiResponse>(
    "https://timdpihc8e.execute-api.ap-southeast-1.amazonaws.com/products"
  );
  console.log(response.data);
  
  return response.data.data;
}
export const createProduct = async (
  product: Omit<Product, "id" | "created_at" | "updated_at">
): Promise<Product> => {
  const response = await axios.post<SingleProductResponse>(
    "https://timdpihc8e.execute-api.ap-southeast-1.amazonaws.com/products",
    product
  );
  return response.data.data;
}
export const updateProduct = async (
  id: number,
  product: Omit<Product, "id" | "created_at" | "updated_at">
): Promise<Product> => {
  const response = await axios.put<SingleProductResponse>(
    `https://timdpihc8e.execute-api.ap-southeast-1.amazonaws.com/products/${id}`,
    product
  );
  return response.data.data;
}
export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(
    `https://timdpihc8e.execute-api.ap-southeast-1.amazonaws.com/products/${id}`
  );
}
export const fetchProductById = async (id: number): Promise<Product> => {       
  const response = await axios.get<SingleProductResponse>(
    `https://timdpihc8e.execute-api.ap-southeast-1.amazonaws.com/products/${id}`
  );
  return response.data.data;
}       

export const fetchProductsByName = async (
  name: string
): Promise<Product[]> => {
  const response = await axios.get<ApiResponse>(
    `https://ye887syarg.execute-api.ap-southeast-1.amazonaws.com/products?name=${name}`
  );
  return response.data.data;
}