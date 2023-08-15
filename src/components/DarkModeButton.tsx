"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useCallback } from "react";

type Props = {};

export default function DarkModeButton({}: Props) {
	const { setTheme, theme } = useTheme();

	const handleClick = useCallback(() => {
		if (theme === "dark") {
			return setTheme("light");
		}
		return setTheme("dark");
	}, [setTheme, theme]);

	return (
		<Button onClick={handleClick} variant='outline' className="h-full border-l-0 rounded-none " >
			{theme === "light" ? <Moon /> : <Sun />}
		</Button>
	);
}
