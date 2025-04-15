import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {Product} from '../../types/productTypes';
import {fetchProducts, createProduct, updateProduct, deleteProduct} from '../../api/productApi';

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};
const initialState: ProductState = {
    products: [],
    loading: false,   
    error: null,    
};

export const getProducts = createAsyncThunk('products/fetchAll', async () => {
  return await fetchProducts();
}
);
export const addProduct = createAsyncThunk(
  'products/add',
  async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    return await createProduct(product);
  }
);
export const editProduct = createAsyncThunk(
  'products/edit',
  async ({id, product}: {id: number; product: Omit<Product, 'id' | 'created_at' | 'updated_at'>}) => {
    return await updateProduct(id, product);
  }
);  
export const removeProduct = createAsyncThunk(
  'products/remove',
  async (id: number) => {
    await deleteProduct(id);
    return id;
  }
);

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch products';
            })
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to add product';
            })
            .addCase(editProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex((product) => product.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(editProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to edit product';
            })
            .addCase(removeProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex((product) => product.id === action.payload);
                if (index !== -1) {
                    state.products.splice(index, 1);
                }
            })
            .addCase(removeProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to remove product';
            });
    }
});

export default productSlice.reducer;