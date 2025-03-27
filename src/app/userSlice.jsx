import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../api/userApi';

export const getMe = createAsyncThunk('user/getMe', async (params, thunkAPI) => {
  const currentUser = await userApi.getMe();
  return currentUser;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    current: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMe.fulfilled, (state, action) => {
      state.current = action.payload;
    });
  },
});

export default userSlice.reducer;
