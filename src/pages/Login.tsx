import { ListTodo } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { supabase } from "../lib/supabase";
import { setLoading, setError, setUser } from "../redux/slices/authSlice";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Icons } from "../components/Icons";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ListTodo className="size-6" />
            </div>
            Task Manager
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <h1 className="text-2xl font-bold text-center mb-4">
              Login to your account
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Enter your email and password to access your account.
            </p>
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="src/assets/auth-hero.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    dispatch(setLoading(true));

    try {
      // Log in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      console.log("Login data:", data);
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", data.user.id)
          .single();
        if (profileError) {
          throw profileError;
        }

        const userWithProfile = {
          ...data.user,
          first_name: profile.first_name,
          last_name: profile.last_name,
        };

        dispatch(setUser(userWithProfile));
        console.log("User logged in with profile:", userWithProfile);
      }

      navigate("/");
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message || "Failed to login");
        dispatch(setError(error.message || "Failed to login"));
      } else {
        setErrorMessage("An unknown error occurred");
        dispatch(setError("An unknown error occurred"));
      }
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="space-y-4">
        {error && (
          <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/reset-password"
              className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex flex-col space-y-4 mt-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </div>
    </form>
  );
}
