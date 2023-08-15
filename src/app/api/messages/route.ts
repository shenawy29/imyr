import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(req: Request) {
  try {
    const currentUserSession = await getServerSession(authOptions);
    const currentUser = await prisma.user.findUnique({
      where: {
        email: currentUserSession?.user?.email!,
      },
    });

    const { message, conversationId } = await req.json();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        sender: true,
      },
    });

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        messagesIds: {
          push: newMessage.id,
        },
      },
      include: {
        users: true,
        messages: true,
      },
    });

    await pusherServer.trigger(conversationId, "messages:new", newMessage);

    return NextResponse.json(newMessage, { status: 200 });
  } catch (error) {
    return new NextResponse("Something unexpeced happened.", { status: 500 });
  }
}
