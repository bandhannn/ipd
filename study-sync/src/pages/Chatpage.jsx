// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000'); 

// const Chatpage = ({ match }) => {
//   const { groupId } = match.params;
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');

//   useEffect(() => {
//       socket.emit('joinRoom', groupId);
//       socket.on('message', msg => setMessages(prev => [...prev, msg]));
//   }, [groupId]);

//   const sendMessage = () => {
//       if (input.trim()) {
//           socket.emit('chatMessage', { groupId, text: input });
//           setInput('');
//       }
//   };

//   return (
//       <div className="p-6 bg-gray-100 min-h-screen">
//           <h1 className="text-2xl font-bold">Chat Room</h1>
//           <div className="mt-4 p-4 bg-white shadow rounded-lg min-h-[400px]">
//               {messages.map((msg, index) => (
//                   <p key={index} className="p-2 bg-gray-200 my-2 rounded-lg">{msg.text}</p>
//               ))}
//           </div>
//           <input 
//               className="w-full p-2 border mt-4"
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               placeholder="Type a message..."
//           />
//           <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 mt-2">Send</button>
//       </div>
//   );
// };

// export default Chatpage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

// Connect to your backend's Socket.IO server
const socket = io('http://localhost:5000');

const Chatpage = () => {
  // Get the groupId from the URL params using useParams hook
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Join the chat room for the group
    socket.emit('joinRoom', groupId);

    // Listen for new messages
    socket.on('message', msg => setMessages(prev => [...prev, msg]));

    // Cleanup when the component unmounts or groupId changes
    return () => {
      socket.off('message');
    };
  }, [groupId]);

  const sendMessage = () => {
    if (input.trim()) {
      // Emit the message with the groupId and text
      socket.emit('chatMessage', { groupId, text: input });
      setInput(''); // Clear input field
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Chat Room</h1>
      <div className="mt-4 p-4 bg-white shadow rounded-lg min-h-[400px]">
        {messages.map((msg, index) => (
          <p key={index} className="p-2 bg-gray-200 my-2 rounded-lg">{msg.text}</p>
        ))}
      </div>
      <input
        className="w-full p-2 border mt-4"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 mt-2">Send</button>
    </div>
  );
};

export default Chatpage;
