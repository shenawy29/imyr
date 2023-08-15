"use client";

import { User } from "@prisma/client";
import FriendBox from "./FriendBox";
import { useEffect, useState } from "react";
import { pusherClient } from "@/app/libs/pusher";

type Props = {
	currentUserFriends: User[];
	currentUser: User;
};

export default function Friends({ currentUserFriends, currentUser }: Props) {
	const [userFriends, setUserFriends] = useState<User[]>(currentUserFriends);

	useEffect(() => {
		pusherClient.subscribe(currentUser.id);

		const newFriendHandler = (friend: User) => {
			setUserFriends((currentUserFriends) => [
				...currentUserFriends,
				friend,
			]);
		};

		pusherClient.bind("friend:new", newFriendHandler);

		return () => {
			pusherClient.unsubscribe(currentUser.id);
			pusherClient.unbind("friend:new", newFriendHandler);
		};
	});

	return (
		<>
			{userFriends?.map((friend) => (
				<FriendBox friend={friend} key={friend.id} />
			))}
		</>
	);
}
