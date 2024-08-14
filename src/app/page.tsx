"use client";

import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();

  const handleGoogleSignup = async () => {
    try {
      window.location.href = 'https://hiring.reachinbox.xyz/api/v1/auth/google-login?redirect_to=http://localhost:3000/login';
    } catch (error) {
      console.error('Google signup failed:', error);
      alert('Failed to connect to Google. Please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white">
      <header className="absolute top-4">
        <h1 className="text-4xl font-bold tracking-wider">REACHINBOX</h1>
      </header>

      <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-6 text-center">Create a new account</h2>

        <button
          onClick={handleGoogleSignup}
          className="flex items-center justify-center w-full bg-white text-black py-3 rounded-lg shadow-md mb-4 hover:bg-gray-200 transition duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M24 9.5c3.7 0 6.9 1.3 9.5 3.8l7-7C35.3 2.5 29.9 0 24 0 14.9 0 7.1 5.8 3.4 14.1l8.3 6.5C14.4 14 18.8 9.5 24 9.5z" />
            <path fill="#34A853" d="M46.6 24.5c0-1.6-.1-3.2-.4-4.7H24v9.1h12.8c-.6 3-2.5 5.6-5.2 7.3l8 6.3c4.7-4.3 7.4-10.7 7.4-17.7z" />
            <path fill="#FBBC05" d="M11.7 28.6c-1-2.9-1-6.1 0-9l-8.3-6.5C0 17.4 0 21.6 0 24s.8 6.5 2.3 9.5l8.3-6.5z" />
            <path fill="#EA4335" d="M24 48c6.5 0 12-2.1 16.1-5.7l-8-6.3c-2.2 1.5-4.8 2.4-8.1 2.4-5.2 0-9.6-3.5-11.2-8.4l-8.3 6.5C7.1 42.2 14.9 48 24 48z" />
          </svg>
          Sign Up with Google
        </button>

        <p className="mt-4 text-center">
          Already have an account? <a href="/signin" className="text-blue-400">Sign In</a>
        </p>
      </div>

      <footer className="absolute bottom-4 text-gray-500 text-sm">
        <p>© 2023 ReachInbox. All rights reserved.</p>
      </footer>
    </div>
  );
}
