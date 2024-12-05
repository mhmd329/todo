// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../src/redux/taskslice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});
export default store;