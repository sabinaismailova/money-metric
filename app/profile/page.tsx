"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setUser(result);
      } catch (err) {
        setError(err);
      }
    }

    fetchUserData();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  if (error) return error;

  const handleLogout = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth/logout`;
  };

  const handleTransactionsRedirect = () => {
    router.push("/transactions");
  };

  return (
    <main className="p-2">
      <h1>Welcome {user.displayName}</h1>
      <p>Email: {user.emails?.[0]?.value}</p>
      <button onClick={handleLogout}>Logout</button>
      <br></br>
      <button onClick={handleTransactionsRedirect}>Transactions</button>
    </main>
  );
}
