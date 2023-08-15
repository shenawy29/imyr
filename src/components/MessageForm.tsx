"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { SendHorizonal } from "lucide-react";
import axios from "axios";

type Props = {
  conversationId: string;
};

export default function MessageForm({ conversationId }: Props) {
  const formSchema = z.object({
    message: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });
  const { setValue } = form;

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios.post("/api/messages", {
      ...values,
      conversationId,
    });

    setValue("message", "", { shouldValidate: true });
  }

  return (
    <Form {...form}>
      <form  onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="h-full px-5 py-3">
              <FormControl className="h-full mb-3">
                <div className="flex w-full h-full ">
                  <Input
                    placeholder="Type a message"
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    {...field}
                    className="h-full rounded-s-full rounded-e-none"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    color="#22b455"
                    className="flex items-center justify-center w-12 h-full text-center group-hover:text-[#22b455] border-l-0 rounded-e-full rounded-s-none text-[#22b455]"
                    variant="outline"
                  >
                    <SendHorizonal size={25} />
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
