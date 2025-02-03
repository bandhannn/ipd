import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ChartBar, Book } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="pt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform Your Learning Experience
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              AI-powered collaborative learning platform that adapts to your needs
            </p>
            <button
              className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100"
              onClick={() => navigate("/login")}
            >
              Start Learning Today
            </button>
          </div>
        </div>
      </div>

      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover what makes StudySync the perfect learning companion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-12 w-12 text-indigo-600 mb-4" />}
              title="Intelligent Matching"
              description="Get paired with study partners who share your academic goals and learning style."
            />
            <FeatureCard
              icon={<ChartBar className="h-12 w-12 text-indigo-600 mb-4" />}
              title="Progress Tracking"
              description="Monitor your learning journey with detailed analytics and insights."
            />
            <FeatureCard
              icon={<Book className="h-12 w-12 text-indigo-600 mb-4" />}
              title="Resource Sharing"
              description="Access and share study materials seamlessly within your study groups."
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {icon}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default Home;
