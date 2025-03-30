import { supabase } from "./supabase";
import type { Task, Category } from "./types";

const useLocalStorage = import.meta.env.VITE_USE_LOCAL_STORAGE === "true";

const localStorageKey = {
  tasks: "tasks",
  categories: "categories",
};

function getLocalStorageData<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setLocalStorageData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const database = {
  async fetchTasks(userId: string) {
    if (useLocalStorage) {
      const tasks = getLocalStorageData<Task>(localStorageKey.tasks);
      return tasks;
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data as Task[];
  },

  async createTask(task: Partial<Task>) {
    if (useLocalStorage) {
      const tasks = getLocalStorageData<Task>(localStorageKey.tasks);
      const newTask = { ...task, id: crypto.randomUUID() } as Task;
      tasks.push(newTask);
      setLocalStorageData(localStorageKey.tasks, tasks);
      return newTask;
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async updateTask(id: string, updates: Partial<Task>) {
    if (useLocalStorage) {
      const tasks = getLocalStorageData<Task>(localStorageKey.tasks);
      const index = tasks.findIndex((task) => task.id === id);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updates };
        setLocalStorageData(localStorageKey.tasks, tasks);
        return tasks[index];
      }
      throw new Error("Task not found");
    }

    const { error } = await supabase.from("tasks").update(updates).eq("id", id);
    if (error) throw error;
  },

  async deleteTask(id: string) {
    if (useLocalStorage) {
      const tasks = getLocalStorageData<Task>(localStorageKey.tasks);
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setLocalStorageData(localStorageKey.tasks, updatedTasks);
      return id;
    }

    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
  },

  async fetchCategories() {
    if (useLocalStorage) {
      return getLocalStorageData<Category>(localStorageKey.categories);
    }

    const { data, error } = await supabase.from("categories").select("*");
    if (error) throw error;
    return data as Category[];
  },

  async createCategory(category: Partial<Category>) {
    if (useLocalStorage) {
      const categories = getLocalStorageData<Category>(
        localStorageKey.categories
      );
      const newCategory = { ...category, id: crypto.randomUUID() } as Category;
      categories.push(newCategory);
      setLocalStorageData(localStorageKey.categories, categories);
      return newCategory;
    }

    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  },
};
