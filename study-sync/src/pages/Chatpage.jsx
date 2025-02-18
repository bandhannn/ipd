// import { useEffect, useState } from "react";
// import io from "socket.io-client";
// import axios from "axios";
// import { Avatar, Box, Button, Card, CardContent, CardHeader, Divider, IconButton, Input, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography } from "@mui/material";
// import { Send, AttachFile } from "@mui/icons-material";

// const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });

// export default function ChatPage({ userEmail }) {
//   const [groupId, setGroupId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [file, setFile] = useState(null);
//   const [groupMembers, setGroupMembers] = useState([]);

//   useEffect(() => {
//     async function fetchGroupId() {
//       const email = userEmail || localStorage.getItem("userEmail");
//       if (!email) return;
//       try {
//         const response = await axios.get(`http://localhost:5000/user-group/${email}`);
//         setGroupId(response.data.groupId);
//         socket.emit("joinGroup", response.data.groupId);
//         fetchGroupMembers(response.data.groupId);
//       } catch (err) {
//         console.error("Error fetching group ID:", err);
//       }
//     }
//     fetchGroupId();
//   }, [userEmail]);

//   useEffect(() => {
//     if (!groupId) return;
//     async function fetchMessages() {
//       try {
//         const response = await axios.get(`http://localhost:5000/chat/${groupId}`);
//         setMessages(response.data);
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       }
//     }
//     fetchMessages();
//   }, [groupId]);

//   useEffect(() => {
//     socket.on("message", (newMessage) => {
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//     });
//     return () => {
//       socket.off("message");
//     };
//   }, []);

//   async function fetchGroupMembers(groupId) {
//     try {
//       const response = await axios.get(`http://localhost:5000/group-members/${groupId}`);
//       setGroupMembers(response.data);
//     } catch (err) {
//       console.error("Error fetching group members:", err);
//     }
//   }

//   async function sendMessage() {
//     if (!message.trim() || !groupId) return;
//     const email = userEmail || localStorage.getItem("userEmail");
//     socket.emit("sendMessage", { groupId, sender: email, message });
//     setMessage("");
//   }

//   async function handleFileUpload(e) {
//     e.preventDefault();
//     if (!file || !groupId) return;
//     const email = userEmail || localStorage.getItem("userEmail");
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("group", groupId);
//     formData.append("sender", email);

//     try {
//       const response = await axios.post("http://localhost:5000/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       socket.emit("sendMessage", { groupId, sender: email, message: response.data.fileUrl });
//       setFile(null);
//     } catch (err) {
//       console.error("Error uploading file:", err);
//     }
//   }

//   return (
//     <Box display="flex" height="100vh" width="100vw" p={2} gap={2} sx={{ overflow: "hidden" }}>
//       {/* Chat Section */}
//       <Card sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: "90vh" }}>
//         <CardHeader title="Chat" />
//         <CardContent sx={{ flexGrow: 1, overflowY: "auto", maxHeight: "80vh", p: 2 }}>
//           {messages.map((msg, index) => (
//             <Box
//               key={index}
//               display="flex"
//               alignItems="center"
//               justifyContent={msg.sender === userEmail ? "flex-end" : "flex-start"}
//               mb={2}
//             >
//               {msg.sender !== userEmail && <Avatar sx={{ bgcolor: "#f44336", mr: 1 }}>{msg.sender[0].toUpperCase()}</Avatar>}
//               <Paper
//                 elevation={2}
//                 sx={{
//                   p: 1.5,
//                   borderRadius: "15px",
//                   bgcolor: msg.sender === userEmail ? "#1976d2" : "#f1f1f1",
//                   color: msg.sender === userEmail ? "white" : "black",
//                   maxWidth: "60%",
//                 }}
//               >
//                 <Typography variant="body2">
//                   {msg.message.startsWith("http") ? (
//                     <a href={msg.message} target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>
//                       📎 View File
//                     </a>
//                   ) : (
//                     msg.message
//                   )}
//                 </Typography>
//               </Paper>
//               {msg.sender === userEmail && <Avatar sx={{ bgcolor: "#1976d2", ml: 1 }}>{msg.sender[0].toUpperCase()}</Avatar>}
//             </Box>
//           ))}
//         </CardContent>
//         <Divider />
//         <Box display="flex" p={2}>
//           <TextField
//             fullWidth
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//             placeholder="Type a message..."
//           />
//           <IconButton onClick={sendMessage} sx={{ ml: 1 }}>
//             <Send />
//           </IconButton>
//         </Box>
//         <Box display="flex" alignItems="center" p={2}>
//           <Input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
//           <IconButton onClick={handleFileUpload} sx={{ ml: 1 }}>
//             <AttachFile />
//           </IconButton>
//         </Box>
//       </Card>

