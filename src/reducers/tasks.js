import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
      tasks: [],
      filter: 'all',
      categoryFilter: 'all',
      sortByPriority: 'none',
      searchQuery: ''
  },
  reducers: {
      add: (state, action) => {
          state.tasks.push({
              title: action.payload.title,
              completed: false,
              category: action.payload.category,
              priority: 'low',
              dueDate: null
          });
      },
      setFilter: (state, action) => {
          state.filter = action.payload;
      },
      setCategoryFilter: (state, action) => {
          state.categoryFilter = action.payload;
      },
      setSortByPriority: (state, action) => {
        state.sortByPriority = action.payload;
    },
      setSearchQuery: (state, action) => {
        state.searchQuery = action.payload;
      },
      reorderTasks: (state, action) => {
        const { startIndex, endIndex } = action.payload;
        const [removed] = state.tasks.splice(startIndex, 1);
        state.tasks.splice(endIndex, 0, removed);
      },
      reorderTasks: (state, action) => {
        const {startIndex, endIndex} = action.payload;
        const [removed] = state.tasks.splice(startIndex, 1);
        state.tasks.splice(endIndex, 0, removed);
      }
  },
});

export const { add, setFilter, setCategoryFilter, setSortByPriority, setSearchQuery } = tasksSlice.actions;
export const { reorderTasks } = tasksSlice.actions
export default tasksSlice.reducer;
