"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../redux/slices/tasksSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import TaskDialog from "./TaskDialog";
import type { Task, Category } from "../lib/types";
import { formatDate } from "../lib/utils";
import { MoreHorizontal, Calendar, AlertTriangle } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import type { AppDispatch } from "../redux/store";

interface TaskTableProps {
  tasks: Task[];
  categories: Category[];
  isLoading: boolean;
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
  onTaskReordered: (tasks: Task[]) => void;
}

const SortableTableRow = ({
  task,
  categories,
  onTaskUpdated,
  onTaskDeleted,
}: {
  task: Task;
  categories: Category[];
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const style = {
    transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
    transition,
  };

  const handleToggleComplete = async () => {
    try {
      await dispatch(
        updateTask({
          id: task.id,
          completed: !task.completed,
        })
      ).unwrap();

      onTaskUpdated();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="default">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && !task.completed;

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`${task.completed ? "bg-muted/40" : ""} ${
        isOverdue ? "bg-destructive/10" : ""
      }`}
      {...attributes}>
      <TableCell className="w-10">
        <div {...listeners} className="cursor-move px-2">
          ⋮⋮
        </div>
      </TableCell>
      <TableCell className="w-10">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggleComplete}
          aria-label={
            task.completed ? "Mark as incomplete" : "Mark as complete"
          }
        />
      </TableCell>
      <TableCell
        className={task.completed ? "line-through text-muted-foreground" : ""}>
        {task.title}
      </TableCell>
      <TableCell>
        {task.category && (
          <Badge variant="secondary">{task.category.name}</Badge>
        )}
      </TableCell>
      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
      <TableCell>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className={isOverdue ? "text-destructive font-medium" : ""}>
            {task.due_date ? formatDate(task.due_date) : "No due date"}
          </span>
          {isOverdue && (
            <AlertTriangle className="h-4 w-4 ml-1 text-destructive" />
          )}
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggleComplete}>
              {task.completed ? "Mark as incomplete" : "Mark as complete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TaskDialog
          task={task}
          categories={categories}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onTaskUpdated={onTaskUpdated}
          onTaskDeleted={onTaskDeleted}
        />
      </TableCell>
    </TableRow>
  );
};

export default function TaskTable({
  tasks,
  categories,
  isLoading,
  onTaskUpdated,
  onTaskDeleted,
  onTaskReordered,
}: TaskTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);

      const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
      onTaskReordered(reorderedTasks);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 border rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-muted-foreground">
            Create a new task to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead className="w-10"></TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext
              items={tasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}>
              {tasks.map((task) => (
                <SortableTableRow
                  key={task.id}
                  task={task}
                  categories={categories}
                  onTaskUpdated={onTaskUpdated}
                  onTaskDeleted={onTaskDeleted}
                />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}
