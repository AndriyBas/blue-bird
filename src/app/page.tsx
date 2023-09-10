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
    .select("*,author:profiles(*),likes(user_id)");

  const tweets: TweetWithAuthor[] =
    data?.map((t) => ({
      ...t,
      author: Array.isArray(t.author) ? t.author[0] : t.author,
      user_has_liked_tweet: Boolean(
        t.likes.find((l) => l.user_id === session.user.id)
      ),
      likes_count: t.likes.length,
    })) ?? [];

  return (
    <div>
      <AuthButtonServer />
      <NewTweet />
      <Tweets tweets={tweets} />
    </div>
  );
}