//       {/* Group Members */}
//       <Card sx={{ width: "300px", minHeight: "90vh" }}>
//         <CardHeader title="Group Members" />
//         <CardContent sx={{ overflowY: "auto", maxHeight: "80vh" }}>
//           <List>
//             {groupMembers.map((member, index) => (
//               <Box key={index}>
//                 <ListItem>
//                   <ListItemAvatar>
//                     <Avatar sx={{ bgcolor: index % 2 === 0 ? "#f44336" : "#673ab7" }}>
//                       {member.username[0].toUpperCase()}
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText primary={member.username} secondary={member.email} />
//                 </ListItem>
//                 <Divider />
//               </Box>
//             ))}
//           </List>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";  // Added for navigation
import io from "socket.io-client";
import axios from "axios";
import { 
  Avatar, Box, Button, Card, CardContent, CardHeader, Divider, IconButton, 
  Input, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography 
} from "@mui/material";
import { Send, AttachFile, ArrowBack } from "@mui/icons-material";  // Added ArrowBack icon

const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });

export default function ChatPage({ userEmail }) {
  const [groupId, setGroupId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const navigate = useNavigate();  // Navigation hook

  useEffect(() => {
    async function fetchGroupId() {
      const email = userEmail || localStorage.getItem("userEmail");
      if (!email) return;
      try {
        const response = await axios.get(`http://localhost:5000/user-group/${email}`);
        setGroupId(response.data.groupId);
        socket.emit("joinGroup", response.data.groupId);
        fetchGroupMembers(response.data.groupId);
      } catch (err) {
        console.error("Error fetching group ID:", err);
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
      }
    }
    fetchMessages();
  }, [groupId]);

  useEffect(() => {
    socket.on("message", (newMessage) => {
        console.log("Received message:", newMessage);  // Debugging
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => {
        socket.off("message");
    };
}, []);

// useEffect(() => {
//   socket.on("message", (newMessage) => {
//       setMessages((prevMessages) => {
//           const existing = prevMessages.find((msg) => msg.id === newMessage.id);
//           if (existing) {
//               return prevMessages.map((msg) =>
//                   msg.id === newMessage.id ? { ...msg, summary: newMessage.summary } : msg
//               );
//           }
//           return [...prevMessages, newMessage];
//       });
//   });

//   return () => {
//       socket.off("message");
//   };
// }, []);


  async function fetchGroupMembers(groupId) {
    try {
      const response = await axios.get(`http://localhost:5000/group-members/${groupId}`);
      setGroupMembers(response.data);
    } catch (err) {
      console.error("Error fetching group members:", err);
    }
  }

  async function sendMessage() {
    if (!message.trim() || !groupId) return;
    const email = userEmail || localStorage.getItem("userEmail");
    socket.emit("sendMessage", { groupId, sender: email, message });
    setMessage("");
  }

  async function handleFileUpload(e) {
    e.preventDefault();
    if (!file || !groupId) return;
    const email = userEmail || localStorage.getItem("userEmail");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("group", groupId);
    formData.append("sender", email);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      socket.emit("sendMessage", { groupId, sender: email, message: response.data.fileUrl ,summary: response.data.summary});
      setFile(null);
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  }

  return (
    <Box display="flex" height="100vh" width="100vw" p={2} gap={2} sx={{ overflow: "hidden" }}>
      
      {/* Back to Dashboard Button */}
      <Box position="absolute" top={16} right={20}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate("/dashboard")}
          startIcon={<ArrowBack />}
          sx={{
            fontWeight: "bold",
            borderRadius: "20px",
            boxShadow: 2,
            textTransform: "none"
          }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Chat Section */}
      <Card sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: "90vh" }}>
        <CardHeader title="Chat" />
        <CardContent sx={{ flexGrow: 1, overflowY: "auto", maxHeight: "80vh", p: 2 }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent={msg.sender === userEmail ? "flex-end" : "flex-start"}
              mb={2}
            >
              {msg.sender !== userEmail && <Avatar sx={{ bgcolor: "#f44336", mr: 1 }}>{msg.sender[0].toUpperCase()}</Avatar>}
              <Paper
                elevation={2}
                sx={{
                  p: 1.5,
                  borderRadius: "15px",
                  bgcolor: msg.sender === userEmail ? "#1976d2" : "#f1f1f1",
                  color: msg.sender === userEmail ? "white" : "black",
                  maxWidth: "60%",
                }}
              >
                <Typography variant="body2">
                    {msg.message.startsWith("http") ? (
                        <>
                          <a href={msg.message} target="_blank" rel="noopener noreferrer" style={{ color: "black" }}>
                            📎 View File
                          </a>
                        </>
                      ) : (
                        <Typography variant="body2">{msg.message}</Typography>
                      )}
                  </Typography>
                 {msg.summary && (
                <Typography variant="caption" display="block" sx={{ mt: 1, color: "black" }}>
                  <strong>Summary:</strong> {msg.summary}
                </Typography>
              )}

              </Paper>
              {msg.sender === userEmail && <Avatar sx={{ bgcolor: "#1976d2", ml: 1 }}>{msg.sender[0].toUpperCase()}</Avatar>}
            </Box>
             ))}
        </CardContent>
        <Divider />
        <Box display="flex" p={2}>
          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <IconButton onClick={sendMessage} sx={{ ml: 1 }}>
            <Send />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" p={2}>
          <Input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
          <IconButton onClick={handleFileUpload} sx={{ ml: 1 }}>
            <AttachFile />
          </IconButton>
        </Box>
      </Card>

      {/* Group Members */}
      <Card sx={{ width: "300px", minHeight: "90vh" }}>
        <CardHeader title="Group Members" />
        <CardContent sx={{ overflowY: "auto", maxHeight: "80vh" }}>
          <List>
            {groupMembers.map((member, index) => (
              <Box key={index}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: index % 2 === 0 ? "#f44336" : "#673ab7" }}>
                      {member.username[0].toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={member.username} secondary={member.email} />
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import io from "socket.io-client";
// import axios from "axios";
// import {
//   Avatar, Box, Button, Card, CardContent, CardHeader, Divider, IconButton,
//   Input, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography
// } from "@mui/material";
// import { Send, AttachFile, ArrowBack } from "@mui/icons-material";

// const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });

// export default function ChatPage({ userEmail }) {
//   const [groupId, setGroupId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [file, setFile] = useState(null);
//   const [groupMembers, setGroupMembers] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchGroupId() {
//       const email = userEmail || localStorage.getItem("userEmail");
//       if (!email) return;
//       try {
//         const response = await axios.get(`http://localhost:5000/user-group/${email}`);
//         setGroupId(response.data.groupId);
//         socket.emit("joinGroup", response.data.groupId);
//         fetchGroupMembers(response.data.groupId);
//       } catch (err) {
//         console.error("Error fetching group ID:", err);
//       }
//     }
//     fetchGroupId();
//   }, [userEmail]);

//   useEffect(() => {
//     if (!groupId) return;
//     async function fetchMessages() {
//       try {
//         const response = await axios.get(`http://localhost:5000/chat/${groupId}`);
//         setMessages(response.data);
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       }
//     }
//     fetchMessages();
//   }, [groupId]);

//   useEffect(() => {
//     socket.on("message", (newMessage) => {
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//     });
//     return () => {
//       socket.off("message");
//     };
//   }, []);

//   async function fetchGroupMembers(groupId) {
//     try {
//       const response = await axios.get(`http://localhost:5000/group-members/${groupId}`);
//       setGroupMembers(response.data);
//     } catch (err) {
//       console.error("Error fetching group members:", err);
//     }
//   }

//   async function sendMessage() {
//     if (!message.trim() || !groupId) return;
//     const email = userEmail || localStorage.getItem("userEmail");
//     socket.emit("sendMessage", { groupId, sender: email, message });
//     setMessage("");
//   }

//   async function handleFileUpload(e) {
//     e.preventDefault();
//     if (!file || !groupId) return;
//     const email = userEmail || localStorage.getItem("userEmail");
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("group", groupId);
//     formData.append("sender", email);

//     try {
//       const response = await axios.post("http://localhost:5000/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       socket.emit("sendMessage", { 
//         groupId, 
//         sender: email, 
//         message: response.data.fileUrl, 
//         summary: response.data.summary 
//       });

//       setFile(null);
//     } catch (err) {
//       console.error("Error uploading file:", err);
//     }
//   }

//   return (
//     <Box display="flex" height="100vh" width="100vw" p={2} gap={2} sx={{ overflow: "hidden" }}>

//       {/* Back to Dashboard Button */}
//       <Box position="absolute" top={16} right={20}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => navigate("/dashboard")}
//           startIcon={<ArrowBack />}
//           sx={{
//             fontWeight: "bold",
//             borderRadius: "20px",
//             boxShadow: 2,
//             textTransform: "none"
//           }}
//         >
//           Back to Dashboard
//         </Button>
//       </Box>

//       {/* Chat Section */}
//       <Card sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: "90vh" }}>
//         <CardHeader title="Chat" />
//         <CardContent sx={{ flexGrow: 1, overflowY: "auto", maxHeight: "80vh", p: 2 }}>
//           {messages.map((msg, index) => (
//             <Box
//               key={index}
//               display="flex"
//               alignItems="center"
//               justifyContent={msg.sender === userEmail ? "flex-end" : "flex-start"}
//               mb={2}
//             >
//               {msg.sender !== userEmail && <Avatar sx={{ bgcolor: "#f44336", mr: 1 }}>{msg.sender[0].toUpperCase()}</Avatar>}
//               <Paper
//                 elevation={2}
//                 sx={{
//                   p: 1.5,
//                   borderRadius: "15px",
//                   bgcolor: msg.sender === userEmail ? "#1976d2" : "#f1f1f1",
//                   color: msg.sender === userEmail ? "white" : "black",
//                   maxWidth: "60%",
//                 }}
//               >
//                 <Typography variant="body2">
//                   {msg.message.startsWith("http") ? (
//                     <>
//                       <a href={msg.message} target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>
//                         📎 View File
//                       </a>
//                       {msg.summary && (
//                         <Typography variant="caption" display="block" sx={{ mt: 1, color: "#888" }}>
//                           <strong>Summary:</strong> {msg.summary}
//                         </Typography>
//                       )}
//                     </>
//                   ) : (
//                     msg.message
//                   )}
//                 </Typography>
//               </Paper>
//               {msg.sender === userEmail && <Avatar sx={{ bgcolor: "#1976d2", ml: 1 }}>{msg.sender[0].toUpperCase()}</Avatar>}
//             </Box>
//           ))}
//         </CardContent>
//         <Divider />
//         <Box display="flex" p={2}>
//           <TextField
//             fullWidth
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//             placeholder="Type a message..."
//           />
//           <IconButton onClick={sendMessage} sx={{ ml: 1 }}>
//             <Send />
//           </IconButton>
//         </Box>
//         <Box display="flex" alignItems="center" p={2}>
//           <Input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
//           <IconButton onClick={handleFileUpload} sx={{ ml: 1 }}>
//             <AttachFile />
//           </IconButton>
//         </Box>
//       </Card>

//       {/* Group Members */}
//       <Card sx={{ width: "300px", minHeight: "90vh" }}>
//         <CardHeader title="Group Members" />
//         <CardContent sx={{ overflowY: "auto", maxHeight: "80vh" }}>
//           <List>
//             {groupMembers.map((member, index) => (
//               <Box key={index}>
//                 <ListItem>
//                   <ListItemAvatar>
//                     <Avatar sx={{ bgcolor: index % 2 === 0 ? "#f44336" : "#673ab7" }}>
//                       {member.username[0].toUpperCase()}
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText primary={member.username} secondary={member.email} />
//                 </ListItem>
//                 <Divider />
//               </Box>
//             ))}
//           </List>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import io from "socket.io-client";
// import axios from "axios";
// import {
//   Avatar, Box, Button, Card, CardContent, CardHeader, Divider, IconButton,
//   Input, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography
// } from "@mui/material";
// import { Send, AttachFile, ArrowBack } from "@mui/icons-material";

// const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });

// export default function ChatPage({ userEmail }) {
//   const [groupId, setGroupId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [file, setFile] = useState(null);
//   const [groupMembers, setGroupMembers] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchGroupId() {
//       const email = userEmail || localStorage.getItem("userEmail");
//       if (!email) return;
//       try {
//         const response = await axios.get(`http://localhost:5000/user-group/${email}`);
//         setGroupId(response.data.groupId);
//         socket.emit("joinGroup", response.data.groupId);
//         fetchGroupMembers(response.data.groupId);
//       } catch (err) {
//         console.error("Error fetching group ID:", err);
//       }
//     }
//     fetchGroupId();
//   }, [userEmail]);

//   useEffect(() => {
//     if (!groupId) return;
//     async function fetchMessages() {
//       try {
//         const response = await axios.get(`http://localhost:5000/chat/${groupId}`);
//         setMessages(response.data);
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       }
//     }
//     fetchMessages();
//   }, [groupId]);

