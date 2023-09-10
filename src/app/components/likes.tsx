"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Likes({
  tweet,
  addOptimisticTweet,
}: {
  tweet: TweetWithAuthor;
  addOptimisticTweet: (tweet: TweetWithAuthor) => void;
}) {
  const router = useRouter();
  const handleLike = async () => {
    const supabase = createClientComponentClient<Database>();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      if (tweet.user_has_liked_tweet) {
        addOptimisticTweet({
          ...tweet,
          likes_count: tweet.likes_count - 1,
          user_has_liked_tweet: !tweet.user_has_liked_tweet,
        });
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, tweet_id: tweet.id });
      } else {
        addOptimisticTweet({
          ...tweet,
          likes_count: tweet.likes_count + 1,
          user_has_liked_tweet: !tweet.user_has_liked_tweet,
        });
        await supabase
          .from("likes")
          .insert({ user_id: user.id, tweet_id: tweet.id });
      }
      router.refresh();
    }
  };
  console.log(tweet);
  return <button onClick={handleLike}>{tweet.likes_count} Likes</button>;
}
