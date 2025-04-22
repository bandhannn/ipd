// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Box, Button, Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel, CircularProgress } from "@mui/material";

// const Quizpage = () => {
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
//   const [loading, setLoading] = useState(true);
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState(0);
//   const navigate = useNavigate();
//   const userEmail = localStorage.getItem("userEmail");

//   useEffect(() => {
//     async function fetchQuestions() {
//       try {
//         const response = await axios.get(`http://localhost:5000/get-quiz/${userEmail}`);
//         setQuestions(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching quiz questions:", error);
//       }
//     }
//     fetchQuestions();
//   }, [userEmail]);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       handleSubmit();
//     }
//     const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   const handleOptionChange = (questionId, selectedOption) => {
//     setAnswers({ ...answers, [questionId]: selectedOption });
//   };

//   const handleSubmit = async () => {
//     let calculatedScore = 0;
//     questions.forEach((q) => {
//       if (answers[q.id] === q.correct_option) {
//         calculatedScore += 5;
//       }
//     });
//     setScore(calculatedScore);
//     setSubmitted(true);

//     try {
//       await axios.post("http://localhost:5000/submit-quiz", {
//         userEmail,
//         score: calculatedScore,
//       });
//     } catch (error) {
//       console.error("Error updating user rating:", error);
//     }
//   };

//   return (
//     <Box sx={{ p: 3, maxWidth: "800px", margin: "auto", textAlign: "center" }}>
//       {loading ? (
//         <CircularProgress />
//       ) : submitted ? (
//         <Card>
//           <CardContent>
//             <Typography variant="h4">Quiz Completed!</Typography>
//             <Typography variant="h6">Your Score: {score} / 50</Typography>
//             <Typography variant="body1" sx={{ mt: 2 }}>Correct Answers:</Typography>
//             {questions.map((q) => (
//               <Typography key={q.id}>{q.question}: {q.correct_option}</Typography>
//             ))}
//             <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate("/dashboard")}>
//               Back to Dashboard
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <Card>
//           <CardContent>
//             <Typography variant="h4">Quiz</Typography>
//             <Typography variant="body1">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</Typography>
//             {questions.map((q) => (
//               <Box key={q.id} sx={{ mt: 2 }}>
//                 <Typography variant="h6">{q.question}</Typography>
//                 <RadioGroup value={answers[q.id] || ""} onChange={(e) => handleOptionChange(q.id, e.target.value)}>
//                   <FormControlLabel value={q.option_a} control={<Radio />} label={q.option_a} />
//                   <FormControlLabel value={q.option_b} control={<Radio />} label={q.option_b} />
//                   <FormControlLabel value={q.option_c} control={<Radio />} label={q.option_c} />
//                   <FormControlLabel value={q.option_d} control={<Radio />} label={q.option_d} />
//                 </RadioGroup>
//               </Box>
//             ))}
//             <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleSubmit}>
//               Submit Quiz
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </Box>
//   );
// };

// export default Quizpage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Box, Button, Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel, CircularProgress } from "@mui/material";

// const Quizpage = () => {
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
//   const [loading, setLoading] = useState(true);
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState(0);
//   const navigate = useNavigate();
//   const userEmail = localStorage.getItem("userEmail");

//   useEffect(() => {
//     async function fetchQuestions() {
//       try {
//         const response = await axios.get(`http://localhost:5000/get-quiz/${userEmail}`);
//         setQuestions(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching quiz questions:", error);
//       }
//     }
//     fetchQuestions();
//   }, [userEmail]);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       handleSubmit();
//     }
//     const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   const handleOptionChange = (questionId, selectedOption, correctOption) => {
//     setAnswers({ ...answers, [questionId]: selectedOption });
// };


//   // const handleSubmit = async () => {
//   //   const formattedAnswers = Object.keys(answers).map((questionId) => ({
//   //     questionId: parseInt(questionId),
//   //     selectedOption: answers[questionId],
//   //   }));

