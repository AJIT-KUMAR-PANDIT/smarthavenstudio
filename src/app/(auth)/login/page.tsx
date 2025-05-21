import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - SmartHaven',
  description: 'Login to your SmartHaven account.',
};

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-semibold text-foreground">
        Welcome Back
      </h1>
      <LoginForm />
    </>
  );
}
