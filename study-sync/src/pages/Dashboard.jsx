// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   Grid, 
//   Typography, 
//   Card, 
//   CardContent, 
//   Avatar, 
//   Box,
//   Paper,
//   Button
// } from '@mui/material';
// import { Group, Notifications, Star, ExitToApp } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [group, setGroup] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [userGroupId, setUserGroupId] = useState(null);
//   const [preferredTime, setpreferredTime] = useState(null);

//   const navigate = useNavigate();
//   const userEmail = localStorage.getItem('userEmail');  // Get user email

//   useEffect(() => {
//     if (!userEmail) {
//       console.error("User email not found!");
//       return;
//     }

//     // Fetch user data
//     axios.get(`http://localhost:5000/user-profile/${userEmail}`)
//       .then(response => {
//         setUser(response.data);
//         setUserGroupId(response.data.group_id);
//       })
//       .catch(error => console.error("Error fetching user data:", error));

//     setNotifications([
//       'Welcome! You have entered a group.',
//       'Your profile has been updated successfully.',
//       `Based on group availability, the best time for everyone to study together is Evening!`
//     ]);
//   }, [userEmail]);

//   useEffect(() => {
//     async function fetchPreferredStudyTime() {
//       const email = localStorage.getItem("userEmail");  // You can use a different way to get the user email
//       if (!email) return;

//       try {
//         const response = await axios.get(`http://localhost:5000/group-preferred-study-time/${email}`);
//         setpreferredTime(response.data.preferredStudyTime);  // Save it to the state variable
//       } catch (error) {
//         console.error("Error fetching preferred study time:", error);
//       }
//     }

//     fetchPreferredStudyTime();
//   }, []);

//   useEffect(() => {
//     if (userGroupId) {
//       axios.get(`http://localhost:5000/active-groups/${userGroupId}`)
//         .then(response => setGroup(response.data))
//         .catch(error => console.error("Error fetching group data:", error));
//     }
//   }, [userGroupId]);

//   const handleLogout = () => {
//     localStorage.removeItem('userEmail');  // Clear user data
//     navigate('/login');  // Redirect to login page
//   };

//   return (
//     <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#f4f6f8' }}>
//       <Grid container spacing={3}>

//         {/* Profile Summary */}
//         <Grid item xs={12} md={4}>
//           <Card onClick={() => navigate('/profile')} sx={{ cursor: 'pointer' }}>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Avatar 
//                 sx={{ width: 100, height: 100, margin: 'auto', mb: 2 }}
//                 src={user?.avatar || '/default-avatar.jpg'}
//               />
//               <Typography variant="h6">{user?.username || 'Loading...'}</Typography>
//               <Typography variant="subtitle1" color="text.secondary">
//                 {group?.primary_domain || 'User Domain'}
                
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Rating & Logout Section */}
//         <Grid item xs={12} md={8}>
//           <Box 
//             sx={{ 
//               display: 'flex', 
//               justifyContent: 'space-between', 
//               alignItems: 'center',
//               bgcolor: '#fff', 
//               p: 2, 
//               borderRadius: 2, 
//               boxShadow: 2,
//               mb: 2  // Add spacing below this section
//             }}
//           >
//             {/* Rating Display */}
//             <Box display="flex" alignItems="center">
//               <Star sx={{ color: '#fbc02d', fontSize: 30, mr: 1 }} />
//               <Typography variant="h6">
//                 Rating: {user?.rating || 'N/A'}
//               </Typography>
//             </Box>

//             {/* Logout Button */}
//             <Button 
//               variant="contained" 
//               color="error"
//               onClick={handleLogout}
//               startIcon={<ExitToApp />}
//               sx={{ fontWeight: 'bold' }}
//             >
//               Logout
//             </Button>
//           </Box>
          
//           {/* Quiz Section (Now Pulled Down) */}
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Quizzes
//               </Typography>
//               <Button variant="contained" color="primary" onClick={() => navigate('/quizzes')}>
//                 Take a Quiz
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Study Groups */}
//         <Grid item xs={12}>
//           <Card>
//             <CardContent>
//               <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                 <Typography variant="h6">Active Study Group</Typography>
                
//               </Box>
              
