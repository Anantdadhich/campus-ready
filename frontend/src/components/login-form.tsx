"use client";

import { useRouter } from "next/navigation";
import z from "zod";
import { useToast } from "./ui/toastui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/Button";
import { useAuth } from "./authcontext";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";


export const LoginForm = () => {
  const router = useRouter();
  const {login}=useAuth()
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await axios.post(`${API_URL}/api/auth/login`, values);

      if (response.status === 200) {
        login(response.data.jwttoken)
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          variant: "default",
        });
        localStorage.setItem("token", response.data.jwttoken);
        router.push("/dashboard");
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link href="/auth/register" className="underline">
          Register
        </Link>
      </div>
    </div>
  );
};
