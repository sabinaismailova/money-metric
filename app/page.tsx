"use client";
import { useEffect, useState} from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth/google`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <button
        className="flex p-2 rounded-lg bg-zinc-50 text-black"
        onClick={handleGoogleLogin}
      >
        Google Login
      </button>
    </div>
  );
}