//   useEffect(() => {
//     socket.on("message", (newMessage) => {
//       console.log("Received message:", newMessage);
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//     });
//     return () => {
//       socket.off("message");
//     };
//   }, []);

//   async function fetchGroupMembers(groupId) {
//     try {
//       const response = await axios.get(`http://localhost:5000/group-members/${groupId}`);
//       setGroupMembers(response.data);
//     } catch (err) {
//       console.error("Error fetching group members:", err);
//     }
//   }

//   async function sendMessage() {
//     if (!message.trim() || !groupId) return;
//     const email = userEmail || localStorage.getItem("userEmail");
//     socket.emit("sendMessage", { groupId, sender: email, message });
//     setMessage("");
//   }

//   async function handleFileUpload(e) {
//     e.preventDefault();
//     if (!file || !groupId) return;
//     const email = userEmail || localStorage.getItem("userEmail");
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("group", groupId);
//     formData.append("sender", email);

//     try {
//       const response = await axios.post("http://localhost:5000/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const newMessage = { groupId, sender: email, message: response.data.fileUrl, summary: response.data.summary };
//       socket.emit("sendMessage", newMessage);
//       setFile(null);
//     } catch (err) {
//       console.error("Error uploading file:", err);
//     }
//   }

//   return (
//     <Box display="flex" height="100vh" width="100vw" p={2} gap={2} sx={{ overflow: "hidden" }}>
//       <Box position="absolute" top={16} right={20}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => navigate("/dashboard")}
//           startIcon={<ArrowBack />}
//           sx={{ fontWeight: "bold", borderRadius: "20px", boxShadow: 2, textTransform: "none" }}
//         >
//           Back to Dashboard
//         </Button>
//       </Box>
//       <Card sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: "90vh" }}>
//         <CardHeader title="Chat" />
//         <CardContent sx={{ flexGrow: 1, overflowY: "auto", maxHeight: "80vh", p: 2 }}>
//           {messages.map((msg, index) => (
//             <Box key={index} display="flex" alignItems="center" justifyContent={msg.sender === userEmail ? "flex-end" : "flex-start"} mb={2}>
//               {msg.sender !== userEmail && <Avatar sx={{ bgcolor: "#f44336", mr: 1 }}>{msg.sender[0].toUpperCase()}</Avatar>}
//               <Paper elevation={2} sx={{ p: 1.5, borderRadius: "15px", bgcolor: msg.sender === userEmail ? "#1976d2" : "#f1f1f1", color: msg.sender === userEmail ? "white" : "black", maxWidth: "60%" }}>
//                 {msg.message.startsWith("http") ? (
//                   <a href={msg.message} target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>📎 View File</a>
//                 ) : (
//                   <Typography variant="body2">{msg.message}</Typography>
//                 )}
//                 {msg.summary && (
//                   <Typography variant="caption" display="block" sx={{ mt: 1, color: "#888" }}>
//                     <strong>Summary:</strong> {msg.summary}
//                   </Typography>
//                 )}
//               </Paper>
//               {msg.sender === userEmail && <Avatar sx={{ bgcolor: "#1976d2", ml: 1 }}>{msg.sender[0].toUpperCase()}</Avatar>}
//             </Box>
//           ))}
//         </CardContent>
//         <Divider />
//         <Box display="flex" p={2}>
//           <TextField fullWidth value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => e.key === "Enter" && sendMessage()} placeholder="Type a message..." />
//           <IconButton onClick={sendMessage} sx={{ ml: 1 }}><Send /></IconButton>
//         </Box>
//         <Box display="flex" alignItems="center" p={2}>
//           <Input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
//           <IconButton onClick={handleFileUpload} sx={{ ml: 1 }}><AttachFile /></IconButton>
//         </Box>
//       </Card>

