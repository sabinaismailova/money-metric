"use client";
import styles from "./login.module.css"
import GoogleLogo from "./GoogleLogo.png"
import Image from "next/image";

export default function Home() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth/google`;
  };

  return (
    <div className="min-w-screen h-screen bg-gray-900 flex items-center justify-center">
      <div className={styles.leftContent}>
        <h1 className={styles.h1}>Money Metrics</h1>
      </div>
      <div className={styles.loginSection}>
        <div className={styles.loginContainer}>
          <span className={styles.span}>
            Log in 
          </span>
          <button
            className={styles.loginButton}
            onClick={handleGoogleLogin}
          >
            <Image alt="Google Login Button Logo" src={GoogleLogo} width={24} height={24}/>
            Use Google Account
          </button>
        </div>
      </div>
    </div>
  );
}
