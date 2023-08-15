import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/app/libs/prismadb";
import { notFound } from "next/navigation";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet";
import ProfileUI from "@/components/ProfileUI";
import { Button } from "@/components/ui/button";
import { PanelRightOpen, X } from "lucide-react";
import Link from "next/link";
import ImyrLogo from "@/components/ImyrLogo";
import Friends from "@/components/Friends";
import DarkModeButton from "@/components/DarkModeButton";

type Props = { children: React.ReactNode };

export default async function DashboardLayout({ children }: Props) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return notFound();
	}

	const currentUserEmail = session?.user?.email!;
	const currentUser = await prisma.user.findUnique({
		where: {
			email: currentUserEmail,
		},
	});
  if (!currentUser){
    notFound()
  }

	const currentUserFriendsIds = currentUser?.friends;
	const currentUserFriends = await prisma.user.findMany({
		where: {
			id: {
				in: currentUserFriendsIds,
			},
		},
	});

	return (
		<main className="flex flex-col h-full">
			<header className="flex" >
				<Sheet>
					<div className="flex items-center justify-between w-full h-12 bg-transparent border shadow-sm border-zinc-200 dark:border-zinc-800">
						<SheetTrigger
							className="flex items-center justify-center h-full bg-transparent border-0 border-r shadow-sm aspect-square border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
						>
							<PanelRightOpen />
						</SheetTrigger>
					</div>
					<SheetContent className="w-[18rem] p-0 m-0 border-r-0" side="left">
						<aside className="flex flex-col h-full m-0 overflow-y-auto dark:bg-zinc-900">
							<div className="flex flex-col w-full h-full overflow-y-auto">
								<div className="flex">
									<SheetClose asChild>
										<Link
											href="/dashboard"
											className="flex items-center justify-center w-full px-5 py-3 transition-colors border-b dark:border-zinc-800 hover:bg-zinc-100/80 dark:hover:bg-zinc-800"
										>
											<ImyrLogo />
										</Link>
									</SheetClose>
									<SheetClose asChild>
										<Button variant="outline" className="h-full rounded-none">
											<X />
										</Button>
									</SheetClose>
								</div>

								<div className="w-full text-center">
									<ul className="w-full">
										<Friends currentUserFriends={currentUserFriends} currentUser={currentUser} />
									</ul>
								</div>
							</div>
							<ProfileUI />
						</aside>
					</SheetContent>
				</Sheet>
				<DarkModeButton />
			</header>
			{children}
		</main>
	);
}