//             {/* Group Members */}
//         <Card sx={{ width: "300px", minHeight: "90vh" }}>
//         <CardHeader title="Group Members" />
//         <CardContent sx={{ overflowY: "auto", maxHeight: "80vh" }}>
//           <List>
//             {groupMembers.map((member, index) => (
//               <Box key={index}>
//                 <ListItem>
//                   <ListItemAvatar>
//                     <Avatar sx={{ bgcolor: index % 2 === 0 ? "#f44336" : "#673ab7" }}>
//                       {member.username[0].toUpperCase()}
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText primary={member.username} secondary={member.email} />
//                 </ListItem>
//                 <Divider />
//               </Box>
//             ))}
//           </List>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import io from "socket.io-client";
// import axios from "axios";
// import {
//   Avatar, Box, Button, Card, CardContent, CardHeader, Divider, IconButton,
//   Input, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography
// } from "@mui/material";
// import { Send, AttachFile, ArrowBack } from "@mui/icons-material";

// const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });

// export default function ChatPage({ userEmail }) {
//   const [groupId, setGroupId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [file, setFile] = useState(null);
//   const [groupMembers, setGroupMembers] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchGroupId() {
//       const email = userEmail || localStorage.getItem("userEmail");
//       if (!email) return;
//       try {
//         const response = await axios.get(`http://localhost:5000/user-group/${email}`);
//         setGroupId(response.data.groupId);
//         socket.emit("joinGroup", response.data.groupId);
//         fetchGroupMembers(response.data.groupId);
//       } catch (err) {
//         console.error("Error fetching group ID:", err);
//       }
//     }
//     fetchGroupId();
//   }, [userEmail]);

