import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Fetch the list of email threads from your data source
    const emailThreads = [
      {
        id: 3,
        fromName: "Shaw Adley",
        fromEmail: "shaw@getmemeetings.com",
        toName: "",
        toEmail: "mitrajit2022@gmail.com",
        threadId: 1,
        subject: "Shaw - following up on our meeting last week...",
        body: "<p>Hi Mitrajit,</p><p>Just wondering if you’re still interested.</p><p>Regards,<br/>Shaw Adley</p>",
        isRead: true,
        sentAt: "2023-11-23T04:08:45.000Z",
      },
      {
        id: 4,
        fromName: "Shaw Adley",
        fromEmail: "shaw@getmemeetings.com",
        toName: "",
        toEmail: "mitrajit2022@gmail.com",
        threadId: 2,
        subject: "Test mail",
        body: "<p>Test mail</p>",
        isRead: true,
        sentAt: "2023-11-23T04:08:45.000Z",
      },
    ];

    // Return the list of emails as JSON
    res.status(200).json({ status: 200, data: emailThreads });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
