"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
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
import Callout from "@/components/Callout";
import { supabase } from "@/utils/supabase";

const formSchema = z.object({
  email: z
    .string()
    .nonempty("Email is a required field")
    .email("This is not a valid email"),
});

export default function ForgotPassword() {
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [success, setSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await supabase.auth.resetPasswordForEmail(values?.email, {
      redirectTo: `${location.origin}/reset-password`,
    });

    if (!error) {
      setError(false);
      setSuccess(true);
      setSuccessText("Your reset password link was sent!");
    }

    if (error) {
      setSuccess(false);
      setError(true);

      setErrorText(
        error?.message || "Something went wrong sending your email!"
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <h1 className="text-primary text-2xl">Reset your password</h1>
      <h2 className="text-primary text-md pb-4">
        Enter your email address for a password reset link
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {success && <Callout header="Success" description={successText} />}
          {error && <Callout isError header="Error" description={errorText} />}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-y-1 pt-2">
            <Button type="submit">Send password reset email</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
