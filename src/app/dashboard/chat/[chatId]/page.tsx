import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ConversationBody from "@/components/ConversationBody";
import MessageForm from "@/components/MessageForm";
import { getServerSession } from "next-auth";
import React from "react";
import prisma from "@/app/libs/prismadb";
type Props = { params: { chatId: string } };

export default async function page({ params }: Props) {
  const currentUserSession = await getServerSession(authOptions);

  if (!currentUserSession) {
    return null;
  }

  const conversation = await prisma?.conversation.findFirst({
    where: { id: params.chatId },
  });

  const messages = await prisma.message.findMany({
    where: {
      id: {
        in: conversation?.messagesIds,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      sender: true,
    },
  });

  if (!conversation) {
    return (
      <h1 className="flex flex-col items-center justify-center h-full gap-1 m-auto space-y-3 text-3xl tracking-tight text-center scroll-m-20 lg:text-4xl transistion ">
        <span>This conversation does not exist.</span>
      </h1>
    );
  }

  return (
    <>
      <ConversationBody conversationId={conversation.id} messages={messages} />
      <MessageForm conversationId={params.chatId} />
    </>
  );
}
