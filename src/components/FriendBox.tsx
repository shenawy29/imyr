"use client";

import { Button } from "./ui/button";
import { Conversation, User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCallback, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import clsx from "clsx";

type Props = {
	friend: User;
};

export default function FriendBox({ friend }: Props) {
	const [conversation, setConversation] = useState<Conversation>();

	const router = useRouter();

	const handleClick = useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			e.preventDefault();
			axios
				.post("/api/conversations", { userId: friend.id })
				.then(({ data: conversation }) => {
					setConversation(conversation);
					router.push(`/dashboard/chat/${conversation.id}`);
				});
		},
		[friend.id, router]
	);

	return (
		<>
			<Button
				onClick={handleClick}
				variant="outline"
				className={clsx(
					"flex items-center justify-between w-full h-16 border-t-0 rounded-none  ",
					// conversation?.userIds.includes(friend.id) && "bg-zinc-800"
				)}
			>
				<Avatar className="relative inline-block overflow-visible">
					<AvatarImage
						src={`${friend?.image || "/placeholder.jpg"}`}
						className="rounded-full"
					/>
					<AvatarFallback>{friend.name?.at(0) as string}</AvatarFallback>
				</Avatar>
				<p className="text-black truncate dark:text-white">{friend.email}</p>
			</Button>
		</>
	);
}
