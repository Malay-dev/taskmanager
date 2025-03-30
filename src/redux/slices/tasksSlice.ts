import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";
import { database } from "../../lib/database.ts";
import type { Task } from "../../lib/types";
import type { RootState } from "../store";

interface TasksState {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
  totalCount: number;
}

const initialState: TasksState = {
  tasks: [],
  filteredTasks: [],
  loading: false,
  error: null,
  totalCount: 0,
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?.id;

      if (!userId) throw new Error("User not authenticated");

      const tasks = await database.fetchTasks(userId);
      return { tasks, count: tasks.length };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (task: Partial<Task>, { rejectWithValue }) => {
    try {
      const newTask = await database.createTask(task);
      return newTask;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (
    { id, ...updates }: Partial<Task> & { id: string },
    { rejectWithValue }
  ) => {
    try {
      await database.updateTask(id, updates);
      return { id, ...updates };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string, { rejectWithValue }) => {
    try {
      await database.deleteTask(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const reorderTasks = createAsyncThunk(
  "tasks/reorderTasks",
  async (reorderedTasks: Task[], { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?.id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Update each task with its new position
      const updates = reorderedTasks.map((task, index) => ({
        id: task.id,
        position: index,
      }));

      for (const update of updates) {
        await supabase
          .from("tasks")
          .update({ position: update.position })
          .eq("id", update.id)
          .eq("user_id", userId);
      }

      return reorderedTasks;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    applyFilters: (
      state,
      action: PayloadAction<{
        searchQuery: string;
        statusFilter: string;
        categoryFilter: string;
        priorityFilter: string;
      }>
    ) => {
      const { searchQuery, statusFilter, categoryFilter, priorityFilter } =
        action.payload;
      let filtered = [...state.tasks];

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter((task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        const isCompleted = statusFilter === "completed";
        filtered = filtered.filter((task) => task.completed === isCompleted);
      }

      // Apply category filter
      if (categoryFilter !== "all") {
        filtered = filtered.filter(
          (task) => task.category_id === categoryFilter
        );
      }

      // Apply priority filter
      if (priorityFilter !== "all") {
        filtered = filtered.filter((task) => task.priority === priorityFilter);
      }

      state.filteredTasks = filtered;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload.tasks;
        state.filteredTasks = action.payload.tasks;
        state.totalCount = action.payload.count;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(reorderTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.filteredTasks = action.payload;
      });
  },
});

export const { applyFilters } = tasksSlice.actions;
export default tasksSlice.reducer;
