import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/app/libs/prismadb";
import { User } from "@prisma/client";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(req: Request) {
	try {
		const { sender } = await req.json();

		const currentUserSession = await getServerSession(authOptions);
		if (!currentUserSession) {
			return new NextResponse("Invalid Request", { status: 400 });
		}

		const dbUser = await prisma.user.findUnique({
			where: {
				email: currentUserSession.user?.email!,
			},
		});

		if (!dbUser) {
			return new NextResponse("Unauthorized request.", { status: 400 });
		}

		const senderIsInFriendRequests = dbUser.friendRequests.includes(sender.id);

		if (!senderIsInFriendRequests) {
			return new NextResponse("User never sent a friend request.", {
				status: 400,
			});
		}

		const updatedFriendRequests = dbUser.friendRequests.filter(
			(request) => request !== sender.id
		);

		await prisma.user.update({
			where: {
				email: currentUserSession.user?.email!,
			},
			data: {
				friendRequests: updatedFriendRequests,
			},
		});

		const updatedFriends = [...dbUser.friends, sender.id];

		const updatedFriendsSender = [...sender.friends, dbUser.id];

		await prisma.user.update({
			where: {
				email: currentUserSession.user?.email!,
			},
			data: {
				friends: updatedFriends,
			},
		});

		await prisma.user.update({
			where: {
				email: sender.email!,
			},
			data: {
				friends: updatedFriendsSender,
			},
		});

		await pusherServer.trigger(dbUser.id, "friend:new", sender);
		await pusherServer.trigger(sender.id, "friend:new", dbUser);

		await pusherServer.trigger(dbUser.id, "friendrequest:remove", sender);

		return new NextResponse("Friend accepted.", {
			status: 200,
		});
	} catch (error) {
		return new NextResponse("Something unexpected happened.", { status: 500 });
	}
}
