"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import Callout from "@/components/Callout";
import { putSetPassword } from "@/services/clientServices";

const formSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty("Password is a required field")
      .min(6, "Password must be at least 6 characters long")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/\d/, "Password should contain at least one digit"),
    confirmNewPassword: z
      .string()
      .nonempty("Password is a required field")
      .min(6, "Password must be at least 6 characters long")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/\d/, "Password should contain at least one digit"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password is not matching",
    path: ["confirmNewPassword"],
  });

export default function SetPasswordForm() {
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [success, setSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await putSetPassword(values.newPassword);

    if (response.status === 200) {
      setSuccess(true);
      setError(false);
      setSuccessText("Password added!");
      form.reset();
    }

    if (response.status !== 200) {
      const responseBody: string = await response.json();
      setError(true);
      setSuccess(false);
      setErrorText(responseBody);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center gap-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {success && <Callout header="Success" description={successText} />}
          {error && <Callout isError header="Error" description={errorText} />}

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
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
    </div>
  );
}
