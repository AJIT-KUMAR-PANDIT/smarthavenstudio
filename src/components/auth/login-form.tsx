"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { Fingerprint, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export function LoginForm() {
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you'd call your auth API here
    // For Logto, this would typically involve redirecting to Logto's hosted UI
    // or using Logto's SDK.
    // Here, we're mocking login.
    login(values.email);
    toast({
      title: "Login Successful",
      description: `Welcome back, ${values.email}!`,
    });
  }

  const handleLogtoLogin = () => {
    // This would redirect to Logto's authentication page
    // e.g., window.location.href = 'YOUR_LOGTO_SIGN_IN_URL';
    toast({
      title: "Redirecting to Logto...",
      description: "Please wait while we redirect you to Logto for authentication.",
    });
    // Simulate Logto login after a delay for demo purposes
    setTimeout(() => {
      login("user@logto.example.com");
      toast({
        title: "Login Successful (Logto)",
        description: "Welcome back from Logto!",
      });
    }, 1500);
  };
  
  const handleBiometricLogin = () => {
    toast({
      title: "Biometric Login",
      description: "Biometric authentication would be triggered here (feature mocked).",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
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
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          Login
        </Button>
        <Button variant="outline" type="button" className="w-full" onClick={handleLogtoLogin}>
          <KeyRound className="mr-2 h-4 w-4" /> Continue with Logto
        </Button>
         <Button variant="outline" type="button" className="w-full" onClick={handleBiometricLogin}>
          <Fingerprint className="mr-2 h-4 w-4" /> Login with Biometrics
        </Button>
        <div className="text-center text-sm">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <p className="mt-2">
            <Link href="#" className="text-xs text-muted-foreground hover:underline" onClick={() => alert("Forgot password functionality would be here.")}>
              Forgot password?
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
