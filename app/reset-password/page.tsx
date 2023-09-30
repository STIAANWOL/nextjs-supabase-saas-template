"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
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
import Callout from "@/components/Callout";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    password: z
      .string()
      .nonempty("Password is a required field")
      .min(6, "Password must be at least 6 characters long")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/\d/, "Password should contain at least one digit"),
    confirmPassword: z
      .string()
      .nonempty("Password is a required field")
      .min(6, "Password must be at least 6 characters long")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/\d/, "Password should contain at least one digit"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password is not matching",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [authError, setAuthError] = useState(false);
  const [authErrorText, setAuthErrorText] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location?.hash?.substring(1));

    if (!!hashParams?.size) {
      const error = hashParams.get("error");
      const error_description = hashParams.get("error_description");

      if (error) {
        setAuthError(true);
        setAuthErrorText(error_description || "");
      }
    } else {
      router.push("/sign-in");
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setUserEmail(session?.user?.email || "");
      }
    });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { data, error } = await supabase.auth.updateUser({
      password: values?.password,
    });

    if (error) {
      setError(true);
      setErrorText(error?.message || "Could not change your password!");
      return;
    }

    if (data) {
      setError(false);
      setPasswordChanged(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      {!passwordChanged && !authError && (
        <>
          <h1 className="text-primary text-2xl">Change password for</h1>
          <h2 className="text-primary text-lg pb-4">{userEmail}</h2>
          <h2 className="text-primary text-md">Your password should</h2>

          <ul className="list-disc list-inside pb-4">
            <li>Contain at least 6 characters</li>
            <li>Contain at least 1 alphabetical letter</li>
            <li>Contain at least 1 numerical digit</li>
          </ul>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Callout isError header="Error" description={errorText} />
              )}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-y-2 pt-2">
                <Button type="submit">Change password</Button>
              </div>
            </form>
          </Form>
        </>
      )}

      {passwordChanged && !error && (
        <>
          <h1 className="text-primary text-2xl">Congrats!</h1>
          <h2 className="text-primary text-md">
            Your password was changed successfully!
          </h2>
          <div className="flex flex-col gap-y-2 pt-2">
            <Button asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </>
      )}

      {authError && (
        <>
          <h1 className="text-primary text-2xl">
            Uh oh! Seems like something is not right. We can fix that!
          </h1>
          <h2 className="text-primary text-md">{authErrorText}</h2>
          <div className="flex flex-col gap-y-2 pt-2">
            <Button asChild>
              <Link href="/forgot-password">Reset password</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
