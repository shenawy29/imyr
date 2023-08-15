import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/app/libs/prismadb";
import * as z from "zod";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const friendToRemoveEmailObject = z
			.object({ email: z.string().email() })
			.parse(body);

		const currentUserSession = await getServerSession(authOptions);
		if (!currentUserSession) {
			return new NextResponse("Invalid Request", { status: 400 });
		}

		if (currentUserSession.user?.email === friendToRemoveEmailObject.email) {
			return new NextResponse("You aren't friends with yourself.", {
				status: 400,
			});
		}

		const currentUser = await prisma.user.findUnique({
			where: {
				email: currentUserSession.user?.email!,
			},
		});

		const friendToRemove = await prisma.user.findUnique({
			where: {
				email: friendToRemoveEmailObject.email,
			},
		});

		if (!currentUser) {
			return new NextResponse("Unauthorized Request", { status: 400 });
		}

		if (!friendToRemove) {
			return new NextResponse("This user does not exist.", { status: 400 });
		}

		if (!friendToRemove.friends.includes(currentUser.id)) {
			return new NextResponse("Not friends with this user.", {
				status: 400,
			});
		}

		const newFriendToRemoveFriends = friendToRemove.friends.filter(
			(friend) => friend !== currentUser.id
		);

		const newCurrentUserFriends = currentUser.friends.filter(
			(friend) => friend !== friendToRemove.id
		);

		await prisma.user.update({
			where: {
				id: friendToRemove.id,
			},
			data: {
				friends: newFriendToRemoveFriends,
			},
		});

		await prisma.user.update({
			where: {
				id: currentUser.id,
			},
			data: {
				friends: newCurrentUserFriends,
			},
		});

		await pusherServer.trigger(friendToRemove.id, "friend:remove", currentUser);
		await pusherServer.trigger(currentUser.id, "friend:remove", friendToRemove);

		return new NextResponse("Friend successfully removed.", {
			status: 200,
		});
	} catch (error) {
		return new NextResponse("Something unexpected happened.", { status: 500 });
	}
}
