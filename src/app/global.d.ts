import { Database as DB } from "@/lib/database.types";

declare global {
  type Database = DB;

  type Tweet = DB["public"]["Tables"]["tweets"]["Row"];
  type Profile = DB["public"]["Tables"]["profiles"]["Row"];

  type TweetWithAuthor = Tweet & {
    likes_count: number;
    author: Profile;
    user_has_liked_tweet: boolean;
  };
}