//               {group ? (
//                 <Paper 
//                   key={group.primary_domain} 
//                   elevation={1} 
//                   sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
//                   onClick={() => navigate(`/chat`)}
//                 >
//                   <Box flex={1}>
//                     <Typography variant="subtitle1">{group.primary_domain}</Typography>
//                     <Box display="flex" alignItems="center">
//                       <Group sx={{ mr: 1, fontSize: 20 }} />
//                       <Typography variant="body2">{group.member_count} Members</Typography>
//                     </Box>
//                   </Box>
//                 </Paper>
//               ) : (
//                 <Typography>No active group found.</Typography>
//               )}
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
//               {notifications.length > 0 ? (
//                 notifications.map((note, index) => (
//                   <Paper key={index} variant="outlined" sx={{ p: 2, mb: 1 }}>
//                     <Typography variant="body2">{note}</Typography>
//                   </Paper>
//                 ))
//               ) : (
//                 <Typography>No new notifications.</Typography>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>

//       </Grid>
//     </Box>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Grid,
//   Typography,
//   Card,
//   CardContent,
//   Avatar,
//   Box,
//   Paper,
//   Button,
//   Chip,
//   Stack,
//   Divider,
//   Tooltip,
//   Badge,
// } from '@mui/material';
// import {
//   Group,
//   Notifications,
//   Star,
//   ExitToApp,
//   Quiz,
//   AccessTime,
//   ChevronRight,
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [group, setGroup] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [userGroupId, setUserGroupId] = useState(null);
//   const [preferredTime, setpreferredTime] = useState(null);

//   const navigate = useNavigate();
//   const userEmail = localStorage.getItem('userEmail');

//   useEffect(() => {
//     if (!userEmail) return;

//     axios
//       .get(`http://localhost:5000/user-profile/${userEmail}`)
//       .then((response) => {
//         setUser(response.data);
//         setUserGroupId(response.data.group_id);
//       })
//       .catch((error) => console.error('Error fetching user data:', error));

//     setNotifications([
//       'Welcome! You have entered a group.',
//       'Your profile has been updated successfully.',
//       `Based on group availability, the best time for everyone to study together is Evening!`,
//     ]);
//   }, [userEmail]);

//   useEffect(() => {
//     async function fetchPreferredStudyTime() {
//       const email = localStorage.getItem('userEmail');
//       if (!email) return;

//       try {
//         const response = await axios.get(
//           `http://localhost:5000/group-preferred-study-time/${email}`
//         );
//         setpreferredTime(response.data.preferredStudyTime);
//       } catch (error) {
//         console.error('Error fetching preferred study time:', error);
//       }
//     }

//     fetchPreferredStudyTime();
//   }, []);

//   useEffect(() => {
//     if (userGroupId) {
//       axios
//         .get(`http://localhost:5000/active-groups/${userGroupId}`)
//         .then((response) => setGroup(response.data))
//         .catch((error) => console.error('Error fetching group data:', error));
//     }
//   }, [userGroupId]);

//   const handleLogout = () => {
//     localStorage.removeItem('userEmail');
//     navigate('/login');
//   };

//   return (
//     <Box
//       sx={{
//         flexGrow: 1,
//         p: { xs: 1, md: 3 },
//         bgcolor: '#f4f6fb',
//         minHeight: '100vh',
//       }}
//     >
//       <Grid container spacing={3}>
//         {/* Profile + Quick Info */}
//         <Grid item xs={12} md={4}>
//           <Card
//             onClick={() => navigate('/profile')}
//             sx={{
//               cursor: 'pointer',
//               borderRadius: 4,
//               boxShadow: 3,
//               bgcolor: 'background.paper',
//               transition: 'box-shadow 0.2s',
//               '&:hover': { boxShadow: 6, borderColor: 'primary.main' },
//             }}
//           >
//             <CardContent sx={{ textAlign: 'center', pb: 2 }}>
//               <Badge
//                 overlap="circular"
//                 badgeContent={
//                   <Chip
//                     label={user?.role || 'Student'}
//                     color="primary"
//                     size="small"
//                     sx={{
//                       position: 'absolute',
//                       top: 8,
//                       right: 8,
//                       fontWeight: 600,
//                     }}
//                   />
//                 }
//                 anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//               >
//                 <Avatar
//                   sx={{
//                     width: 100,
//                     height: 100,
//                     margin: 'auto',
//                     mb: 2,
//                     boxShadow: 2,
//                   }}
//                   src={user?.avatar || '/default-avatar.jpg'}
//                 />
//               </Badge>
//               <Typography variant="h5" fontWeight="bold">
//                 {user?.username || 'Loading...'}
//               </Typography>
//               <Typography variant="subtitle1" color="text.secondary" gutterBottom>
//                 {group?.primary_domain || 'User Domain'}
//               </Typography>
//               <Divider sx={{ my: 2 }} />
//               <Stack
//                 direction="row"
//                 spacing={2}
//                 justifyContent="center"
//                 alignItems="center"
//               >
//                 <Tooltip title="Your group rating">
//                   <Chip
//                     icon={<Star sx={{ color: '#fbc02d' }} />}
//                     label={`Rating: ${user?.rating || 'N/A'}`}
//                     variant="outlined"
//                   />
//                 </Tooltip>
//                 <Tooltip title="Best group study time">
//                   <Chip
//                     icon={<AccessTime />}
//                     color="success"
//                     label={
//                       preferredTime
//                         ? `Best Time: ${preferredTime}`
//                         : 'Best Time: -'
//                     }
//                     variant="outlined"
//                   />
//                 </Tooltip>
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Main Actions */}
//         <Grid item xs={12} md={8}>
//           <Grid container spacing={2}>
//             {/* Welcome & Actions */}
//             <Grid item xs={12}>
//               <Paper
//                 elevation={3}
//                 sx={{
//                   p: 3,
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   borderRadius: 3,
//                   bgcolor: 'background.paper',
//                 }}
//               >
//                 <Box>
//                   <Typography variant="h6" fontWeight="bold">
//                     Welcome back, {user?.username || 'User'}!
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Here’s your dashboard overview.
//                   </Typography>
//                 </Box>
//                 <Button
//                   variant="contained"
//                   color="error"
//                   onClick={handleLogout}
//                   startIcon={<ExitToApp />}
//                   sx={{ fontWeight: 'bold', borderRadius: 2 }}
//                 >
//                   Logout
//                 </Button>
//               </Paper>
//             </Grid>

