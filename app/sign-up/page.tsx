"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
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
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import Callout from "@/components/Callout";
import { GoogleIcon } from "@/public/assets/GoogleIcon";
import { supabase } from "@/utils/supabase";

const formSchema = z.object({
  email: z
    .string()
    .nonempty("Email is a required field")
    .email("This is not a valid email"),
  password: z
    .string()
    .nonempty("Password is a required field")
    .min(6, "Password must be at least 6 characters long")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/\d/, "Password should contain at least one digit"),
});

export default function SignUp() {
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [success, setSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await fetch("/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(values),
    });

    const responseBody = await response.json();

    if (response.status === 200) {
      setError(false);
      setSuccess(true);
      setSuccessText(responseBody);
    }

    if (response.status !== 200) {
      setSuccess(false);
      setError(true);
      setErrorText(responseBody);
    }
  };

  const signUpAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/oauth`,
      },
    });

    if (error) {
      setError(true);
      setErrorText("Could not authenticate user");
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <h1 className="text-primary text-2xl">Get started</h1>
      <h2 className="text-primary text-lg pb-4">Create a new account</h2>

      <Button onClick={signUpAuth} variant="outline">
        <GoogleIcon />
        <span className="pl-2">Continue with Google</span>
      </Button>

      <div className="flex">
        <div className="grow">
          <Separator className="my-4" />
        </div>
        <span className="px-1 text-sm m-1">or</span>
        <div className="grow">
          <Separator className="my-4" />
        </div>
      </div>

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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-y-2 pt-2">
            <Button type="submit">Create account</Button>
            <span className="text-center">
              Already have an account?
              <Button variant="link" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </span>
          </div>
        </form>
      </Form>
    </div>
  );
}
