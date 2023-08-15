import { redirect } from "next/navigation";

type Props = {};

export default function page({}: Props) {
  redirect("/dashboard");
}
