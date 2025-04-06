import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchTasks, applyFilters } from "../redux/slices/tasksSlice";
import { fetchCategories } from "../redux/slices/categoriesSlice";
import Navbar from "../components/Navbar";
import { TaskTable } from "@/components/TaskTable_1";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors for tasks, categories, and filters
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const filteredTasks = useSelector(
    (state: RootState) => state.tasks.filteredTasks
  );
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const { searchQuery, statusFilter, categoryFilter, priorityFilter } =
    useSelector((state: RootState) => state.filters);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (tasks.length > 0) {
      dispatch(
        applyFilters({
          searchQuery,
          statusFilter,
          categoryFilter,
          priorityFilter,
        })
      );
    }
  }, [
    dispatch,
    searchQuery,
    statusFilter,
    categoryFilter,
    priorityFilter,
    tasks.length,
  ]);
  console.log("Tasks:", tasks);
  console.log("Filtered Tasks:", filteredTasks);
  console.log("Categories:", categories);
  const tasksWithCategories = useMemo(() => {
    if (!categories.length) return filteredTasks;

    return filteredTasks.map((task) => {
      const category = categories.find((cat) => cat.id === task.category_id);
      return {
        ...task,
        due_date: task.due_date || "",
        category: category
          ? { ...category }
          : { id: "", user_id: "", created_at: "", name: "Uncategorized" },
      };
    });
  }, [filteredTasks, categories]);
  console.log("Tasks with Categories:", tasksWithCategories);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <TaskTable tasks={tasksWithCategories} dispatch={dispatch} />
          </div>
        </div>
      </div>
    </div>
  );
}
