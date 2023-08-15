"use client";

import { User } from "@prisma/client";
import { Button } from "./ui/button";
import { Check, X } from "lucide-react";
import { useCallback } from "react";
import axios from "axios";
import { useToast } from "./ui/use-toast";

type Props = {
  sender: User;
};

export default function FriendRequest({ sender }: Props) {
  const { toast } = useToast();
  

  const handleDeny = useCallback(() => {
    axios
      .post("/api/friends/deny", { sender })
      .then(() => toast({ title: "Request denied" }));
  }, [toast, sender]);

  const handleAccept = useCallback(() => {
    axios
      .post("/api/friends/accept", { sender })
      .then(() => toast({ title: "Request accepted" }));
  }, [toast, sender]);

  return (
    <div className="flex items-center justify-between w-full h-full">
        <span className="flex items-center justify-center w-full h-full pl-2 text-sm text-center">
          {sender.email}
        </span>
      <div className="flex h-full">
        <Button
          onClick={handleAccept}
          variant="outline"
          size="icon"
          className="border-0 border-l rounded-none"
        >
          <Check />
        </Button>
        <Button
          onClick={handleDeny}
          variant="outline"
          size="icon"
          className="border-0 border-l rounded-none"
        >
          <X />
        </Button>
      </div>
    </div>
  );
}
