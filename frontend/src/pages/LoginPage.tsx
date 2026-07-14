import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome back</h1>
      <p className="text-text-muted mb-8">Log in to keep writing.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
        <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />

        <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
          Log in
        </Button>
      </form>

      <p className="mt-6 text-sm text-text-muted text-center">
        Don't have an account?{" "}
        <Link to="/register" className="text-secondary hover:text-secondary-hover font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
