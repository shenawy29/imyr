"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Props = {};

export default function DarkModeButton({}: Props) {
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false)


	useEffect(() => {
    setMounted(true)
  }, [])


	const handleClick = useCallback(() => {
		if (theme === "dark") {
			setTheme("light");
		} else{
			setTheme("dark");
		}
	}, [setTheme, theme]);

	return (
		<Button
			onClick={handleClick}
			variant="outline"
			className="h-full border-l-0 rounded-none "
		>
			{mounted ? theme === "dark" ? <Sun /> : <Moon /> : <Sun/>}
		</Button>
	);
}
