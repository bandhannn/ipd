// import React, { useState } from 'react';
// import { 
//   Grid, 
//   Typography, 
//   Card, 
//   CardContent, 
//   Avatar, 
//   LinearProgress, 
//   Box,
//   Paper,
//   Button
// } from '@mui/material';
// import { 
//   School, 
//   Group, 
//   AssignmentTurnedIn, 
//   Timeline, 
//   Notifications 
// } from '@mui/icons-material';

// const mockStudyGroups = [
//   { 
//     id: 1, 
//     subject: 'Machine Learning', 
//     members: 4, 
//     progress: 65,
//     nextMeeting: 'Tomorrow, 4 PM'
//   },
//   { 
//     id: 2, 
//     subject: 'Data Structures', 
//     members: 3, 
//     progress: 45,
//     nextMeeting: 'Friday, 7 PM'
//   }
// ];

// const Dashboard = () => {
//   const [groups, setGroups] = useState(mockStudyGroups);

//   return (
//     <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#f4f6f8' }}>
//       <Grid container spacing={3}>
//         {/* Profile Summary */}
//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Avatar 
//                 sx={{ 
//                   width: 100, 
//                   height: 100, 
//                   margin: 'auto', 
//                   mb: 2 
//                 }}
//                 src="/path-to-user-avatar.jpg"
//               />
//               <Typography variant="h6">John Doe</Typography>
//               <Typography variant="subtitle1" color="text.secondary">
//                 Computer Science Student
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Academic Stats */}
//         <Grid item xs={12} md={8}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Academic Progress
//               </Typography>
//               <Grid container spacing={2}>
//                 <Grid item xs={4}>
//                   <Box display="flex" alignItems="center">
//                     <School sx={{ mr: 1, color: 'primary.main' }} />
//                     <Typography>GPA: 3.7</Typography>
//                   </Box>
//                 </Grid>
//                 <Grid item xs={4}>
//                   <Box display="flex" alignItems="center">
//                     <AssignmentTurnedIn sx={{ mr: 1, color: 'success.main' }} />
//                     <Typography>Completed: 12/15 Courses</Typography>
//                   </Box>
//                 </Grid>
//                 <Grid item xs={4}>
//                   <Box display="flex" alignItems="center">
//                     <Timeline sx={{ mr: 1, color: 'warning.main' }} />
//                     <Typography>Semester: Fall 2024</Typography>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Study Groups */}
//         <Grid item xs={12}>
//           <Card>
//             <CardContent>
//               <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                 <Typography variant="h6">Active Study Groups</Typography>
//                 <Button variant="outlined">Find New Groups</Button>
//               </Box>
//               {groups.map((group) => (
//                 <Paper 
//                   key={group.id} 
//                   elevation={1} 
//                   sx={{ 
//                     p: 2, 
//                     mb: 2, 
//                     display: 'flex', 
//                     alignItems: 'center' 
//                   }}
//                 >
//                   <Box flex={1}>
//                     <Typography variant="subtitle1">{group.subject}</Typography>
//                     <Box display="flex" alignItems="center">
//                       <Group sx={{ mr: 1, fontSize: 20 }} />
//                       <Typography variant="body2">
//                         {group.members} Members
//                       </Typography>
//                     </Box>
//                   </Box>
//                   <Box flex={1}>
//                     <Typography variant="body2">
//                       Next Meeting: {group.nextMeeting}
//                     </Typography>
//                     <LinearProgress 
//                       variant="determinate" 
//                       value={group.progress} 
//                       sx={{ mt: 1 }}
//                     />
//                   </Box>
//                 </Paper>
//               ))}
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Notifications */}
//         <Grid item xs={12}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center" mb={2}>
//                 <Notifications sx={{ mr: 1 }} />
//                 <Typography variant="h6">Notifications</Typography>
//               </Box>
//               <Paper variant="outlined" sx={{ p: 2 }}>
//                 <Typography variant="body2">
//                   - New study group invitation for Machine Learning
//                   - Assignment deadline approaching: Data Structures
//                   - Upcoming campus event: Tech Workshop
//                 </Typography>
//               </Paper>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
// import jwt_decode from "jwt-decode";



const socket = io('http://localhost:5000'); // Backend WebSocket server

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Or sessionStorage, depending on where you store it
    const decodeJWT = (token) => {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          return JSON.parse(atob(base64));
        } catch (e) {
          console.error("Invalid token", e);
          return null;
        }
      };
    if (token) {
        const decodedToken = decodeJWT(token);
        const email = decodedToken.email;
        console.log(email);
    } else {
        console.log("No token found");
    }
    useEffect(() => {
        // Fetch user details with JWT token in the Authorization header
        const token = localStorage.getItem("token");

        // Fetch user details
        if (token) {
          axios.get('http://localhost:5000/user-info', {
              headers: { Authorization: `Bearer ${token}` }
          })
          .then(res => setUser(res.data))
          .catch(err => console.error('Error fetching user:', err));
      } else {
          console.log('No token found');
      }
        
        // Fetch study groups
        axios.get('http://localhost:5000/groups/${email}', { withCredentials: true })
            .then(res => setGroups(res.data))
            .catch(err => console.error('Error fetching groups:', err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
            <p className="text-gray-600">Domain: {user?.primary_domain} | Rating: {user?.rating}</p>
            
            <h2 className="text-2xl mt-4 font-semibold">Your Study Groups</h2>
            <ul className="bg-white p-4 shadow rounded-lg">
                {groups.map(group => (
                    <li key={group.id} className="p-2 border-b">
                        <button onClick={() => navigate(`/groups/${group.id}`)} className="text-blue-500">{group.name}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;