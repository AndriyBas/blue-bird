import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./components/auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./components/new-tweet";
import Tweets from "./components/tweets";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("tweets")
    .select("*,author:profiles(*),likes(user_id)")
    .order("created_at", { ascending: false });

  const tweets: TweetWithAuthor[] =
    data?.map((t) => ({
      ...t,
      author: Array.isArray(t.author) ? t.author[0] : t.author,
      user_has_liked_tweet: Boolean(
        t.likes.find((l) => l.user_id === session.user.id),
      ),
      likes_count: t.likes.length,
    })) ?? [];

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flex justify-between border border-t-0 border-gray-800 px-4 py-6">
        <h1 className="text-xl font-bold">Home</h1>
        <AuthButtonServer />
      </div>
      <NewTweet user={session.user} />
      <Tweets tweets={tweets} />
    </div>
  );
}