//   //   try {
//   //     const response = await axios.post("http://localhost:5000/submit-quiz", {
//   //       email: userEmail,
//   //       answers: formattedAnswers,
//   //     });
//   //     setScore(response.data.score);
//   //     setSubmitted(true);
//   //   } catch (error) {
//   //     console.error("Error submitting quiz:", error);
//   //   }
//   // };

//   const handleSubmit = async () => {
//     const answersArray = questions.map((q) => ({
//         questionId: q.id,
//         selectedOption: answers[q.id] || null, // Store selected letter (A, B, C, D)
//     }));

//     try {
//         const response = await axios.post("http://localhost:5000/submit-quiz", {
//             email: userEmail,
//             answers: answersArray,
//         });
//         const { score } = response.data;

//         // ✅ Navigate to Results Page after submission
//         navigate("/quiz-results", { state: { questions, answers, score } });
//         console.log("Quiz submission response:", response.data);
//     } catch (error) {
//         console.error("Error submitting quiz:", error);
//     }
// };



//   return (
//     <Box sx={{ p: 3, maxWidth: "800px", margin: "auto", textAlign: "center" }}>
//       {loading ? (
//         <CircularProgress />
//       ) : submitted ? (
//         <Card>
//           <CardContent>
//             <Typography variant="h4">Quiz Completed!</Typography>
//             <Typography variant="h6">Your Score: {score} / 50</Typography>
//             <Typography variant="body1" sx={{ mt: 2 }}>Correct Answers:</Typography>
//             {questions.map((q) => (
//               <Typography key={q.id}>{q.question}: {q.correct_option}</Typography>
//             ))}
//             <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate("/dashboard")}>
//               Back to Dashboard
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <Card>
//           <CardContent>
//             <Typography variant="h4">Quiz</Typography>
//             <Typography variant="body1">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</Typography>
//             {questions.map((q) => (
//               <Box key={q.id} sx={{ mt: 2 }}>
//                 <Typography variant="h6">{q.question}</Typography>
//                 <RadioGroup value={answers[q.id] || ""} onChange={(e) => handleOptionChange(q.id, e.target.value)}>
//                   <FormControlLabel value='A' control={<Radio />} label={q.option_a} />
//                   <FormControlLabel value='B' control={<Radio />} label={q.option_b} />
//                   <FormControlLabel value='C' control={<Radio />} label={q.option_c} />
//                   <FormControlLabel value='D' control={<Radio />} label={q.option_d} />
//                 </RadioGroup>
//               </Box>
//             ))}
//             <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleSubmit}>
//               Submit Quiz
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </Box>
//   );
// };

// export default Quizpage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Box, Button, Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel, CircularProgress } from "@mui/material";

// const Quizpage = () => {
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
//   const [loading, setLoading] = useState(true);
//   const [submitted, setSubmitted] = useState(false);
//   const navigate = useNavigate();
//   const userEmail = localStorage.getItem("userEmail");

//   useEffect(() => {
//     async function fetchQuestions() {
//       try {
//         const response = await axios.get(`http://localhost:5000/get-quiz/${userEmail}`);
//         setQuestions(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching quiz questions:", error);
//       }
//     }
//     fetchQuestions();
//   }, [userEmail]);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       handleSubmit();
//     }
//     const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   // ✅ Store selected option as A, B, C, or D
//   const handleOptionChange = (questionId, selectedOption) => {
//     setAnswers({ ...answers, [questionId]: selectedOption });
//   };

//   // const handleSubmit = async () => {
//   //   const answersArray = questions.map((q) => ({
//   //     questionId: q.id,
//   //     selectedOption: answers[q.id] || null, // Stores 'A', 'B', 'C', or 'D'
//   //   }));

//   //   try {
//   //     const response = await axios.post("http://localhost:5000/submit-quiz", {
//   //       email: userEmail,
//   //       answers: answersArray,
//   //     });

