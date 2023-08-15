"use client";

import { User } from "@prisma/client";
import AddFriendUI from "./AddFriendUI";
import LogoutButton from "./LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import FriendRequest from "./FriendRequest";
import { useEffect, useState } from "react";
import { pusherClient } from "@/app/libs/pusher";

type Props = {
	dbUser: User;
	friendRequestSenders: User[];
	userName: string;
};

export default function AvatarUI({ dbUser, friendRequestSenders, userName,}: Props) {
	const [friendRequests, setFriendRequests] = useState<User[]>(friendRequestSenders);

	useEffect(() => {
		pusherClient.subscribe(dbUser!.id);

		const friendRequestHandler = (friendRequest: User) => {
			console.log(friendRequest);
			setFriendRequests((currentFriendRequests)=>[...currentFriendRequests, friendRequest]);
		};

		pusherClient.bind("friendrequest:new", friendRequestHandler);

		return () => {
			pusherClient.unsubscribe(dbUser!.id);
			pusherClient.unbind("friendrequest:new", friendRequestHandler);
		};
	});

	return (
		<Popover>
			<PopoverTrigger>
				<Avatar className="relative inline-block overflow-visible">
					{friendRequests?.length! > 0 ? (
						<span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-center bg-[#22b455] rounded-full">
							{friendRequests.length}
						</span>
					) : null}
					<AvatarImage
						src={`${dbUser?.image || "/placeholder.jpg"}`}
						className="rounded-full"
					/>
					<AvatarFallback>{userName?.at(0)}</AvatarFallback>
				</Avatar>
			</PopoverTrigger>
			<PopoverContent className="p-0 space-y-7 w-[20rem]">
				{friendRequests.length > 0 ? (
					<div className="flex flex-col items-center h-full">
						{friendRequests.map((sender) => (
							<FriendRequest key={sender.id} sender={sender} />
						))}
						<div className="flex w-full">
							<AddFriendUI />
							<LogoutButton />
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center w-full h-full">
						<p className="flex items-center justify-center w-full h-full py-2 text-center">
							No friend requests currently.
						</p>
						<div className="flex w-full">
							<AddFriendUI />
							<LogoutButton />
						</div>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
