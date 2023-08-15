import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(req: Request) {
	try {
		const { sender } = await req.json();

		const currentUserSession = await getServerSession(authOptions);
		if (!currentUserSession) {
			return new NextResponse("Invalid Request", { status: 400 });
		}

		const currentUser = await prisma.user.findUnique({
			where: {
				email: currentUserSession.user?.email!,
			},
		});

		if (!currentUser) {
			return new NextResponse("Unauthorized request.", { status: 400 });
		}

		const senderIsInFriendRequests = currentUser.friendRequests.includes(
			sender.id
		);

		if (!senderIsInFriendRequests) {
			return new NextResponse("User never sent a friend request.", {
				status: 400,
			});
		}

		const updatedFriendRequests = currentUser.friendRequests.filter(
			(request) => request !== sender.id
		);

		const dbUser = await prisma.user.update({
			where: {
				email: currentUserSession.user?.email!,
			},
			data: {
				friendRequests: updatedFriendRequests,
			},
		});

		await pusherServer.trigger(dbUser.id, "friendrequest:deny", {});

		await pusherServer.trigger(dbUser.id, "friendrequest:remove", sender);

		return new NextResponse("Friend accepted.", {
			status: 200,
		});
	} catch (error) {
		return new NextResponse("Something unexpected happened.", { status: 500 });
	}
}
