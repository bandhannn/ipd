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

const App = () => {
  const location = useLocation(); // Get the current location (path)

  const isProfilePage = location.pathname === '/profile'; 

  return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Navbar remains the same */}
        {!isProfilePage && <Navbar />}

        {/* Define routes here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path="/groups/:groupId" element={<Chatpage />} />
        </Routes>

        {/* Footer remains the same */}
        {!isProfilePage && <Footer />}
      </div>
    
  );
};

export default App;
