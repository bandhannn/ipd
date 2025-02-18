// import React,{useState,useEffect} from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Box, Button, Card, CardContent, Typography } from "@mui/material";

// const QuizResults = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [correct_ans, setAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const { questions, answers, score } = location.state || {};

//   if (!questions || !answers) {
//     return <Typography variant="h5">No results found</Typography>;
//   }
//   const userEmail = localStorage.getItem("userEmail");

//   useEffect(() => {
//     async function fetchAnswers() {
//       try {
//         const response = await axios.get(`http://localhost:5000/get-quiz/${userEmail}`);
//         setAnswers(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching quiz questions:", error);
//       }
//     }
//     fetchAnswers();
//   }, [userEmail]);

//   return (
//     <Box sx={{ p: 3, maxWidth: "800px", margin: "auto", textAlign: "center" }}>
//       <Card>
//         <CardContent>
//           <Typography variant="h4">Quiz Completed!</Typography>
//           <Typography variant="h6">Your Score: {score} / 50</Typography>
//           <Typography variant="body1" sx={{ mt: 2 }}>Review Your Answers:</Typography>

//           {questions.map((q, index) => (
//             <Box key={q.id} sx={{ mt: 2, textAlign: "left" }}>
//               <Typography variant="h6">{index + 1}. {q.question}</Typography>
//               <Typography color={answers[q.id] === q.correct_option ? "green" : "red"}>
//                 Your Answer: {answers[q.id] || "Not Answered"}
//               </Typography>
//               <Typography color="blue">Correct Answer: {correct_ans.correct_option}</Typography>
//             </Box>
//           ))}

//           <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => navigate("/dashboard")}>
//             Back to Dashboard
//           </Button>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default QuizResults;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Box, Button, Card, CardContent, Typography, CircularProgress } from "@mui/material";

// const QuizResults = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [correctAnswers, setCorrectAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const { questions, answers, score } = location.state || {};

//   if (!questions || !answers) {
//     return <Typography variant="h5">No results found</Typography>;
//   }

//   useEffect(() => {
//     async function fetchCorrectAnswers() {
//       try {
//         const response = await axios.get(`http://localhost:5000/get-quiz/${localStorage.getItem("userEmail")}`);
//         const fetchedCorrectAnswers = response.data.reduce((acc, q) => {
//           acc[q.id] = q.correct_option; // Store correct options (A, B, C, D)
//           return acc;
//         }, {});
//         setCorrectAnswers(fetchedCorrectAnswers);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching correct answers:", error);
//         setLoading(false);
//       }
//     }
//     fetchCorrectAnswers();
//   }, []);

//   return (
//     <Box sx={{ p: 3, maxWidth: "800px", margin: "auto", textAlign: "center" }}>
//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <Card>
//           <CardContent>
//             <Typography variant="h4">Quiz Completed!</Typography>
//             <Typography variant="h6">Your Score: {score} / 50</Typography>
//             <Typography variant="body1" sx={{ mt: 2 }}>Review Your Answers:</Typography>

//             {questions.map((q, index) => {
//               const isCorrect = answers[q.id] === correctAnswers[q.id]; // Properly compare answers
//               return (
//                 <Box key={q.id} sx={{ mt: 2, textAlign: "left" }}>
//                   <Typography variant="h6">{index + 1}. {q.question}</Typography>
//                   <Typography color={isCorrect ? "green" : "red"}>
//                     Your Answer: {answers[q.id] || "Not Answered"}
//                   </Typography>
//                   <Typography color="blue">Correct Answer: {correctAnswers[q.id]}</Typography>
//                 </Box>
//               );
//             })}

//             <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => navigate("/dashboard")}>
//               Back to Dashboard
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </Box>
//   );
// };

// export default QuizResults;

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, answers, score } = location.state || {};

  if (!questions || !answers) {
    return <Typography variant="h5">No results found</Typography>;
  }

  return (
    <Box sx={{ p: 3, maxWidth: "800px", margin: "auto", textAlign: "center" }}>
      <Card>
        <CardContent>
          <Typography variant="h4">Quiz Completed!</Typography>
          <Typography variant="h6">Your Score: {score} / 50</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>Review Your Answers:</Typography>

          {questions.map((q, index) => {
            const isCorrect = answers[q.id] === q.correct_option; // Compare properly
            return (
              <Box key={q.id} sx={{ mt: 2, textAlign: "left" }}>
                <Typography variant="h6">{index + 1}. {q.question}</Typography>
                <Typography color={isCorrect ? "green" : "red"}>
                  Your Answer: {answers[q.id] || "Not Answered"}
                </Typography>
                <Typography color="blue">Correct Answer: {q.correct_option}</Typography>
              </Box>
            );
          })}

          <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default QuizResults;
