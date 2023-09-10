"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

export default function GithubButton() {
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };
  return (
    <button
      onClick={handleSignIn}
      className="rounded-full p-8 hover:bg-gray-800"
    >
      <Image
        src="/github-mark-white.png"
        alt="GitHub logo"
        width={100}
        height={100}
      />
    </button>
  );
}
