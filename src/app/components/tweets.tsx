"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Likes from "./likes";
import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
        <div
          key={tweet.id}
          className="mb-4 flex border border-t-0 border-gray-800 px-4 py-8"
        >
          <div className="h-9 w-9">
            <Image
              alt="author avatar"
              src={tweet.author.avatar_url ?? ""}
              width={36}
              height={36}
              className="rounded-full"
            />
          </div>
          <div className="ml-4">
            <p>
              <span className="font-bold">{tweet.author.name}</span>{" "}
              <span className="ml-2 text-sm text-gray-400">
                @{tweet.author.username}
              </span>
            </p>
            <p className="">{tweet.title}</p>
            <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
          </div>
        </div>
      ))}
    </>
  );
}
