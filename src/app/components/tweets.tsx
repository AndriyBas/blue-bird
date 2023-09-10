"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Likes from "./likes";
import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import { useRouter } from "next/navigation";

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("all_tweets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tweets",
        },
        (payload) => {
          console.log({ payload });
          router.refresh();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    TweetWithAuthor[],
    TweetWithAuthor
  >(tweets, (current, newTweet) => {
    const newTweets = [...current];
    const index = newTweets.findIndex((t) => t.id === newTweet.id);
    newTweets[index] = newTweet;
    return newTweets;
  });
  return (
    <>
      {optimisticTweets.map((tweet) => (
        <div key={tweet.id} className="mb-4 border-b border-b-white">
          <p>
            <strong>{tweet.author.name}</strong> (@{tweet.author.username})
          </p>
          <p className="ml-4">{tweet.title}</p>
          <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
        </div>
      ))}
    </>
  );
}
