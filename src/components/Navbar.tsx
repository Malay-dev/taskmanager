import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { toast } from "sonner";
import { ListTodo, User, LogOut } from "lucide-react";
import { RootState } from "../redux/store";

export default function Navbar() {
  const navigate = useNavigate();

  // Get the user from the auth reducer
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out: " + error.message);
      return;
    }
    toast.success("Signed out successfully");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="container flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <ListTodo className="h-5 w-5" />
          <span>Task Manager</span>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6"></nav>
        <div className="ml-auto flex justify-end items-center space-x-4">
          <span className="text-sm font-medium text-muted-foreground">
            {user ? `${user.first_name} ${user.last_name}` : "Guest"}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
