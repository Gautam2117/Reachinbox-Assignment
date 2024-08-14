"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Login() {
  const router = useRouter();

  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
  
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to decode JWT", error);
      return null;
    }
  };  

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      try {
        const decodedToken = decodeJWT(token);
        const userName = decodedToken?.user?.firstName || "User";

        localStorage.setItem('bearerToken', token);
        localStorage.setItem('userName', userName);

        router.push('/onebox');
      } catch (error) {
        console.error("Error decoding token:", error);
        router.push('/signin');
      }
    } else {
      router.push('/signin');
    }
  }, [router]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-8">Please wait...</h1>
      <p className="text-lg">Redirecting you to your inbox...</p>
    </div>
  );
}
