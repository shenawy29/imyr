import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/app/libs/prismadb";

export async function POST(req: Request) {
	try {
		const currentUserSession = await getServerSession(authOptions);

		const currentUser = await prisma.user.findUnique({
			where: {
				email: currentUserSession?.user?.email!,
			},
		});

		if (!currentUser) {
			return new NextResponse("Unauthorized Request", { status: 401 });
		}

		const { userId } = await req.json();
		const dbUser = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		if (!userId || !dbUser) {
			return new NextResponse("User does not exist.", { status: 401 });
		}

		const existingConversations = await prisma.conversation.findMany({
			where: {
				OR: [
					{ userIds: { equals: [currentUser.id, userId] } },
					{ userIds: { equals: [userId, currentUser.id] } },
				],
			},
		});

		const existingConversation = existingConversations.at(0);

    if (!existingConversation?.userIds.includes(currentUser.id)) {
			return new NextResponse(
				"You don't have permission to view this conversation.",
				{ status: 400 }
			);
		}

		if (existingConversation) {
			return NextResponse.json(existingConversation, { status: 200 });
		}

		const newConversation = await prisma.conversation.create({
			data: {
				users: {
					connect: [
						{
							id: currentUser.id,
						},
						{
							id: userId,
						},
					],
				},
			},
			include: {
				users: true,
			},
		});

		return NextResponse.json(newConversation, { status: 201 });
	} catch (error) {
		return new NextResponse("Something unexpected happened.", { status: 500 });
	}
}
