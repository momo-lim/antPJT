/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLogin: false,
    loginTime: '',
    userInfo: {},
    alertLength: 0,
  },
  reducers: {
    login(state, action) {
      state.isLogin = true;
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.isLogin = false;
      state.userInfo = {};
      state.alertLength = 0;
      state.loginTime = '';
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    setAlertLength: (state, action) => {
      state.alertLength = action.payload;
    },
    setLoginTime: (state) => {
      const temp = new Date().getTime();
      state.loginTime = temp;
    },
  },
});

export const { login, logout, setAlertLength, setLoginTime } =
  userSlice.actions;
export default userSlice.reducer;
