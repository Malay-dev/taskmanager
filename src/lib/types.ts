export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string;
  priority: string;
  category_id: string;
  user_id: string;
  position: number;
  created_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}
