import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/libs/prismadb";
import AvatarUI from "./AvatarUI";
import { notFound } from "next/navigation";

type Props = {};

export default async function ProfileUI({}: Props) {
	const session = await getServerSession(authOptions);
	const userName = session?.user?.name!;
	const userEmail = session?.user?.email;

	const dbUser = await prisma.user.findUnique({
		where: {
			email: userEmail!,
		},
	});

	if (!dbUser || !session) {
		return notFound();
	}

	const friendRequestSendersIds = dbUser?.friendRequests;
	const friendRequestSenders = await prisma.user.findMany({
		where: {
			id: {
				in: friendRequestSendersIds,
			},
		},
	});

	return (
		<div className="w-full h-16 mt-auto border-t-[1px] dark:border-zinc-800  ">
			<div className="flex items-center w-full h-full text-lg font-normal rounded-none justify-normal">
				<div className="flex items-center h-full ml-6 mr-auto space-x-6">
					<AvatarUI
						dbUser={dbUser}
						friendRequestSenders={friendRequestSenders}
						userName={userName}
					/>
					<div className="flex flex-col w-48">
						<span className="text-base font-normal">{userName}</span>
						<span className="w-full text-xs font-light truncate">
							{userEmail}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
