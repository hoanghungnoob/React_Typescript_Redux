// userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types/userTypes';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../api/userApi';

type UserState = {
  users: User[];
  currentUser: User | null;
  token: string | null; // Thêm token vào state
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  users: [],
  currentUser: null,
  token: null, // Khởi tạo token là null
  loading: false,
  error: null,
};

// Các thunk hiện có
export const getUsers = createAsyncThunk('users/fetchAll', async () => {
  return await fetchUsers();
});

export const addUser = createAsyncThunk('users/add', async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
  return await createUser(user);
});

export const editUser = createAsyncThunk('users/edit', async ({ id, user }: { id: number; user: Omit<User, 'id' | 'created_at' | 'updated_at'> }) => {
  return await updateUser(id, user);
});

export const removeUser = createAsyncThunk('users/remove', async (id: number) => {
  await deleteUser(id);
  return id;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    // Check auth
    builder
      // Get users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // Add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add user';
      })
      // Edit user
      .addCase(editUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user';
      })
      // Remove user
      .addCase(removeUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete user';
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;