import { ListTodo } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { supabase } from "../lib/supabase";
import { setLoading, setError } from "../redux/slices/authSlice";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Icons } from "../components/Icons";

export default function RegisterPage() {
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
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Enter your details to create an account.
            </p>
            <RegisterForm />
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

function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    dispatch(setLoading(true));

    try {
      // Register the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
        });

        if (profileError) {
          throw profileError;
        }
      }

      navigate("/login?registered=true");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Failed to register");
        dispatch(setError(error.message || "Failed to register"));
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
    <form onSubmit={handleRegister}>
      <div className="space-y-4">
        {error && (
          <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input
            id="first-name"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input
            id="last-name"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
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
          <Label htmlFor="password">Password</Label>
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
          Register
        </Button>
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </div>
      </div>
    </form>
  );
}
