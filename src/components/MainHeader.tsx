import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, PlusIcon, ColumnsIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import TaskForm from "./TaskForm";
import TaskFilter from "./TaskFilter";
import { useDispatch } from "react-redux";
import { createCategory } from "../redux/slices/categoriesSlice";
import type { AppDispatch } from "../redux/store";
import type { Category } from "../lib/types";
import type { Table } from "@tanstack/react-table";
import { Task } from "../lib/types";

interface MainHeaderProps {
  table: Table<Task>;
  categories: Category[];
  onTaskCreated: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({
  table,
  categories,
  onTaskCreated,
}) => {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return;

    setIsLoading(true);
    try {
      await dispatch(createCategory(categoryName.trim())).unwrap();

      setCategoryName("");
      setIsCategoryDialogOpen(false);
      toast.success("Category created successfully");
    } catch (error: unknown) {
      toast.error("Error creating category: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <TaskFilter categories={categories} />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ColumnsIcon />
              <span className="hidden lg:inline">Customize Columns</span>
              <span className="lg:hidden">Columns</span>
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Add Task Button with Dialog */}
        <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusIcon />
              <span className="hidden lg:inline">Add Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="border-b pb-4">
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              categories={categories}
              onTaskCreated={() => {
                setIsTaskDialogOpen(false);
                onTaskCreated();
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Add Category Button with Dialog */}
        <Dialog
          open={isCategoryDialogOpen}
          onOpenChange={setIsCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">New Category</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>
                Add a new category to organize your tasks.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g., Work, Personal, Shopping"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleCreateCategory}
                disabled={isLoading || !categoryName.trim()}>
                {isLoading ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MainHeader;
