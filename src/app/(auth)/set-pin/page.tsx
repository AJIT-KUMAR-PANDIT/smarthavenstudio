import { SetPinForm } from "@/components/auth/set-pin-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set PIN - SmartHaven',
  description: 'Set your app lock PIN for SmartHaven.',
};

export default function SetPinPage() {
  return (
    <>
      <h1 className="mb-2 text-center text-2xl font-semibold text-foreground">
        Secure Your App
      </h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Create a 4-digit PIN to protect your SmartHaven app.
      </p>
      <SetPinForm />
    </>
  );
}
