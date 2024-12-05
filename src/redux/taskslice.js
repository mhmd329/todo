// src/taskSlice.js
import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    addTask: (state, action) => {
        const newTask = {
          id: Date.now(), // استخدام الوقت الحالي كـ id للمهمة
          text: action.payload.text,
          createdAt: new Date().toLocaleString(), // إضافة الوقت الذي تم فيه إضافة المهمة
        };
        state.push(newTask);
      },
    updateTask: (state, action) => {
      const { id, newText } = action.payload;
      const task = state.find((task) => task.id === id);
      if (task) {
        task.text = newText;
      }
    },
    deleteTask: (state, action) => {
      return state.filter((task) => task.id !== action.payload);
    },
    clearTasks: (state, action) => {
        // Filter out the task with the given ID
        return state.filter(task => task.id !== action.payload);
      }
  }
});

export const { addTask, updateTask, deleteTask, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
