import React from 'react';
import { BrowserRouter as Router, Routes, Route,useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Features from './pages/Features';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/Dashboard';
import Chatpage from './pages/Chatpage';
import Quizpage from './pages/Quizpage';
import QuizResults from './pages/QuizResults';

const App = () => {
  const location = useLocation(); // Get the current location (path)

  const isProfilePage = location.pathname === '/profile'; 
  const isDashboard = location.pathname === '/dashboard'; 
  const isChatpage = location.pathname === '/chat';
  const isQuizpage = location.pathname === '/quizzes';
  const isQuizresult = location.pathname === '/quiz-results';

  return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Navbar remains the same */}
        {!(isProfilePage || isDashboard || isChatpage || isQuizpage || isQuizresult) && <Navbar />}

        {/* Define routes here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<Dashboard />}>
            {/* <Route path="profile" element={<Profile />} /> */}
            {/* <Route path="chat" element={<Chatpage />} /> */}
          </Route>
        <Route path="/chat" element={<Chatpage  />} />
        <Route path="/quizzes" element={<Quizpage  />} />
        <Route path="/quiz-results" element={<QuizResults  />} />
        </Routes>
        
        {/* Footer remains the same */}
        {!(isProfilePage || isDashboard || isChatpage || isQuizpage || isQuizresult) && <Footer />}
      </div>
    
  );
};

export default App;
