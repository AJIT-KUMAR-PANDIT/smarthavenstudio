import { SignupForm } from "@/components/auth/signup-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - SmartHaven',
  description: 'Create your SmartHaven account.',
};

export default function SignupPage() {
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-semibold text-foreground">
        Create Account
      </h1>
      <SignupForm />
    </>
  );
}
