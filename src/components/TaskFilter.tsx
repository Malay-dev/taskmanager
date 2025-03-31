import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Search, ChevronDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSearchQuery,
  setStatusFilter,
  setCategoryFilter,
  setPriorityFilter,
} from "../redux/slices/filtersSlice";
import type { RootState } from "../redux/store"; // Assuming you have a RootState type
import type { Category } from "../lib/types";

interface TaskFilterProps {
  categories: Category[];
}

export default function TaskFilter({ categories }: TaskFilterProps) {
  const dispatch = useDispatch();
  const { searchQuery, statusFilter, categoryFilter, priorityFilter } =
    useSelector((state: RootState) => state.filters);

  return (
    <div className="mb-6 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4" />
        <Input
          type="search"
          placeholder="Search tasks..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-between w-full px-4 py-1 text-sm font-medium border rounded-md focus:outline-none">
                {statusFilter === "all"
                  ? "Filter by status"
                  : statusFilter.charAt(0).toUpperCase() +
                    statusFilter.slice(1)}
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup
                value={statusFilter}
                onValueChange={(value) => dispatch(setStatusFilter(value))}>
                <DropdownMenuRadioItem value="all">
                  All Statuses
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="completed">
                  Completed
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pending">
                  Pending
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Category Filter */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-between w-full px-4 py-1 text-sm font-medium border rounded-md focus:outline-none">
                {categoryFilter === "all"
                  ? "Filter by category"
                  : categories.find((cat) => cat.id === categoryFilter)?.name ||
                    "Filter by category"}
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup
                value={categoryFilter}
                onValueChange={(value) => dispatch(setCategoryFilter(value))}>
                <DropdownMenuRadioItem value="all">
                  All Categories
                </DropdownMenuRadioItem>
                {categories.map((category) => (
                  <DropdownMenuRadioItem key={category.id} value={category.id}>
                    {category.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Priority Filter */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-between w-full px-4 py-1 text-sm font-medium border rounded-md focus:outline-none">
                {priorityFilter === "all"
                  ? "Filter by priority"
                  : priorityFilter.charAt(0).toUpperCase() +
                    priorityFilter.slice(1)}
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup
                value={priorityFilter}
                onValueChange={(value) => dispatch(setPriorityFilter(value))}>
                <DropdownMenuRadioItem value="all">
                  All Priorities
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="medium">
                  Medium
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="low">Low</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
