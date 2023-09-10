"use client";
import Likes from "./likes";
import { experimental_useOptimistic as useOptimistic } from "react";

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
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
