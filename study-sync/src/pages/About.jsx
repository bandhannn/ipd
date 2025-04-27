// import React from "react";
// import { motion } from "framer-motion";
// import { Book } from "lucide-react";

// const About = () => {
//   return (
//     <motion.div
//       className="pt-16"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="text-center mb-16">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">About StudySync</h1>
//           <p className="text-xl text-gray-600">
//             Revolutionizing collaborative learning through AI-powered solutions
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-12 items-center">
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//           >
//             <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
//             <p className="text-gray-600 mb-6">
//               StudySync is committed to transforming the way students learn and collaborate. 
//               By harnessing the power of artificial intelligence, we create dynamic learning 
//               environments that adapt to each student's unique needs and goals.
//             </p>
//             <p className="text-gray-600">
//               Our platform combines cutting-edge technology with proven educational 
//               principles to deliver a personalized learning experience that helps 
//               students achieve their academic potential.
//             </p>
//           </motion.div>
          
//           <motion.div
//             className="bg-gray-100 p-8 rounded-lg"
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//           >
//             <h3 className="text-2xl font-bold mb-4">Why Choose StudySync?</h3>
//             <ul className="space-y-4">
//               <li className="flex items-center">
//                 <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-4">1</div>
//                 <span>AI-powered study group matching</span>
//               </li>
//               <li className="flex items-center">
//                 <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-4">2</div>
//                 <span>Dynamic progress tracking</span>
//               </li>
//               <li className="flex items-center">
//                 <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-4">3</div>
//                 <span>Automated resource summarization</span>
//               </li>
//             </ul>
//           </motion.div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default About;

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Award, Compass, Brain, MessageSquare, FileText, Clock, Target, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";


