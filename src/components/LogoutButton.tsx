"use client";

import { useCallback } from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

type Props = {};

export default function LogoutButton({}: Props) {
  
  const handleSignout = useCallback(() => {
    signOut();
  }, []);

  return (
    <Button
      variant="outline"
      className="w-full h-full border-0 border-t border-r rounded-none"
      onClick={handleSignout}
    >
      <LogOut />
    </Button>
  );
}