//   useEffect(() => {
//     if (!groupId) return;
//     async function fetchMessages() {
//       try {
//         const response = await axios.get(`http://localhost:5000/chat/${groupId}`);
//         setMessages(response.data);
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       }
//     }
//     fetchMessages();
//   }, [groupId]);

//   useEffect(() => {
//     socket.on("message", (newMessage) => {
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//     });
    
//     socket.on("updateGroupMembers", (updatedMembers) => {
//       setGroupMembers(updatedMembers);
//     });
    
//     return () => {
//       socket.off("message");
//       socket.off("updateGroupMembers");
//     };
//   }, []);

//   async function fetchGroupMembers(groupId) {
//     try {
//       const response = await axios.get(`http://localhost:5000/group-members/${groupId}`);
//       setGroupMembers(response.data);
//     } catch (err) {
//       console.error("Error fetching group members:", err);
//     }
//   }

//   async function sendMessage() {
//     if (!message.trim() || !groupId) return;
//     const email = userEmail || localStorage.getItem("userEmail");
//     socket.emit("sendMessage", { groupId, sender: email, message });
//     setMessage("");
//   }

//   async function handleFileUpload(e) {
//     e.preventDefault();
//     if (!file || !groupId) return;
//     const email = userEmail || localStorage.getItem("userEmail");
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("group", groupId);
//     formData.append("sender", email);