//   //     const { score } = response.data;

//   //     // ✅ Navigate to Results Page after submission
//   //     navigate("/quiz-results", { state: { questions, answers, score } });

//   //   } catch (error) {
//   //     console.error("Error submitting quiz:", error);
//   //   }
//   // };

//   const handleSubmit = async () => {
//     const formattedAnswers = Object.keys(answers).map((questionId) => ({
//       questionId: parseInt(questionId),
//       selectedOption: answers[questionId],
//     }));
  
//     setSubmitted(true);
  
//     try {
//       const response = await axios.post("http://localhost:5000/submit-quiz", {
//         email: userEmail,
//         answers: formattedAnswers, // Send array of answers
//       });
  
//       navigate("/quiz-results", { state: { questions, answers, score: response.data.score } });
//     } catch (error) {
//       console.error("Error submitting quiz:", error);
//     }
//   };
  
//   return (
//     <Box sx={{ p: 3, maxWidth: "800px", margin: "auto", textAlign: "center" }}>
//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <Card>
//           <CardContent>
//             <Typography variant="h4">Quiz</Typography>
//             <Typography variant="body1">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</Typography>
//             {questions.map((q, index) => (
//               <Box key={q.id} sx={{ mt: 2, textAlign: "left" }}>
//                 <Typography variant="h6">{index + 1}. {q.question}</Typography>
//                 <RadioGroup value={answers[q.id] || ""} onChange={(e) => handleOptionChange(q.id, e.target.value)}>
//                   <FormControlLabel value="A" control={<Radio />} label={q.option_a} />
//                   <FormControlLabel value="B" control={<Radio />} label={q.option_b} />
//                   <FormControlLabel value="C" control={<Radio />} label={q.option_c} />
//                   <FormControlLabel value="D" control={<Radio />} label={q.option_d} />
//                 </RadioGroup>
//               </Box>
//             ))}
//             <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleSubmit}>
//               Submit Quiz
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </Box>
//   );
// };

// export default Quizpage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Box, Button, Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel, CircularProgress } from "@mui/material";

// const Quizpage = () => {
  // const [questions, setQuestions] = useState([]);
  // const [answers, setAnswers] = useState({});
  // const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  // const [loading, setLoading] = useState(true);
  // const [submitted, setSubmitted] = useState(false);
  // const [score, setScore] = useState(0);
  // const navigate = useNavigate();
  // const userEmail = localStorage.getItem("userEmail");

  // useEffect(() => {
  //   async function fetchQuestions() {
  //     try {
  //       const response = await axios.get(`http://localhost:5000/get-quiz/${userEmail}`);
  //       setQuestions(response.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching quiz questions:", error);
  //     }
  //   }
  //   fetchQuestions();
  // }, [userEmail]);

  // useEffect(() => {
  //   if (timeLeft <= 0) {
  //     handleSubmit();
  //   }
  //   const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
  //   return () => clearInterval(timer);
  // }, [timeLeft]);

  // const handleOptionChange = (questionId, selectedOption) => {
  //   setAnswers({ ...answers, [questionId]: selectedOption });
  // };

  // const handleSubmit = async () => {
  //   const formattedAnswers = Object.keys(answers).map((questionId) => ({
  //     questionId: parseInt(questionId),
  //     selectedOption: answers[questionId],
  //   }));

  //   setSubmitted(true);

  //   try {
  //     const response = await axios.post("http://localhost:5000/submit-quiz", {
  //       email: userEmail,
  //       answers: formattedAnswers,
  //     });

  //     navigate("/quiz-results", {
  //       state: {
  //         questions, // Pass questions including correct_option
  //         answers,
  //         score: response.data.score,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error submitting quiz:", error);
  //   }
  // };

//   return (
//     <Box sx={{ p: 3, maxWidth: "800px", margin: "auto", textAlign: "center" }}>
//       {loading ? (
//         <CircularProgress />
//       ) : submitted ? (
//         <Typography variant="h4">Submitting...</Typography>
//       ) : (
//         <Card>
//           <CardContent>
//             <Typography variant="h4">Quiz</Typography>
//             <Typography variant="body1">
//               Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
//             </Typography>
//             {questions.map((q) => (
//               <Box key={q.id} sx={{ mt: 2 }}>
//                 <Typography variant="h6">{q.question}</Typography>
//                 <RadioGroup value={answers[q.id] || ""} onChange={(e) => handleOptionChange(q.id, e.target.value)}>
//                   <FormControlLabel value="A" control={<Radio />} label={q.option_a} />
//                   <FormControlLabel value="B" control={<Radio />} label={q.option_b} />
//                   <FormControlLabel value="C" control={<Radio />} label={q.option_c} />
//                   <FormControlLabel value="D" control={<Radio />} label={q.option_d} />
//                 </RadioGroup>
//               </Box>
//             ))}
//             <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleSubmit}>
//               Submit Quiz
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </Box>
//   );
// };

// export default Quizpage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Box, Button, Card, CardContent, Typography, 
  Radio, RadioGroup, FormControlLabel, 
  CircularProgress, LinearProgress, Paper
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
    },
    secondary: {
      main: '#1565C0',
    },
  },
});

const Quizpage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get(`http://localhost:5000/get-quiz/${userEmail}`);
        setQuestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      }
    }
    fetchQuestions();
  }, [userEmail]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers({ ...answers, [questionId]: selectedOption });
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      questionId: parseInt(questionId),
      selectedOption: answers[questionId],
    }));

    setSubmitted(true);

    try {
      const response = await axios.post("http://localhost:5000/submit-quiz", {
        email: userEmail,
        answers: formattedAnswers,
      });

      navigate("/quiz-results", {
        state: {
          questions, // Pass questions including correct_option
          answers,
          score: response.data.score,
        },
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e8f5e9 100%)',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            mt: 10 
          }}>
            <CircularProgress size={60} thickness={5} sx={{ mb: 3 }} />
            <Typography variant="h6" color="textSecondary">
              Loading Questions...
            </Typography>
          </Box>
        ) : submitted ? (
          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <CircularProgress size={60} thickness={5} sx={{ mb: 3 }} />
            <Typography variant="h4" color="primary">
              Submitting Your Answers
            </Typography>
          </Box>
        ) : (
          <Card sx={{ 
            width: '100%', 
            maxWidth: 900, 
            borderRadius: 4,
            boxShadow: 3,
            overflow: 'visible'
          }}>
            <Box sx={{ 
              bgcolor: 'primary.main', 
              color: 'white', 
              p: 2,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4
            }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                Knowledge Challenge
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                Time Remaining: {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </Typography>
            </Box>

            <CardContent sx={{ p: 3 }}>
              {questions.map((q, index) => (
                <Paper 
                  key={q.id}
                  elevation={2}
                  sx={{
                    mb: 3,
                    p: 3,
                    borderRadius: 3,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ 
                    mb: 2, 
                    fontWeight: 600,
                    color: 'text.primary'
                  }}>
                    <span style={{ color: '#2E7D32' }}>Q{index + 1}.</span> {q.question}
                  </Typography>
                  
                  <RadioGroup
                    value={answers[q.id] || ""}
                    onChange={(e) => handleOptionChange(q.id, e.target.value)}
                  >
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio color="primary" />}
                        label={
                          <Typography variant="body1">
                            {q[`option_${option.toLowerCase()}`]}
                          </Typography>
                        }
                        sx={{
                          mb: 1,
                          px: 2,
                          py: 1,
                          borderRadius: 1,
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      />
                    ))}
                  </RadioGroup>
                </Paper>
              ))}

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 4 
              }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  sx={{
                    px: 6,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 2,
                    textTransform: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  Submit Quiz
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Quizpage;