//             {/* Quizzes */}
//             <Grid item xs={12} md={6}>
//               <Card
//                 sx={{
//                   borderRadius: 3,
//                   bgcolor: '#e3f2fd',
//                   boxShadow: 2,
//                   height: '100%',
//                 }}
//               >
//                 <CardContent>
//                   <Box display="flex" alignItems="center" mb={1}>
//                     <Quiz color="primary" sx={{ mr: 1, fontSize: 30 }} />
//                     <Typography variant="h6" fontWeight="bold">
//                       Quizzes
//                     </Typography>
//                   </Box>
//                   <Typography variant="body2" color="text.secondary" mb={2}>
//                     Challenge yourself and track your progress.
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => navigate('/quizzes')}
//                     endIcon={<ChevronRight />}
//                     sx={{ borderRadius: 2, fontWeight: 600 }}
//                   >
//                     Take a Quiz
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Study Group */}
//             <Grid item xs={12} md={6}>
//               <Card
//                 sx={{
//                   borderRadius: 3,
//                   bgcolor: '#fffde7',
//                   boxShadow: 2,
//                   height: '100%',
//                 }}
//               >
//                 <CardContent>
//                   <Box display="flex" alignItems="center" mb={1}>
//                     <Group color="warning" sx={{ mr: 1, fontSize: 30 }} />
//                     <Typography variant="h6" fontWeight="bold">
//                       Active Study Group
//                     </Typography>
//                   </Box>
//                   {group ? (
//                     <Paper
//                       elevation={1}
//                       sx={{
//                         p: 2,
//                         mb: 1,
//                         display: 'flex',
//                         alignItems: 'center',
//                         cursor: 'pointer',
//                         borderRadius: 2,
//                         bgcolor: '#fffde7',
//                         transition: 'box-shadow 0.2s',
//                         '&:hover': { boxShadow: 4, bgcolor: '#fff9c4' },
//                       }}
//                       onClick={() => navigate(`/chat`)}
//                     >
//                       <Box flex={1}>
//                         <Typography variant="subtitle1" fontWeight={600}>
//                           {group.primary_domain}
//                         </Typography>
//                         <Box display="flex" alignItems="center" mt={0.5}>
//                           <Group sx={{ mr: 1, fontSize: 20 }} />
//                           <Typography variant="body2">
//                             {group.member_count} Members
//                           </Typography>
//                         </Box>
//                       </Box>
//                       <ChevronRight color="warning" />
//                     </Paper>
//                   ) : (
//                     <Typography color="text.secondary">
//                       No active group found.
//                     </Typography>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </Grid>

//         {/* Notifications */}
//         <Grid item xs={12}>
//           <Card
//             sx={{
//               borderRadius: 3,
//               boxShadow: 2,
//               bgcolor: 'background.paper',
//               mt: 2,
//             }}
//           >
//             <CardContent>
//               <Box display="flex" alignItems="center" mb={2}>
//                 <Notifications color="primary" sx={{ mr: 1 }} />
//                 <Typography variant="h6" fontWeight="bold">
//                   Notifications
//                 </Typography>
//               </Box>
//               <Divider sx={{ mb: 2 }} />
//               {notifications.length > 0 ? (
//                 <Stack spacing={1}>
//                   {notifications.map((note, index) => (
//                     <Paper
//                       key={index}
//                       variant="outlined"
//                       sx={{
//                         p: 2,
//                         bgcolor: '#f5faff',
//                         borderRadius: 2,
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 1,
//                       }}
//                     >
//                       <Notifications color="primary" sx={{ fontSize: 18 }} />
//                       <Typography variant="body2">{note}</Typography>
//                     </Paper>
//                   ))}
//                 </Stack>
//               ) : (
//                 <Typography>No new notifications.</Typography>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Dashboard;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Grid,
//   Typography,
//   Card,
//   CardContent,
//   Avatar,
//   Box,
//   Paper,
//   Button,
//   Chip,
//   Stack,
//   Divider,
//   Tooltip,
//   Badge,
//   IconButton,
//   Switch,
// } from '@mui/material';
// import {
//   Group,
//   Notifications,
//   Star,
//   ExitToApp,
//   Quiz,
//   AccessTime,
//   ChevronRight,
//   Brightness4,
//   Brightness7,
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [group, setGroup] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [userGroupId, setUserGroupId] = useState(null);
//   const [preferredTime, setpreferredTime] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);

//   const navigate = useNavigate();
//   const userEmail = localStorage.getItem('userEmail');

//   useEffect(() => {
//     if (!userEmail) return;

//     axios
//       .get(`http://localhost:5000/user-profile/${userEmail}`)
//       .then((response) => {
//         setUser(response.data);
//         setUserGroupId(response.data.group_id);
//       })
//       .catch((error) => console.error('Error fetching user data:', error));

//     setNotifications([
//       'Welcome! You have entered a group.',
//       'Your profile has been updated successfully.',
//       `Based on group availability, the best time for everyone to study together is Evening!`,
//     ]);
//   }, [userEmail]);

//   useEffect(() => {
//     async function fetchPreferredStudyTime() {
//       const email = localStorage.getItem('userEmail');
//       if (!email) return;

//       try {
//         const response = await axios.get(
//           `http://localhost:5000/group-preferred-study-time/${email}`
//         );
//         setpreferredTime(response.data.preferredStudyTime);
//       } catch (error) {
//         console.error('Error fetching preferred study time:', error);
//       }
//     }

//     fetchPreferredStudyTime();
//   }, []);

//   useEffect(() => {
//     if (userGroupId) {
//       axios
//         .get(`http://localhost:5000/active-groups/${userGroupId}`)
//         .then((response) => setGroup(response.data))
//         .catch((error) => console.error('Error fetching group data:', error));
//     }
//   }, [userGroupId]);

//   const handleLogout = () => {
//     localStorage.removeItem('userEmail');
//     navigate('/login');
//   };

//   // Dynamic styles for dark/light mode
//   const styles = {
//     background: {
//       background: darkMode ? '#181a20' : '#f4f6fb',
//       minHeight: '100vh',
//       transition: 'background 0.3s',
//       p: { xs: 1, md: 3 },
//     },
//     card: {
//       borderRadius: 4,
//       boxShadow: 3,
//       bgcolor: darkMode ? '#23272f' : '#fff',
//       color: darkMode ? '#fff' : '#222',
//       transition: 'background 0.3s, color 0.3s',
//     },
//     paper: {
//       bgcolor: darkMode ? '#23272f' : '#fff',
//       color: darkMode ? '#fff' : '#222',
//       borderRadius: 3,
//       boxShadow: 2,
//       transition: 'background 0.3s, color 0.3s',
//     },
//     sectionTitle: {
//       fontWeight: 'bold',
//       color: darkMode ? '#90caf9' : '#1976d2',
//       letterSpacing: 1,
//     },
//     chip: {
//       bgcolor: darkMode ? '#333' : '#e3f2fd',
//       color: darkMode ? '#90caf9' : '#1976d2',
//       fontWeight: 600,
//     },
//     gradientAvatar: {
//       background: darkMode
//         ? 'linear-gradient(135deg, #1976d2 40%, #ff4081 100%)'
//         : 'linear-gradient(135deg, #42a5f5 40%, #ffb300 100%)',
//       border: `4px solid ${darkMode ? '#333' : '#fff'}`,
//     },
//     quizCard: {
//       borderRadius: 3,
//       bgcolor: darkMode ? 'rgba(33,150,243,0.08)' : '#e3f2fd',
//       boxShadow: 2,
//       height: '100%',
//     },
//     groupCard: {
//       borderRadius: 3,
//       bgcolor: darkMode ? 'rgba(255,193,7,0.08)' : '#fffde7',
//       boxShadow: 2,
//       height: '100%',
//     },
//     notificationPaper: {
//       p: 2,
//       bgcolor: darkMode ? 'rgba(33,150,243,0.08)' : '#f5faff',
//       borderRadius: 2,
//       display: 'flex',
//       alignItems: 'center',
//       gap: 1,
//       color: darkMode ? '#fff' : '#222',
//     },
//   };

//   return (
//     <Box sx={styles.background} position="relative">
//       {/* Floating Dark/Light Mode Toggle */}
//       <Box
//         position="fixed"
//         top={24}
//         right={32}
//         zIndex={100}
//         display="flex"
//         alignItems="center"
//         bgcolor={darkMode ? '#23272f' : '#fff'}
//         borderRadius={2}
//         boxShadow={3}
//         px={1.5}
//         py={0.5}
//       >
//         <Brightness7 sx={{ color: darkMode ? 'grey.500' : '#1976d2' }} />
//         <Switch
//           checked={darkMode}
//           onChange={() => setDarkMode((prev) => !prev)}
//           color="primary"
//         />
//         <Brightness4 sx={{ color: darkMode ? '#1976d2' : 'grey.500' }} />
//       </Box>

//       <Grid container spacing={3}>
//         {/* Profile + Quick Info */}
//         <Grid item xs={12} md={4}>
//           <Card
//             onClick={() => navigate('/profile')}
//             sx={{
//               ...styles.card,
//               cursor: 'pointer',
//               position: 'relative',
//               overflow: 'visible',
//               mb: 2,
//             }}
//           >
//             <Box
//               sx={{
//                 position: 'absolute',
//                 top: -24,
//                 left: '50%',
//                 transform: 'translateX(-50%)',
//                 width: 120,
//                 height: 120,
//                 background: darkMode
//                   ? 'linear-gradient(135deg, #1976d2 40%, #ff4081 100%)'
//                   : 'linear-gradient(135deg, #42a5f5 40%, #ffb300 100%)',
//                 borderRadius: '50%',
//                 zIndex: 1,
//                 opacity: 0.13,
//                 filter: 'blur(8px)',
//               }}
//             />
//             <CardContent sx={{ textAlign: 'center', pb: 2, zIndex: 2, position: 'relative' }}>
//               <Badge
//                 overlap="circular"
//                 badgeContent={
//                   <Chip
//                     label={user?.role || 'Student'}
//                     color="primary"
//                     size="small"
//                     sx={{
//                       position: 'absolute',
//                       top: 8,
//                       right: 8,
//                       fontWeight: 600,
//                     }}
//                   />
//                 }
//                 anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//               >
//                 <Avatar
//                   sx={{
//                     width: 100,
//                     height: 100,
//                     margin: 'auto',
//                     mb: 2,
//                     boxShadow: 2,
//                     ...styles.gradientAvatar,
//                   }}
//                   src={user?.avatar || '/default-avatar.jpg'}
//                 />
//               </Badge>
//               <Typography variant="h5" fontWeight="bold">
//                 {user?.username || 'Loading...'}
//               </Typography>
//               <Typography variant="subtitle1" color="text.secondary" gutterBottom>
//                 {group?.primary_domain || 'User Domain'}
//               </Typography>
//               <Divider sx={{ my: 2 }} />
//               <Stack
//                 direction="row"
//                 spacing={2}
//                 justifyContent="center"
//                 alignItems="center"
//               >
//                 <Tooltip title="Your group rating">
//                   <Chip
//                     icon={<Star sx={{ color: '#fbc02d' }} />}
//                     label={`Rating: ${user?.rating || 'N/A'}`}
//                     variant="outlined"
//                     sx={styles.chip}
//                   />
//                 </Tooltip>
//                 <Tooltip title="Best group study time">
//                   <Chip
//                     icon={<AccessTime />}
//                     color="success"
//                     label={
//                       preferredTime
//                         ? `Best Time: ${preferredTime}`
//                         : 'Best Time: -'
//                     }
//                     variant="outlined"
//                     sx={styles.chip}
//                   />
//                 </Tooltip>
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Main Actions */}
//         <Grid item xs={12} md={8}>
//           <Grid container spacing={2}>
//             {/* Welcome & Actions */}
//             <Grid item xs={12}>
//               <Paper
//                 elevation={3}
//                 sx={{
//                   ...styles.paper,
//                   p: 3,
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   borderRadius: 3,
//                   background:
//                     darkMode
//                       ? 'linear-gradient(90deg, #232526 0%, #414345 100%)'
//                       : 'linear-gradient(90deg, #e3f2fd 0%, #fffde7 100%)',
//                 }}
//               >
//                 <Box>
//                   <Typography variant="h6" sx={styles.sectionTitle}>
//                     Welcome back, {user?.username || 'User'}!
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Here’s your dashboard overview.
//                   </Typography>
//                 </Box>
//                 <Button
//                   variant="contained"
//                   color="error"
//                   onClick={handleLogout}
//                   startIcon={<ExitToApp />}
//                   sx={{ fontWeight: 'bold', borderRadius: 2 }}
//                 >
//                   Logout
//                 </Button>
//               </Paper>
//             </Grid>

