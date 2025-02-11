// import { useEffect, useState } from "react";
// import io from "socket.io-client";
// import axios from "axios";

// const socket = io("http://localhost:5000");

// export default function Chatpage() {
//   const [user, setUser] = useState(null);
//   const [groupId, setGroupId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [file, setFile] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/user-info", {
//           headers: { Authorization: localStorage.getItem("token") },
//         });
//         setUser(res.data);
//         fetchGroup(res.data.email);
//       } catch (err) {
//         console.error("Error fetching user", err);
//       }
//     };
//     fetchUser();
//   }, []);

//   const fetchGroup = async (email) => {
//     try {
//       const res = await axios.get(`http://localhost:5000/user-group/${email}`);
//       setGroupId(res.data.groupId);
//       socket.emit("joinGroup", res.data.groupId);
//       fetchMessages(res.data.groupId);
//     } catch (err) {
//       console.error("Error fetching group", err);
//     }
//   };

//   const fetchMessages = async (groupId) => {
//     try {
//       const res = await axios.get(`http://localhost:5000/chat/${groupId}`);
//       setMessages(res.data);
//     } catch (err) {
//       console.error("Error fetching messages", err);
//     }
//   };

//   useEffect(() => {
//     socket.on("message", (message) => {
//       setMessages((prev) => [...prev, message]);
//     });
//     return () => socket.off("message");
//   }, []);

//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;
//     socket.emit("sendMessage", { groupId, sender: user.username, message: newMessage });
//     setNewMessage("");
//   };

//   const uploadFile = async (e) => {
//     e.preventDefault();
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("group", groupId);
//     formData.append("sender", user.username);

//     try {
//       const res = await axios.post("http://localhost:5000/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       socket.emit("sendMessage", { groupId, sender: user.username, message: res.data.fileUrl });
//       setFile(null);
//     } catch (err) {
//       console.error("Error uploading file", err);
//     }
//   };

//   return (
//     <div className="p-4 max-w-lg mx-auto">
//       <h2 className="text-xl font-bold">Chat Room</h2>
//       <div className="border rounded p-2 h-80 overflow-y-auto">
//         {messages.map((msg, i) => (
//           <div key={i} className="p-2 border-b">
//             <strong>{msg.sender}:</strong> {msg.message.startsWith("http") ? (
//               <a href={msg.message} className="text-blue-500" target="_blank" rel="noopener noreferrer">View File</a>
//             ) : (
//               msg.message
//             )}
//           </div>
//         ))}
//       </div>
//       <div className="mt-2 flex gap-2">
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           className="border p-2 flex-1 rounded"
//         />
//         <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">Send</button>
//       </div>
//       <form onSubmit={uploadFile} className="mt-2 flex gap-2">
//         <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border p-2 flex-1 rounded" />
//         <button type="submit" className="bg-green-500 text-white p-2 rounded">Upload</button>
//       </form>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });

export default function Chatpage({ userEmail }) {
  const [groupId, setGroupId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchGroupId() {
      const email = userEmail || localStorage.getItem("userEmail"); // Fetch from local storage if not provided
      if (!email) {
        setError("User email is missing. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/user-group/${email}`);
        setGroupId(response.data.groupId);
        socket.emit("joinGroup", response.data.groupId);
      } catch (err) {
        console.error("Error fetching group ID:", err);
        setError("Failed to fetch group ID.");
      } finally {
        setLoading(false);
      }
    }
    fetchGroupId();
  }, [userEmail]);

  useEffect(() => {
    if (!groupId) return;
    async function fetchMessages() {
      try {
        const response = await axios.get(`http://localhost:5000/chat/${groupId}`);
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to fetch messages.");
      }
    }
    fetchMessages();
  }, [groupId]);

  useEffect(() => {
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => socket.off("message");
  }, []);

  async function sendMessage() {
    const email = userEmail || localStorage.getItem("userEmail");
    if (!message.trim() || !groupId || !email) return;
    
    const newMessage = { groupId, sender: email, message };
    socket.emit("sendMessage", newMessage);
    setMessage("");
  }

  async function handleFileUpload(e) {
    e.preventDefault();
    const email = userEmail || localStorage.getItem("userEmail");
    if (!file || !groupId || !email) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("group", groupId);
    formData.append("sender", email);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      socket.emit("sendMessage", { groupId, sender: email, message: response.data.fileUrl });
      setFile(null);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("File upload failed.");
    }
  }

  if (loading) return <p>Loading chat...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto p-4 border rounded-lg shadow-lg bg-white">
      <div className="h-96 overflow-y-auto p-2 border-b">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender}:</strong>{" "}
            {msg.message.startsWith("http") ? (
              <a href={msg.message} target="_blank" rel="noopener noreferrer" className="text-blue-500">File</a>
            ) : (
              msg.message
            )}
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded">Send</button>
      </div>
      <form onSubmit={handleFileUpload} className="mt-2">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border p-2 w-full" />
        <button type="submit" className="mt-2 w-full p-2 bg-green-500 text-white rounded">Upload File</button>
      </form>
    </div>
  );
}
