"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  FaSun,
  FaMoon,
  FaInbox,
  FaUser,
  FaHome,
  FaEnvelope,
  FaPaperPlane,
  FaChartBar,
  FaList,
  FaCaretDown,
} from 'react-icons/fa';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type EmailThread = {
  id: number;
  fromName: string;
  fromEmail: string;
  toName: string | null;
  toEmail: string;
  subject: string;
  body: string;
  sentAt: string;
  threadId: number;
};

type Message = {
  id: number;
  fromName: string;
  fromEmail: string;
  toName: string | null;
  toEmail: string;
  subject: string;
  body: string;
  sentAt: string;
  threadId: number;
};

export default function Onebox() {
  const [emailThreads, setEmailThreads] = useState<EmailThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Message[] | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default theme is dark
  const [replyBody, setReplyBody] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('bearerToken');
    const storedUserName = localStorage.getItem('userName');
    
    if (storedUserName) {
      setUserName(storedUserName);
    }

    if (!token) {
      console.log("No token found, redirecting to signin.");
      router.push('/signin');
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('https://hiring.reachinbox.xyz/api/v1/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("User details fetched:", response.data);
      } catch (error) {
        console.error('Error fetching user details', error);
        handleAuthError(error);
      }
    };

    const fetchEmailThreads = async () => {
      try {
        const response = await axios.get('https://hiring.reachinbox.xyz/api/v1/onebox/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Email threads fetched:", response.data.data);
        setEmailThreads(response.data.data);
      } catch (error) {
        console.error('Error fetching email threads', error);
        handleAuthError(error);
      }
    };

    fetchUserDetails();
    fetchEmailThreads();
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'D' || event.key === 'd') {
        if (selectedThread) {
          handleDeleteThread(selectedThread[0].threadId);
        }
      } else if (event.key === 'R' || event.key === 'r') {
        if (selectedThread) {
          // Open reply box or focus on reply input
          const replyBox = document.querySelector('textarea');
          if (replyBox) replyBox.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedThread]);

  const handleAuthError = (error: any) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.log("Unauthorized access, clearing token and redirecting to signin.");
      localStorage.removeItem('bearerToken');
      router.push('/signin');
    }
  };

  const handleViewThread = async (threadId: number) => {
    const token = localStorage.getItem('bearerToken');
    if (!token) {
      console.log("No token found, redirecting to signin.");
      router.push('/signin');
      return;
    }

    try {
      const response = await axios.get(`https://hiring.reachinbox.xyz/api/v1/onebox/messages/${threadId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Thread details fetched:", response.data.data);
      setSelectedThread(response.data.data);
    } catch (error) {
      console.error('Error fetching thread details', error);
      handleAuthError(error);
    }
  };

  const handleDeleteThread = async (threadId: number) => {
    const token = localStorage.getItem('bearerToken');
    if (!token) {
      console.log("No token found, redirecting to signin.");
      router.push('/signin');
      return;
    }

    try {
      await axios.delete(`https://hiring.reachinbox.xyz/api/v1/onebox/messages/${threadId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmailThreads(emailThreads.filter((thread) => thread.id !== threadId));
      setSelectedThread(null);
    } catch (error) {
      console.error('Error deleting thread', error);
      handleAuthError(error);
    }
  };

  const handleReplyThread = async (threadId: number) => {
    const token = localStorage.getItem('bearerToken');
    if (!token) {
      console.log("No token found, redirecting to signin.");
      router.push('/signin');
      return;
    }

    if (!replyBody) {
      alert("Reply body cannot be empty.");
      return;
    }

    if (!selectedThread || selectedThread.length === 0) {
      console.error("No thread is selected or the selected thread is empty.");
      alert("Cannot send reply. No thread selected.");
      return;
    }

    try {
      await axios.post(
        `https://hiring.reachinbox.xyz/api/v1/onebox/reply/${threadId}`,
        {
          toName: selectedThread[0].fromName,
          to: selectedThread[0].fromEmail,
          from: selectedThread[0].toEmail,
          fromName: userName,
          subject: `Re: ${selectedThread[0].subject}`,
          body: replyBody,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Reply sent successfully!");
      setReplyBody("");
    } catch (error) {
      console.error('Error sending reply', error);
      handleAuthError(error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "";
    const initials = name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase();
    return initials;
  };

  return (
    <div className={`h-screen flex overflow-hidden ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Left Sidebar */}
      <div className={`w-16 flex flex-col items-center ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="mt-4"></div>
        <img
          src="/mail.png" // Replace with your actual path
          alt="M Mail Icon"
          className="mb-8"
          style={{ width: '40px', height: '40px' }}
        />
        <div className="mt-8"></div>
        <FaHome className={`mb-6 cursor-pointer ${isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-800 hover:text-black'}`} size={24} />
        <div className="mt-2"></div>

        <FaUser className={`mb-6 cursor-pointer ${isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-800 hover:text-black'}`} size={24} />
        <div className="mt-2"></div>

        <FaEnvelope className={`mb-6 cursor-pointer ${isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-800 hover:text-black'}`} size={24} />
        <div className="mt-2"></div>

        <FaPaperPlane className={`mb-6 cursor-pointer ${isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-800 hover:text-black'}`} size={24} />
        <div className="mt-2"></div>

        <FaList className={`mb-6 cursor-pointer ${isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-800 hover:text-black'}`} size={24} />
        <div className="mt-2"></div>

        <FaInbox className={`mb-6 cursor-pointer ${isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-800 hover:text-black'}`} size={24} />
        <div className="mt-2"></div>

        <FaChartBar className={`mb-6 cursor-pointer ${isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-800 hover:text-black'}`} size={24} />
        <div className="text-white mt-auto cursor-pointer">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ backgroundColor: '#054f31', width: '40px', height: '40px' }}
          >
            <span className="text-white font-semibold">
              {getInitials(userName)}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-full border-l border-gray-400"></div>

      {/* Main Content */}
      <div className="flex-1">
        <header
          className="flex justify-between items-center mb-0"
          style={{
            backgroundColor: isDarkMode ? '#202022' : '#f5f5f5',
            padding: '0.5rem 1rem',
            borderBottom: isDarkMode ? '1px solid #404040' : '1px solid #D3D3D3',
          }}
        >
          <h1 className="text-2xl font-bold">Onebox</h1>
          <div className="flex items-center space-x-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={!isDarkMode} onChange={toggleDarkMode} />
              <div className="w-16 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                <FaMoon className={`absolute left-1 top-1 text-white ${isDarkMode && 'opacity-0'} transition-opacity duration-300`} size={24} />
                <FaSun className={`absolute right-1 top-1 text-yellow-500 ${!isDarkMode && 'opacity-0'} transition-opacity duration-300`} size={24} />
              </div>
            </label>
            {userName && (
              <div className="flex items-center space-x-2">
                <span className="text-lg">{`${userName}'s Workspace`}</span>
                <FaCaretDown />
              </div>
            )}
          </div>
        </header>

        <div className="p-4">
          {emailThreads.length === 0 ? (
            <div className="text-center">
              <div className="mt-24"></div>

              <img
                src="/NoEmail.png"
                alt="No emails"
                className="mx-auto mb-4"
                style={{
                  width: "280.02px",
                  height: "229.4px",
                  gap: "0px",
                  opacity: "1",
                }}
              />
              <h2 className="text-xl">It's the beginning of a legendary sales pipeline</h2>
              <p className="text-gray-400">When you have inbound E-mails you'll see them here</p>
              <p className="text-gray-400">you'll see them below</p>
            </div>
          ) : (
            <div className="space-y-4">
              {emailThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="bg-gray-800 p-4 hover:bg-gray-700 transition duration-200 flex justify-between items-center"
                >
                  <div onClick={() => handleViewThread(thread.threadId)}>
                    <h2 className="text-lg font-semibold">{thread.subject}</h2>
                    <p className="text-gray-400">From: {thread.fromName}</p>
                    <p className="text-gray-400">Received: {new Date(thread.sentAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteThread(thread.threadId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedThread && (
            <div className="mt-4 p-4 bg-gray-900">
              <h2 className="text-xl font-bold mb-2">Thread Details</h2>
              {selectedThread.map((message) => (
                <div key={message.id} className="mb-4">
                  <h3 className="text-lg font-semibold">{message.subject}</h3>
                  <p className="text-gray-300">From: {message.fromName} ({message.fromEmail})</p>
                  <p className="text-gray-300">To: {message.toEmail}</p>
                  <p className="text-gray-400">Received: {new Date(message.sentAt).toLocaleString()}</p>
                  <div className="mt-2 bg-gray-700 p-3">
                    <div dangerouslySetInnerHTML={{ __html: message.body }} />
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <ReactQuill value={replyBody} onChange={setReplyBody} className="bg-gray-700 text-white" />
                <button
                  className="mt-2 bg-blue-600 text-white p-2 rounded-lg"
                  onClick={() => handleReplyThread(selectedThread[0].threadId)}
                >
                  Send Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
