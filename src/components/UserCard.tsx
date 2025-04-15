// UserCard.tsx
import { User } from '../types/userTypes';

interface UserCardProps {
  user: User;
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h3>{user.name || 'Không có tên'}</h3>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
      <p>Created At: {new Date(user.created_at).toLocaleString()}</p>
      <p>Updated At: {new Date(user.updated_at).toLocaleString()}</p>
    </div>
  );
};