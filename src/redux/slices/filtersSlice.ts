import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  searchQuery: string;
  statusFilter: string;
  categoryFilter: string;
  priorityFilter: string;
}

const initialState: FiltersState = {
  searchQuery: '',
  statusFilter: 'all',
  categoryFilter: 'all',
  priorityFilter: 'all',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload;
    },
    setPriorityFilter: (state, action: PayloadAction<string>) => {
      state.priorityFilter = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.statusFilter = 'all';
      state.categoryFilter = 'all';
      state.priorityFilter = 'all';
    },
  },
});

export const {
  setSearchQuery,
  setStatusFilter,
  setCategoryFilter,
  setPriorityFilter,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
