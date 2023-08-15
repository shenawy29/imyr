"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailValidator } from "./LoginForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCallback } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

type Props = {};

export default function RemoveFriendUI({}: Props) {
  const { toast } = useToast();

  const emailInput = useForm<z.infer<typeof emailValidator>>({
    resolver: zodResolver(emailValidator),
    defaultValues: {
      email: "",
    },
  });
  const { setValue } = emailInput;

  const onSubmit = useCallback(
    (values: z.infer<typeof emailValidator>) => {
      try {
        axios
          .post("/api/friends/remove", { email: values.email })
          .then((e) => {
            toast({ title: e?.data });
          })
          .catch((e) =>
            toast({ title: e?.response?.data, variant: "destructive" })
          )
          .finally(() => {
            setValue("email", "");
          });
      } catch (error) {
        toast({
          title: "Something unexpected happened.",
          variant: "destructive",
        });
      }
    },
    [toast, setValue]
  );

  return (
    <Popover>
      <PopoverTrigger className="inline-flex items-center justify-center w-full h-full px-4 py-2 text-sm font-medium transition-colors bg-transparent border-t border-r rounded-none shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-zinc-300 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">
        <UserX />
      </PopoverTrigger>
      <PopoverContent className="space-y-7">
        <p>Remove a friend</p>
        <Form {...emailInput}>
          <form
            onSubmit={emailInput.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={emailInput.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="friend@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="outline" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
