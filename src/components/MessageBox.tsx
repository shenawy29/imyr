"use client";

import { Message, User } from "@prisma/client";
import clsx from "clsx";
import { useSession } from "next-auth/react";

type Props = {
  message: Message & { sender: User };
};

export default function MessageBox({ message }: Props) {
  const session = useSession();
  const isOwnMessage = session.data?.user?.email === message.sender.email;

  return (
    <div className={clsx("flex gap-3 p-3", isOwnMessage && "justify-end")}>
      <div className={clsx("flex flex-col gap-1", isOwnMessage && "items-end")}>
        <div
          className={clsx(
            "flex items-center gap-1  rounded-full px-4 py-2 ",
            isOwnMessage ? "bg-[#22b455]" : "dark:bg-zinc-800 bg-zinc-200 dark:text-white"
          )}
        >
          {message.body}
        </div>
      </div>
    </div>
  );
}
