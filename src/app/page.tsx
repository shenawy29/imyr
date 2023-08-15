import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import ImyrLogo from "@/components/ImyrLogo";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <nav className="fixed top-0 flex items-center justify-center w-full h-16 dark:bg-neutral-950 ">
        <div className="flex items-center justify-around w-full h-full text-white">
          <Link href="/">
            <ImyrLogo />
          </Link>
         
        </div>
      </nav>
      <main className="flex flex-col items-center justify-center w-screen h-screen max-h-screen dark:bg-neutral-950 ">
        <section className="relative z-20 flex flex-col items-center w-full py-5">
          <div className="absolute left-1/2 top-1/2 w-full max-w-6xl h-96 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px] bg-[#0b6a26]/60 -z-10" />
          <header className="mb-6 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-6xl transistion bg-gradient-to-br from-20% bg-clip-text text-transparent  from-green-300 to-[#22b455] gap-1 flex flex-col space-y-3 ">
              <span className="p-2">Need to gossip?</span>
            </h1>
          </header>
          <div className="flex flex-col items-center w-full max-w-xs">
            <div className="flex">
              {session ? (
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              ) : (
                <LoginForm />
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
