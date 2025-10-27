"use client";

export default function Home() {
  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth/google`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <button
        className="flex p-2 rounded-lg bg-zinc-50 text-black"
        onClick={handleLogin}
      >
        Google Login
      </button>
    </div>
  );
}
