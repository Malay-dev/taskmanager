"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchTasks, applyFilters } from "../redux/slices/tasksSlice";
import { fetchCategories } from "../redux/slices/categoriesSlice";
import { setTotalPages } from "../redux/slices/paginationSlice";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import { DataTable } from "@/components/TaskTable_1";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const { tasks, filteredTasks } = useSelector(
    (state: RootState) => state.tasks
  );
  const { categories } = useSelector((state: RootState) => state.categories);
  const { currentPage } = useSelector((state: RootState) => state.pagination);
  const { searchQuery, statusFilter, categoryFilter, priorityFilter } =
    useSelector((state: RootState) => state.filters);

  const tasksPerPage = 10;

  // Fetch categories when the component mounts
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch tasks when the component mounts or when the current page changes
  useEffect(() => {
    dispatch(fetchTasks())
      .unwrap()
      .then(({ count }) => {
        dispatch(setTotalPages(Math.ceil(count / tasksPerPage)));
      })
      .catch((error) => {
        toast.error("Error fetching tasks", {
          description: error,
        });
      });
  }, [dispatch, currentPage]);

  // Apply filters whenever tasks or filters change
  useEffect(() => {
    dispatch(
      applyFilters({
        searchQuery,
        statusFilter,
        categoryFilter,
        priorityFilter,
      })
    );
  }, [
    dispatch,
    tasks,
    searchQuery,
    statusFilter,
    categoryFilter,
    priorityFilter,
  ]);

  // Map category_id to category name
  const tasksWithCategories = useMemo(() => {
    if (!categories.length) return filteredTasks;
    console.log("Filtered Tasks:", filteredTasks);
    console.log("Categories:", categories);
    return filteredTasks.map((task) => {
      const category = categories.find((cat) => cat.id === task.category_id);
      return {
        ...task,
        due_date: task.due_date !== undefined ? task.due_date : null,
        category: category
          ? { ...category }
          : { id: "", user_id: "", created_at: "", name: "Uncategorized" },
      };
    });
  }, [filteredTasks, categories]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataTable data={tasksWithCategories} />
          </div>
        </div>
      </div>
    </div>
  );
}