//     try {
//       const response = await axios.post("http://localhost:5000/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
      
//       const newMessage = { groupId, sender: email, message: response.data.fileUrl, summary: response.data.summary };
//       socket.emit("sendMessage", newMessage);
//       setFile(null);
//     } catch (err) {
//       console.error("Error uploading file:", err);
//     }
//   }

//   return (
//     <Box display="flex" height="100vh" width="100vw" p={2} gap={2} sx={{ overflow: "hidden" }}>
//       <Box position="absolute" top={16} right={20}>
//         <Button variant="contained" color="primary" onClick={() => navigate("/dashboard")} startIcon={<ArrowBack />}>
//           Back to Dashboard
//         </Button>
//       </Box>
//       <Card sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: "90vh" }}>
//         <CardHeader title="Chat" />
//         <CardContent sx={{ flexGrow: 1, overflowY: "auto", maxHeight: "80vh" }}>
//           {messages.map((msg, index) => (
//             <Box key={index} display="flex" alignItems="center" justifyContent={msg.sender === userEmail ? "flex-end" : "flex-start"} mb={2}>
//               {msg.sender !== userEmail && <Avatar sx={{ bgcolor: "#f44336", mr: 1 }}>{msg.sender[0].toUpperCase()}</Avatar>}
//               <Paper sx={{ p: 1.5, borderRadius: "15px", bgcolor: msg.sender === userEmail ? "#1976d2" : "#f1f1f1", color: msg.sender === userEmail ? "white" : "black", maxWidth: "60%" }}>
//                 {msg.message.startsWith("http") ? (
//                   <a href={msg.message} target="_blank" rel="noopener noreferrer">📎 View File</a>
//                 ) : (
//                   <Typography>{msg.message}</Typography>
//                 )}
//                 {msg.summary && <Typography variant="caption" sx={{ mt: 1, color: "#888" }}><strong>Summary:</strong> {msg.summary}</Typography>}
//               </Paper>
//               {msg.sender === userEmail && <Avatar sx={{ bgcolor: "#1976d2", ml: 1 }}>{msg.sender[0].toUpperCase()}</Avatar>}
//             </Box>
//           ))}
//         </CardContent>
//         <Divider />
//         <Box display="flex" p={2}>
//           <TextField fullWidth value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => e.key === "Enter" && sendMessage()} placeholder="Type a message..." />
//           <IconButton onClick={sendMessage} sx={{ ml: 1 }}><Send /></IconButton>
//         </Box>
//         <Box display="flex" alignItems="center" p={2}>
//           <Input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
//           <IconButton onClick={handleFileUpload} sx={{ ml: 1 }}><AttachFile /></IconButton>
//         </Box>
//       </Card>
//       <Card sx={{ width: "300px", minHeight: "90vh" }}>
//         <CardHeader title="Group Members" />
//         <CardContent>
//           <List>
//             {groupMembers.map((member, index) => (
//               <ListItem key={index}><ListItemAvatar><Avatar>{member.username[0].toUpperCase()}</Avatar></ListItemAvatar><ListItemText primary={member.username} secondary={member.email} /></ListItem>))}
//           </List>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }








