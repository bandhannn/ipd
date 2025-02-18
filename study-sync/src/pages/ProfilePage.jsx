import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid, 
  Avatar, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Select, 
  MenuItem, 
  Checkbox, 
  FormControlLabel, 
  FormGroup 
} from '@mui/material';
import { 
  AccountCircle, 
  School, 
  Schedule, 
  Group 
} from '@mui/icons-material';



const domains = [
  'Mathematics', 'Physics', 'Chemistry', 'Programming', 
  'Data Structures', 'Machine Learning'
];

const programmingLanguages = ['C', 'C++', 'Python', 'Java', 'JavaScript', 'Ruby', 'Go', 'Other'];

const ProfilePage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    university: '',
    year: '',
    primaryDomain: '',
    programmingLanguages: [],
    studyTime: '',
    groupSize: '',
    goals: '',
    interests: '',
    avatarPreview: null
  });

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatarPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProgrammingLanguageToggle = (language) => {
    setFormData(prev => {
      const currentLanguages = prev.programmingLanguages;
      const newLanguages = currentLanguages.includes(language)
        ? currentLanguages.filter(lang => lang !== language)
        : [...currentLanguages, language];
      
      return { ...prev, programmingLanguages: newLanguages };
    });
  };
   

  const handleNext = async () => {
    if (activeStep < 2) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } 
  };

  const handleBack = () => {
    if(activeStep > 0){
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }};

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          primaryDomain: formData.primaryDomain,
          studyTime: formData.studyTime,
          year: formData.year,
          groupSize: formData.groupSize
        }),
      });

      if (response.ok) {
        console.log("Profile updated successfully");
        localStorage.setItem("userEmail", formData.email);
         // Navigate to chat ONLY after completing all steps
      } else {
        console.error("Profile update failed");
        alert("Error updating profile");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };



  const steps = ['Personal Info', 'Academic Details', 'Study Preferences'];

  const renderPersonalInfo = () => (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} display="flex" justifyContent="center" mb={3}>
          <Box position="relative">
            <Avatar 
              src={formData.avatarPreview || undefined} 
              sx={{ width: 120, height: 120 }}
            >
              {!formData.avatarPreview && <AccountCircle sx={{ fontSize: 100 }} />}
            </Avatar>
            <input
              accept="image/*"
              type="file"
              style={{ display: 'none' }}
              id="avatar-upload"
              onChange={handleAvatarUpload}
            />
            <label htmlFor="avatar-upload">
              <Button 
                variant="contained" 
                component="span" 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  right: 0, 
                  minWidth: 0, 
                  padding: '4px 8px' 
                }}
              >
                Edit
              </Button>
            </label>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderAcademicDetails = () => (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="University"
            value={formData.university}
            onChange={handleChange('university')}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Year of Study"
            value={formData.year}
            onChange={handleChange('year')}
            variant="outlined"
          >
            {['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Postgraduate'].map((year) => (
              <MenuItem key={year} value={year}>
                {year} Year
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Primary Domain"
            value={formData.primaryDomain}
            onChange={handleChange('primaryDomain')}
            variant="outlined"
          >
            {domains.map((domain) => (
              <MenuItem key={domain} value={domain}>
                {domain}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {formData.primaryDomain === 'Other' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Specify Other Domain"
              value={formData.otherDomain}
              onChange={handleChange('otherDomain')}
              variant="outlined"
            />
          </Grid>
        )}
        {formData.primaryDomain === 'Programming' && (
          <Grid item xs={12}>
            <Typography variant="subtitle1">Programming Languages</Typography>
            <FormGroup row>
              {programmingLanguages.map((language) => (
                <FormControlLabel
                  key={language}
                  control={
                    <Checkbox
                      checked={formData.programmingLanguages.includes(language)}
                      onChange={() => handleProgrammingLanguageToggle(language)}
                    />
                  }
                  label={language}
                />
              ))}
            </FormGroup>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  const renderStudyPreferences = () => (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Preferred Study Time"
            value={formData.studyTime}
            onChange={handleChange('studyTime')}
            variant="outlined"
          >
            {['Morning', 'Afternoon', 'Evening', 'Night', 'Flexible'].map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {/* <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Group Size Preference"
            value={formData.groupSize}
            onChange={handleChange('groupSize')}
            variant="outlined"
          >
            {['Small', 'Medium', 'Large'].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </TextField>
        </Grid> */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Academic Goals"
            multiline
            rows={3}
            value={formData.goals}
            onChange={handleChange('goals')}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Interests and Hobbies"
            multiline
            rows={3}
            value={formData.interests}
            onChange={handleChange('interests')}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Complete Your Profile
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {activeStep === 0 && renderPersonalInfo()}
          {activeStep === 1 && renderAcademicDetails()}
          {activeStep === 2 && renderStudyPreferences()}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack}>
                Back
              </Button>
            )}
            {activeStep < 2 ? (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNext} 
                sx={{ ml: 'auto' }}
              >
                Next
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                type="submit"  // Submit the form
                sx={{ ml: 'auto' }}
              >
                <Link to={'/chat'}>Complete</Link>
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
   
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Container, Typography, TextField, Button, Box, Grid, Avatar, Paper,
//   Stepper, Step, StepLabel, Select, MenuItem, Checkbox, FormControlLabel, FormGroup
// } from '@mui/material';
// import { AccountCircle } from '@mui/icons-material';

// const domains = ['Mathematics', 'Physics', 'Chemistry', 'Programming', 'Data Structures', 'Machine Learning', 'Other'];
// const programmingLanguages = ['C', 'C++', 'Python', 'Java', 'JavaScript', 'Ruby', 'Go', 'Other'];

// const ProfilePage = () => {
//   const [activeStep, setActiveStep] = useState(0);
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     university: '',
//     year: '',
//     primaryDomain: '',
//     otherDomain: '',
//     programmingLanguages: [],
//     studyTime: '',
//     groupSize: '',
//     goals: '',
//     interests: '',
//     avatarPreview: null
//   });

//   const handleChange = (field) => (event) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: event.target.value
//     }));
//   };

//   const handleAvatarUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({ ...prev, avatarPreview: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleProgrammingLanguageToggle = (language) => {
//     setFormData(prev => {
//       const currentLanguages = prev.programmingLanguages;
//       const newLanguages = currentLanguages.includes(language)
//         ? currentLanguages.filter(lang => lang !== language)
//         : [...currentLanguages, language];

//       return { ...prev, programmingLanguages: newLanguages };
//     });
//   };

//   const handleNext = () => {
//     if (activeStep < 2) {
//       setActiveStep(prevActiveStep => prevActiveStep + 1);
//     }
//   };

//   const handleBack = () => {
//     if (activeStep > 0) {
//       setActiveStep(prevActiveStep => prevActiveStep - 1);
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       const response = await fetch("http://localhost:5000/update-profile", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: formData.email,
//           primaryDomain: formData.primaryDomain,
//           studyTime: formData.studyTime,
//           year: formData.year,
//         }),
//       });

//       if (response.ok) {
//         console.log("Profile updated successfully");
//         localStorage.setItem("userEmail", formData.email);
//         navigate("/chat");  // Navigate to chat ONLY after completing all steps
//       } else {
//         console.error("Profile update failed");
//         alert("Error updating profile");
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//     }
//   };

//   const steps = ['Personal Info', 'Academic Details', 'Study Preferences'];

//   const renderPersonalInfo = () => (
//     <Box sx={{ mt: 3 }}>
//       <Grid container spacing={3}>
//         <Grid item xs={12} display="flex" justifyContent="center" mb={3}>
//           <Box position="relative">
//             <Avatar src={formData.avatarPreview || undefined} sx={{ width: 120, height: 120 }}>
//               {!formData.avatarPreview && <AccountCircle sx={{ fontSize: 100 }} />}
//             </Avatar>
//             <input accept="image/*" type="file" style={{ display: 'none' }} id="avatar-upload" onChange={handleAvatarUpload} />
//             <label htmlFor="avatar-upload">
//               <Button variant="contained" component="span" sx={{ position: 'absolute', bottom: 0, right: 0, minWidth: 0, padding: '4px 8px' }}>
//                 Edit
//               </Button>
//             </label>
//           </Box>
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <TextField fullWidth label="First Name" value={formData.firstName} onChange={handleChange('firstName')} variant="outlined" />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField fullWidth label="Last Name" value={formData.lastName} onChange={handleChange('lastName')} variant="outlined" />
//         </Grid>
//       </Grid>
//     </Box>
//   );

//   const renderAcademicDetails = () => (
//     <Box sx={{ mt: 3 }}>
//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <TextField select fullWidth label="Primary Domain" value={formData.primaryDomain} onChange={handleChange('primaryDomain')} variant="outlined">
//             {domains.map(domain => (
//               <MenuItem key={domain} value={domain}>{domain}</MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//         {formData.primaryDomain === 'Other' && (
//           <Grid item xs={12}>
//             <TextField fullWidth label="Specify Other Domain" value={formData.otherDomain} onChange={handleChange('otherDomain')} variant="outlined" />
//           </Grid>
//         )}
//         {formData.primaryDomain === 'Programming' && (
//           <Grid item xs={12}>
//             <Typography variant="subtitle1">Programming Languages</Typography>
//             <FormGroup row>
//               {programmingLanguages.map(language => (
//                 <FormControlLabel
//                   key={language}
//                   control={<Checkbox checked={formData.programmingLanguages.includes(language)} onChange={() => handleProgrammingLanguageToggle(language)} />}
//                   label={language}
//                 />
//               ))}
//             </FormGroup>
//           </Grid>
//         )}
//       </Grid>
//     </Box>
//   );

//   const renderStudyPreferences = () => (
//     <Box sx={{ mt: 3 }}>
//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <TextField select fullWidth label="Preferred Study Time" value={formData.studyTime} onChange={handleChange('studyTime')} variant="outlined">
//             {['Morning', 'Afternoon', 'Evening', 'Night', 'Flexible'].map(time => (
//               <MenuItem key={time} value={time}>{time}</MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//       </Grid>
//     </Box>
//   );

//   return (
//     <Container maxWidth="md">
//       <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
//         <Typography variant="h4" align="center" gutterBottom>Complete Your Profile</Typography>
//         <Stepper activeStep={activeStep} alternativeLabel>
//           {steps.map(label => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         <form onSubmit={handleSubmit}>
//           {activeStep === 0 && renderPersonalInfo()}
//           {activeStep === 1 && renderAcademicDetails()}
//           {activeStep === 2 && renderStudyPreferences()}

//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
//             {activeStep !== 0 && <Button onClick={handleBack}>Back</Button>}
//             {activeStep < 2 ? (
//               <Button variant="contained" color="primary" onClick={handleNext} sx={{ ml: 'auto' }}>Next</Button>
//             ) : (
//               <Button variant="contained" color="primary" type="submit" sx={{ ml: 'auto' }}>Complete</Button>
//             )}
//           </Box>
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default ProfilePage;






















