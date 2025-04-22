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
  Button
} from '@mui/material';
import { Group, Notifications, Star, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [userGroupId, setUserGroupId] = useState(null);
  const [preferredTime, setpreferredTime] = useState(null);

  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');  // Get user email

  useEffect(() => {
    if (!userEmail) {
      console.error("User email not found!");
      return;
    }

    // Fetch user data
    axios.get(`http://localhost:5000/user-profile/${userEmail}`)
      .then(response => {
        setUser(response.data);
        setUserGroupId(response.data.group_id);
      })
      .catch(error => console.error("Error fetching user data:", error));

    setNotifications([
      'Welcome! You have entered a group.',
      'Your profile has been updated successfully.',
      `Based on group availability, the best time for everyone to study together is Evening!`
    ]);
  }, [userEmail]);

  useEffect(() => {
    async function fetchPreferredStudyTime() {
      const email = localStorage.getItem("userEmail");  // You can use a different way to get the user email
      if (!email) return;

      try {
        const response = await axios.get(`http://localhost:5000/group-preferred-study-time/${email}`);
        setpreferredTime(response.data.preferredStudyTime);  // Save it to the state variable
      } catch (error) {
        console.error("Error fetching preferred study time:", error);
      }
    }

    fetchPreferredStudyTime();
  }, []);

  useEffect(() => {
    if (userGroupId) {
      axios.get(`http://localhost:5000/active-groups/${userGroupId}`)
        .then(response => setGroup(response.data))
        .catch(error => console.error("Error fetching group data:", error));
    }
  }, [userGroupId]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');  // Clear user data
    navigate('/login');  // Redirect to login page
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#f4f6f8' }}>
      <Grid container spacing={3}>

        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Card onClick={() => navigate('/profile')} sx={{ cursor: 'pointer' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar 
                sx={{ width: 100, height: 100, margin: 'auto', mb: 2 }}
                src={user?.avatar || '/default-avatar.jpg'}
              />
              <Typography variant="h6">{user?.username || 'Loading...'}</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {group?.primary_domain || 'User Domain'}
                
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Rating & Logout Section */}
        <Grid item xs={12} md={8}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              bgcolor: '#fff', 
              p: 2, 
              borderRadius: 2, 
              boxShadow: 2,
              mb: 2  // Add spacing below this section
            }}
          >
            {/* Rating Display */}
            <Box display="flex" alignItems="center">
              <Star sx={{ color: '#fbc02d', fontSize: 30, mr: 1 }} />
              <Typography variant="h6">
                Rating: {user?.rating || 'N/A'}
              </Typography>
            </Box>

            {/* Logout Button */}
            <Button 
              variant="contained" 
              color="error"
              onClick={handleLogout}
              startIcon={<ExitToApp />}
              sx={{ fontWeight: 'bold' }}
            >
              Logout
            </Button>
          </Box>
          
          {/* Quiz Section (Now Pulled Down) */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quizzes
              </Typography>
              <Button variant="contained" color="primary" onClick={() => navigate('/quizzes')}>
                Take a Quiz
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Study Groups */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Active Study Group</Typography>
                
              </Box>
              
              {group ? (
                <Paper 
                  key={group.primary_domain} 
                  elevation={1} 
                  sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => navigate(`/chat`)}
                >
                  <Box flex={1}>
                    <Typography variant="subtitle1">{group.primary_domain}</Typography>
                    <Box display="flex" alignItems="center">
                      <Group sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">{group.member_count} Members</Typography>
                    </Box>
                  </Box>
                </Paper>
              ) : (
                <Typography>No active group found.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Notifications sx={{ mr: 1 }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>
              {notifications.length > 0 ? (
                notifications.map((note, index) => (
                  <Paper key={index} variant="outlined" sx={{ p: 2, mb: 1 }}>
                    <Typography variant="body2">{note}</Typography>
                  </Paper>
                ))
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

