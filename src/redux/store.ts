import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import tasksReducer from './slices/tasksSlice';
import categoriesReducer from './slices/categoriesSlice';
import filtersReducer from './slices/filtersSlice';
import paginationReducer from './slices/paginationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    categories: categoriesReducer,
    filters: filtersReducer,
    pagination: paginationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
