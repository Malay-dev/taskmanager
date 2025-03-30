// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './reducers/tasks';


const store = configureStore({
  reducer: {
    tasks: tasksReducer
  },
});


export default store;