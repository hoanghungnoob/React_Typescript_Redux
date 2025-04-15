// userTypes.ts
export type User = {
  id: number;
  email: string;
  name: string | null;
  password: string | null; // Nếu bạn muốn sử dụng password (lưu ý: không nên hiển thị password trên frontend)
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
};