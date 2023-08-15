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

		const newFriendHandler = (friendToAdd: User) => {
			setUserFriends((currentUserFriends) => [...currentUserFriends, friendToAdd]);
		};

		const removeFriendHandler = (friendToRemove: User) => {
			const newFriends = userFriends.filter((friend) => friend.id !== friendToRemove.id);
			setUserFriends(newFriends);
		};

		pusherClient.bind("friend:new", newFriendHandler);
		pusherClient.bind("friend:remove", removeFriendHandler);

		return () => {
			pusherClient.unsubscribe(currentUser.id);
			pusherClient.unbind("friend:new", newFriendHandler);
			pusherClient.unbind("friend:remove", removeFriendHandler);
		};
	});

	return (
		<>
			{userFriends?.map((friend) => (
				<FriendBox friend={friend} currentUser={currentUser} key={friend.id} />
			))}
		</>
	);
}
