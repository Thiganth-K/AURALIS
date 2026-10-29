import { redirect } from "next/navigation";

export default function LikedSongsRedirect() {
  redirect("/library?tab=liked");
}

