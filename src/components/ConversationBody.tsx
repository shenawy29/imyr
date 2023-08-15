"use client";

import { Message, User } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/app/libs/pusher";

type Props = {
	messages: (Message & { sender: User })[];
	conversationId: string;
};

export default function ConversationBody({ messages, conversationId }: Props) {
	const [initialMessages, setInitialMessages] = useState(messages);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		pusherClient.subscribe(conversationId);
		bottomRef?.current?.scrollIntoView();

		const messageHandler = (message: Message & { sender: User }) => {
			setInitialMessages((current) => {
				return [...current, message];
			});
		};

		pusherClient.bind("messages:new", messageHandler);

		return () => {
			pusherClient.unsubscribe(conversationId);
			pusherClient.unbind("messages:new", messageHandler);
		};
	});

	return (
		<div className="flex flex-col overflow-y-auto grow">
			<div className="flex flex-col">
				{initialMessages.map((message, i) => (
					<MessageBox message={message} key={message.id} />
				))}
				<div ref={bottomRef} />
			</div>
		</div>
	);
}