//             {/* Quizzes */}
//             <Grid item xs={12} md={6}>
//               <Card sx={styles.quizCard}>
//                 <CardContent>
//                   <Box display="flex" alignItems="center" mb={1}>
//                     <Quiz color="primary" sx={{ mr: 1, fontSize: 30 }} />
//                     <Typography variant="h6" sx={styles.sectionTitle}>
//                       Quizzes
//                     </Typography>
//                   </Box>
//                   <Typography variant="body2" color="text.secondary" mb={2}>
//                     Challenge yourself and track your progress.
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => navigate('/quizzes')}
//                     endIcon={<ChevronRight />}
//                     sx={{ borderRadius: 2, fontWeight: 600 }}
//                   >
//                     Take a Quiz
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Study Group */}
//             <Grid item xs={12} md={6}>
//               <Card sx={styles.groupCard}>
//                 <CardContent>
//                   <Box display="flex" alignItems="center" mb={1}>
//                     <Group color="warning" sx={{ mr: 1, fontSize: 30 }} />
//                     <Typography variant="h6" sx={styles.sectionTitle}>
//                       Active Study Group
//                     </Typography>
//                   </Box>
//                   {group ? (
//                     <Paper
//                       elevation={1}
//                       sx={{
//                         p: 2,
//                         mb: 1,
//                         display: 'flex',
//                         alignItems: 'center',
//                         cursor: 'pointer',
//                         borderRadius: 2,
//                         bgcolor: darkMode ? 'rgba(255,193,7,0.08)' : '#fffde7',
//                         transition: 'box-shadow 0.2s',
//                         '&:hover': { boxShadow: 4, bgcolor: darkMode ? 'rgba(255,193,7,0.16)' : '#fff9c4' },
//                       }}
//                       onClick={() => navigate(`/chat`)}
//                     >
//                       <Box flex={1}>
//                         <Typography variant="subtitle1" fontWeight={600}>
//                           {group.primary_domain}
//                         </Typography>
//                         <Box display="flex" alignItems="center" mt={0.5}>
//                           <Group sx={{ mr: 1, fontSize: 20 }} />
//                           <Typography variant="body2">
//                             {group.member_count} Members
//                           </Typography>
//                         </Box>
//                       </Box>
//                       <ChevronRight color="warning" />
//                     </Paper>
//                   ) : (
//                     <Typography color="text.secondary">
//                       No active group found.
//                     </Typography>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </Grid>

