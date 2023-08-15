import Link from "next/link";
import ImyrLogo from "./ImyrLogo";
import { User } from "@prisma/client";
import FriendBox from "./FriendBox";

type Props = { currentUserFriends?: User[] };

export default function Sidebar({ currentUserFriends }: Props) {
  return (
    <div className="right-0 flex flex-col w-full h-full overflow-y-auto min-w-fit bg-zinc-900 ">
      <Link
        href="/dashboard"
        className="flex items-center justify-center w-full px-5 py-3 border-b border-zinc-800 hover:bg-zinc-800"
      >
        <ImyrLogo />
      </Link>
      <div className="w-full text-center">
        <ul className="w-full">
          {currentUserFriends?.map((friend) => (
            <FriendBox friend={friend} key={friend.id} />
          ))}
        </ul>
      </div>
    </div>
  );
}