const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.6 }
  };
  const navigate = useNavigate();
  const submit = ()=>{
    navigate('/login');
  }
  return (
    <motion.div
      className="pt-16 bg-gradient-to-b from-white to-blue-50"
      {...fadeIn}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section with Animated Gradient */}
        <motion.div 
          className="text-center mb-20 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-xl -z-10"></div>
          <motion.div 
            className="absolute inset-0 opacity-30 -z-10"
            animate={{ 
              background: [
                "radial-gradient(circle at 30% 30%, rgba(79, 70, 229, 0.4) 0%, transparent 70%)",
                "radial-gradient(circle at 70% 70%, rgba(79, 70, 229, 0.4) 0%, transparent 70%)"
              ],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <div className="p-12">
            <motion.h1 
              className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 mb-6"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              About StudySync
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-700 max-w-3xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Welcome to StudySync, the ultimate platform for collaborative learning and skill enhancement. 
              Whether you're a student or a knowledge seeker, StudySync helps you connect, learn, and grow with like-minded peers.
            </motion.p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* How It Works Section */}
          <motion.div
            className="bg-white rounded-xl shadow-xl p-8 border border-indigo-100"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mr-4">
                <Compass className="text-white w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
            </div>
            
            <div className="space-y-8">
              <motion.div 
                className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3 text-white font-bold">1</div>
                  <h3 className="text-2xl font-semibold text-indigo-700">Personalized Onboarding</h3>
                </div>
                <p className="text-gray-700 mb-3">When you sign up, you provide key details like:</p>
                <ul className="space-y-2 pl-4">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✅</span>
                    <span className="text-gray-600">College Name & Free Time Slots (to sync with group members)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✅</span>
                    <span className="text-gray-600">Preferred Domain (Mathematics, Physics, ML, etc.)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✅</span>
                    <span className="text-gray-600">Initial Rating of 1000 (everyone starts equally)</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white font-bold">2</div>
                  <h3 className="text-2xl font-semibold text-blue-700">Intelligent Group Formation</h3>
                </div>
                <p className="text-gray-700 mb-3">At the start, users with the same preferred domain and a 1000 rating are grouped together. Inside your group, you can:</p>
                <ul className="space-y-2 pl-4 mb-4">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">💬</span>
                    <span className="text-gray-600">Chat & collaborate</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">📂</span>
                    <span className="text-gray-600">Share documents</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">🤖</span>
                    <span className="text-gray-600">Use AI-powered one-tap document summarization</span>
                  </li>
                </ul>
                <p className="text-gray-700 italic border-l-2 border-blue-300 pl-3">
                  Additionally, StudySync detects the most common free time among group members, helping you coordinate discussions easily.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-white font-bold">3</div>
                  <h3 className="text-2xl font-semibold text-purple-700">Level Up with Quizzes</h3>
                </div>
                <ul className="space-y-2 pl-4">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">🔹</span>
                    <span className="text-gray-700">To increase your rating, take domain-specific quizzes.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">🔹</span>
                    <span className="text-gray-700">Each quiz has 10 questions, and each correct answer gives 5 points.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">🔹</span>
                    <span className="text-gray-700">A perfect score boosts your rating by 50 points!</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3 text-white font-bold">4</div>
                  <h3 className="text-2xl font-semibold text-indigo-700">Smart Group Reformation</h3>
                </div>
                <p className="flex items-start mb-3">
                  <span className="text-indigo-500 mr-2">📊</span>
                  <span className="text-gray-700 font-medium">Your group evolves as you grow!</span>
                </p>
                <div className="pl-6 space-y-3">
                  <p className="text-gray-600">When your rating crosses a threshold (1200, 1400, 1600, etc.), you are placed in a more advanced group with more knowledgeable peers.</p>
                  <p className="text-gray-600">Every weekend, StudySync re-evaluates groups based on performance. If you qualify for an advanced group, you'll be notified!</p>
                  <p className="text-gray-600">You can update your free time slots weekly to stay in sync with your new peers.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Why Choose StudySync Section */}
          <div className="space-y-12">
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl transform rotate-1 scale-105 -z-10"></div>
              <div className="bg-white p-10 rounded-xl shadow-xl">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mr-4">
                    <Award className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">Why Choose StudySync?</h3>
                </div>
                
                <ul className="space-y-6">
                  <motion.li 
                    className="flex p-4 bg-gradient-to-r from-indigo-50 to-white rounded-lg"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center mr-4 shadow-lg">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <span className="text-lg font-medium text-gray-800">🚀 Connect with like-minded learners</span>
                      <p className="text-gray-600 text-sm mt-1">Find your perfect study partners who share your interests and goals</p>
                    </div>
                  </motion.li>
                  
                  <motion.li 
                    className="flex p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mr-4 shadow-lg">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <span className="text-lg font-medium text-gray-800">📚 Access intelligent group formations</span>
                      <p className="text-gray-600 text-sm mt-1">Our algorithm matches you with the perfect study buddies</p>
                    </div>
                  </motion.li>
                  
                  <motion.li 
                    className="flex p-4 bg-gradient-to-r from-purple-50 to-white rounded-lg"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center mr-4 shadow-lg">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <span className="text-lg font-medium text-gray-800">🔍 AI-powered document summarization</span>
                      <p className="text-gray-600 text-sm mt-1">Save time with smart content analysis and highlighting</p>
                    </div>
                  </motion.li>
                  
                  <motion.li 
                    className="flex p-4 bg-gradient-to-r from-indigo-50 to-white rounded-lg"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center mr-4 shadow-lg">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <span className="text-lg font-medium text-gray-800">🧠 Challenge yourself with quizzes & grow</span>
                      <p className="text-gray-600 text-sm mt-1">Test your knowledge and track your improvement</p>
                    </div>
                  </motion.li>
                  
                  <motion.li 
                    className="flex p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mr-4 shadow-lg">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <span className="text-lg font-medium text-gray-800">🤝 Level up and learn with advanced peers</span>
                      <p className="text-gray-600 text-sm mt-1">As you improve, you'll join groups with more advanced learners</p>
                    </div>
                  </motion.li>
                </ul>
              </div>
            </motion.div>
            
            {/* Call to Action */}
            <motion.div
              className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 rounded-xl text-white text-center shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.4)" }}
            >
              <h3 className="text-2xl font-bold mb-4">Join StudySync Today</h3>
              <p className="text-indigo-100 mb-6">Experience the future of collaborative learning!</p>
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-medium hover:bg-indigo-50 transition duration-300 shadow-md" onClick={submit}>
                Get Started
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;