//         {/* Notifications */}
//         <Grid item xs={12}>
//           <Card
//             sx={{
//               ...styles.card,
//               mt: 2,
//             }}
//           >
//             <CardContent>
//               <Box display="flex" alignItems="center" mb={2}>
//                 <Notifications color="primary" sx={{ mr: 1 }} />
//                 <Typography variant="h6" sx={styles.sectionTitle}>
//                   Notifications
//                 </Typography>
//               </Box>
//               <Divider sx={{ mb: 2 }} />
//               {notifications.length > 0 ? (
//                 <Stack spacing={1}>
//                   {notifications.map((note, index) => (
//                     <Paper
//                       key={index}
//                       variant="outlined"
//                       sx={styles.notificationPaper}
//                     >
//                       <Notifications color="primary" sx={{ fontSize: 18 }} />
//                       <Typography variant="body2">{note}</Typography>
//                     </Paper>
//                   ))}
//                 </Stack>
//               ) : (
//                 <Typography>No new notifications.</Typography>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Paper,
  Button,
  Chip,
  Stack,
  Divider,
  Tooltip,
  Badge,
  IconButton,
  Switch,
} from '@mui/material';
import {
  Group,
  Notifications,
  Star,
  ExitToApp,
  Quiz,
  AccessTime,
  ChevronRight,
  Brightness4,
  Brightness7,
  Settings,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [userGroupId, setUserGroupId] = useState(null);
  const [preferredTime, setpreferredTime] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!userEmail) return;

    axios
      .get(`http://localhost:5000/user-profile/${userEmail}`)
      .then((response) => {
        setUser(response.data);
        setUserGroupId(response.data.group_id);
      })
      .catch((error) => console.error('Error fetching user data:', error));

    setNotifications([
      'Welcome! You have entered a group.',
      'Your profile has been updated successfully.',
      `Based on group availability, the best time for everyone to study together is Evening!`,
    ]);
  }, [userEmail]);

  useEffect(() => {
    async function fetchPreferredStudyTime() {
      const email = localStorage.getItem('userEmail');
      if (!email) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/group-preferred-study-time/${email}`
        );
        setpreferredTime(response.data.preferredStudyTime);
      } catch (error) {
        console.error('Error fetching preferred study time:', error);
      }
    }

    fetchPreferredStudyTime();
  }, []);

  useEffect(() => {
    if (userGroupId) {
      axios
        .get(`http://localhost:5000/active-groups/${userGroupId}`)
        .then((response) => setGroup(response.data))
        .catch((error) => console.error('Error fetching group data:', error));
    }
  }, [userGroupId]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  // Dynamic styles for dark/light mode
  const styles = {
    background: {
      background: darkMode ? '#181a20' : '#f4f6fb',
      minHeight: '100vh',
      transition: 'background 0.3s',
      p: { xs: 1, md: 3 },
    },
    card: {
      borderRadius: 4,
      boxShadow: 3,
      bgcolor: darkMode ? '#23272f' : '#fff',
      color: darkMode ? '#fff' : '#222',
      transition: 'background 0.3s, color 0.3s',
    },
    paper: {
      bgcolor: darkMode ? '#23272f' : '#fff',
      color: darkMode ? '#fff' : '#222',
      borderRadius: 3,
      boxShadow: 2,
      transition: 'background 0.3s, color 0.3s',
    },
    sectionTitle: {
      fontWeight: 'bold',
      color: darkMode ? '#90caf9' : '#1976d2',
      letterSpacing: 1,
    },
    chip: {
      bgcolor: darkMode ? '#333' : '#e3f2fd',
      color: darkMode ? '#90caf9' : '#1976d2',
      fontWeight: 600,
    },
    gradientAvatar: {
      background: darkMode
        ? 'linear-gradient(135deg, #1976d2 40%, #ff4081 100%)'
        : 'linear-gradient(135deg, #42a5f5 40%, #ffb300 100%)',
      border: `4px solid ${darkMode ? '#333' : '#fff'}`,
    },
    quizCard: {
      borderRadius: 3,
      bgcolor: darkMode ? 'rgba(33,150,243,0.08)' : '#e3f2fd',
      boxShadow: 2,
      height: '100%',
    },
    groupCard: {
      borderRadius: 3,
      bgcolor: darkMode ? 'rgba(255,193,7,0.08)' : '#fffde7',
      boxShadow: 2,
      height: '100%',
    },
    notificationPaper: {
      p: 2,
      bgcolor: darkMode ? 'rgba(33,150,243,0.08)' : '#f5faff',
      borderRadius: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      color: darkMode ? '#fff' : '#222',
    },
  };

  return (
    <Box sx={styles.background} position="relative">
      {/* Top-right settings bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          mb: 3,
          px: { xs: 1, md: 3 },
          gap: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1,
            borderRadius: 3,
            bgcolor: darkMode ? '#23272f' : '#fff',
            boxShadow: 2,
            gap: 1,
          }}
        >
          <Settings sx={{ color: darkMode ? '#90caf9' : '#1976d2' }} />
          <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode((prev) => !prev)}
              color="primary"
              inputProps={{ 'aria-label': 'toggle dark mode' }}
            />
          </Tooltip>
          <IconButton
            onClick={handleLogout}
            color="error"
            sx={{ ml: 1 }}
            aria-label="logout"
          >
            <ExitToApp />
          </IconButton>
        </Paper>
      </Box>

      <Grid container spacing={3}>
        {/* Profile + Quick Info */}
        <Grid item xs={12} md={4}>
          <Card
            onClick={() => navigate('/profile')}
            sx={{
              ...styles.card,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'visible',
              mb: 2,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -24,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 120,
                height: 120,
                background: darkMode
                  ? 'linear-gradient(135deg, #1976d2 40%, #ff4081 100%)'
                  : 'linear-gradient(135deg, #42a5f5 40%, #ffb300 100%)',
                borderRadius: '50%',
                zIndex: 1,
                opacity: 0.13,
                filter: 'blur(8px)',
              }}
            />
            <CardContent sx={{ textAlign: 'center', pb: 2, zIndex: 2, position: 'relative' }}>
              <Badge
                overlap="circular"
                badgeContent={
                  <Chip
                    label={user?.role || 'Student'}
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      fontWeight: 600,
                    }}
                  />
                }
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    margin: 'auto',
                    mb: 2,
                    boxShadow: 2,
                    ...styles.gradientAvatar,
                  }}
                  src={user?.avatar || '/default-avatar.jpg'}
                />
              </Badge>
              <Typography variant="h5" fontWeight="bold">
                {user?.username || 'Loading...'}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {group?.primary_domain || 'User Domain'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Tooltip title="Your group rating">
                  <Chip
                    icon={<Star sx={{ color: '#fbc02d' }} />}
                    label={`Rating: ${user?.rating || 'N/A'}`}
                    variant="outlined"
                    sx={styles.chip}
                  />
                </Tooltip>
                <Tooltip title="Best group study time">
                  <Chip
                    icon={<AccessTime />}
                    color="success"
                    label={
                      preferredTime
                        ? `Best Time: ${preferredTime}`
                        : 'Best Time: -'
                    }
                    variant="outlined"
                    sx={styles.chip}
                  />
                </Tooltip>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Actions */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {/* Welcome & Actions */}
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  ...styles.paper,
                  p: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 3,
                  background:
                    darkMode
                      ? 'linear-gradient(90deg, #232526 0%, #414345 100%)'
                      : 'linear-gradient(90deg, #e3f2fd 0%, #fffde7 100%)',
                }}
              >
                <Box>
                  <Typography variant="h6" sx={styles.sectionTitle}>
                    Welcome back, {user?.username || 'User'}!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Here’s your dashboard overview.
                  </Typography>
                </Box>
                {/* Logout button is now only in the top bar */}
              </Paper>
            </Grid>

            {/* Quizzes */}
            <Grid item xs={12} md={6}>
              <Card sx={styles.quizCard}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Quiz color="primary" sx={{ mr: 1, fontSize: 30 }} />
                    <Typography variant="h6" sx={styles.sectionTitle}>
                      Quizzes
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Challenge yourself and track your progress.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/quizzes')}
                    endIcon={<ChevronRight />}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                  >
                    Take a Quiz
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Study Group */}
            <Grid item xs={12} md={6}>
              <Card sx={styles.groupCard}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Group color="warning" sx={{ mr: 1, fontSize: 30 }} />
                    <Typography variant="h6" sx={styles.sectionTitle}>
                      Active Study Group
                    </Typography>
                  </Box>
                  {group ? (
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        borderRadius: 2,
                        bgcolor: darkMode ? 'rgba(255,193,7,0.08)' : '#fffde7',
                        transition: 'box-shadow 0.2s',
                        '&:hover': { boxShadow: 4, bgcolor: darkMode ? 'rgba(255,193,7,0.16)' : '#fff9c4' },
                      }}
                      onClick={() => navigate(`/chat`)}
                    >
                      <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {group.primary_domain}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <Group sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="body2">
                            {group.member_count} Members
                          </Typography>
                        </Box>
                      </Box>
                      <ChevronRight color="warning" />
                    </Paper>
                  ) : (
                    <Typography color="text.secondary">
                      No active group found.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12}>
          <Card
            sx={{
              ...styles.card,
              mt: 2,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Notifications color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={styles.sectionTitle}>
                  Notifications
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {notifications.length > 0 ? (
                <Stack spacing={1}>
                  {notifications.map((note, index) => (
                    <Paper
                      key={index}
                      variant="outlined"
                      sx={styles.notificationPaper}
                    >
                      <Notifications color="primary" sx={{ fontSize: 18 }} />
                      <Typography variant="body2">{note}</Typography>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography>No new notifications.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

