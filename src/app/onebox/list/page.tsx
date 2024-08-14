"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

type EmailThread = {
  id: number;
  fromName: string;
  fromEmail: string;
  toName: string | null;
  toEmail: string;
  subject: string;
  body: string;
  sentAt: string;
};

export default function ListPage() {
  const [emailThreads, setEmailThreads] = useState<EmailThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null);

  useEffect(() => {
    const fetchEmailThreads = async () => {
      try {
        const response = await axios.get('/api/onebox/list');
        setEmailThreads(response.data.data);
      } catch (error) {
        console.error('Error fetching email threads', error);
      }
    };

    fetchEmailThreads();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'D' || event.key === 'd') {
        if (selectedThread) {
          // Handle delete thread
          console.log(`Deleting thread with id: ${selectedThread.id}`);
          // Implement the delete logic here
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Email Threads</h1>
      {emailThreads.length === 0 ? (
        <p>No emails found.</p>
      ) : (
        <ul className="space-y-4">
          {emailThreads.map((thread) => (
            <li
              key={thread.id}
              className="p-4 border border-gray-300 rounded cursor-pointer"
              onClick={() => setSelectedThread(thread)}
            >
              <h2 className="text-lg font-semibold">{thread.subject}</h2>
              <p>From: {thread.fromName} ({thread.fromEmail})</p>
              <p>Received: {new Date(thread.sentAt).toLocaleString()}</p>
              <div className="mt-2 bg-gray-100 p-3">
                <div dangerouslySetInnerHTML={{ __html: thread.body }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
