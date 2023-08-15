"use client";

import { Button } from "./ui/button";
import { UserPlus } from "lucide-react";

type Props = {};

export default function AddFriendButton({}: Props) {
  return (
    <Button variant="outline" className="h-full border-t-0 rounded-none">
      <UserPlus />
    </Button>
  );
}
