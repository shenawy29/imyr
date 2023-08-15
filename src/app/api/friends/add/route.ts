import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/app/libs/prismadb";
import * as z from "zod";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const requestReceiverEmailObject = z
			.object({ email: z.string().email() })
			.parse(body);

		const requestSenderSession = await getServerSession(authOptions);
		if (!requestSenderSession) {
			return new NextResponse("Invalid Request", { status: 400 });
		}

		if (requestSenderSession.user?.email === requestReceiverEmailObject.email) {
			return new NextResponse("You can't send a friend request to yourself.", {
				status: 400,
			});
		}

		const requestSender = await prisma.user.findUnique({
			where: {
				email: requestSenderSession.user?.email!,
			},
		});

		const requestReceiver = await prisma.user.findUnique({
			where: {
				email: requestReceiverEmailObject.email,
			},
		});

		if (!requestSender) {
			return new NextResponse("Unauthorized Request", { status: 400 });
		}

		if (!requestReceiver) {
			return new NextResponse("This user does not exist.", { status: 400 });
		}

		const receiverFriendRequestIds = requestReceiver.friendRequests;
		const requestSenderId = requestSender.id;

		if (receiverFriendRequestIds.includes(requestSenderId)) {
			return new NextResponse("Already sent this user a friend request.", {
				status: 400,
			});
		}

		const receiverFriends = requestReceiver.friends;
		if (receiverFriends.includes(requestSenderId)) {
			return new NextResponse("Already friends with this user.", {
				status: 400,
			});
		}

		if (requestSender.friendRequests.includes(requestReceiver.id)) {
			return new NextResponse("This user already sent you a friend request.", {
				status: 400,
			});
		}

		const dbUser = await prisma.user.update({
			where: {
				email: requestReceiverEmailObject.email,
			},
			data: {
				friendRequests: [...receiverFriendRequestIds, requestSenderId],
			},
		});
		

		await pusherServer.trigger(dbUser.id, "friendrequest:new", requestSender);

		return new NextResponse("Friend request sent successfully.", {status: 200,});
	} catch (error) {
		return new NextResponse("Something unexpected happened.", { status: 500 });
	}
}
