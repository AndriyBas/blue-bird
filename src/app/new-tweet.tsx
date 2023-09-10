import {
  createServerActionClient,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default function NewTweet() {
  const handleSubmit = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));
    const supabase = createServerActionClient<Database>({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("tweets").insert({ title, user_id: user?.id });
    }
  };

  return (
    <form action={handleSubmit}>
      <input name="title" className="bg-inherit" />
    </form>
  );
}
