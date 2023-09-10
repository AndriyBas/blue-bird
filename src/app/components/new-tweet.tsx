import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";

export default function NewTweet({ user }: { user: User }) {
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
    <form action={handleSubmit} className="border border-t-0 border-gray-800">
      <div className="flex px-4 py-8">
        <div className="h-12 w-12">
          <Image
            src={user.user_metadata.avatar_url}
            alt="user avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <input
          name="title"
          className="ml-2 flex-1 bg-inherit px-2 text-2xl leading-loose placeholder-gray-500 outline-none"
          placeholder="What is happening?!"
        />
      </div>
    </form>
  );
}
