"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck } from "lucide-react";

const pinSchema = z.string().length(4, { message: "PIN must be 4 digits." }).regex(/^\d+$/, { message: "PIN must only contain digits." });

const formSchema = z.object({
  pin: pinSchema,
  confirmPin: pinSchema,
}).refine(data => data.pin === data.confirmPin, {
  message: "PINs do not match.",
  path: ["confirmPin"],
});


export function SetPinForm() {
  const { setPin, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
      confirmPin: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in before setting a PIN.",
        variant: "destructive",
      });
      return;
    }
    setPin(values.pin);
    toast({
      title: "PIN Set Successfully",
      description: "Your app lock PIN has been configured.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New PIN (4 digits)</FormLabel>
              <FormControl>
                <Input type="password" inputMode="numeric" maxLength={4} placeholder="••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm PIN</FormLabel>
              <FormControl>
                <Input type="password" inputMode="numeric" maxLength={4} placeholder="••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          <ShieldCheck className="mr-2 h-4 w-4" /> Set PIN
        </Button>
      </form>
    </Form>
  );
}
