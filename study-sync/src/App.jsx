// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import Login from "./Login";
// import Signup from "./Signup";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";

// function App() {
//   return (
//     <Router>
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//         <h1 className="text-4xl font-bold text-gray-800 mb-6">StudySync</h1>
//         <div className="space-x-4">
//           <Link to="/login">
//             <button className="px-6 py-2 bg-blue-500 text-blue rounded hover:bg-blue-600">
//               Login
//             </button>
//           </Link>
//           <Link to="/signup">
//             <button className="px-6 py-2 bg-green-500 text-blue rounded hover:bg-green-600">
//               Sign Up
//             </button>
//           </Link>
//         </div>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./Login";
import Signup from "./Signup";
import Navbar from "./components/Navbar";
import Footer from './components/Footer'
import Features from "./pages/Features";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};
export default App;

