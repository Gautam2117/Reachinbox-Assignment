"use client";

import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();

  const handleGoogleSignin = () => {
    const googleOauthUrl = `https://hiring.reachinbox.xyz/api/v1/auth/google-login?redirect_to=${encodeURIComponent('http://localhost:3000/login')}`;
    console.log("Redirecting to:", googleOauthUrl);
    window.location.href = googleOauthUrl;
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white">
      <header className="absolute top-4">
        <h1 className="text-4xl font-bold tracking-wider">REACHINBOX</h1>
      </header>

      <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-6 text-center">Sign in to your account</h2>
        <button
          onClick={handleGoogleSignin}
          className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
}
