import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X, Book, Users, ChartBar, Mail, Github } from 'lucide-react';
const Home = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform Your Learning Experience
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              AI-powered collaborative learning platform that adapts to your needs
            </p>
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100">
              Start Learning Today
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover what makes StudySync the perfect learning companion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Users className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Intelligent Matching</h3>
              <p className="text-gray-600">
                Get paired with study partners who share your academic goals and learning style
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <ChartBar className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your learning journey with detailed analytics and insights
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Book className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Resource Sharing</h3>
              <p className="text-gray-600">
                Access and share study materials seamlessly within your study groups
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
