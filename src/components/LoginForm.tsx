"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {};

export const emailValidator = z.object({
  email: z.string().email(),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof emailValidator>>({
    resolver: zodResolver(emailValidator),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof emailValidator>) {
    signIn("email", { email: values.email });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription className="text-center ">
                You can only log in using email. One on one chat!
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" variant="outline" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
