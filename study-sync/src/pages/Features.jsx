import React from 'react';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  Brain, 
  BarChart2, 
  MessageCircle,
  Zap,
  Clock,
  Target,
  Award
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
      <Icon className="h-6 w-6 text-indigo-600" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StatCard = ({ number, label }) => (
  <div className="bg-white p-6 rounded-lg shadow text-center">
    <div className="text-3xl font-bold text-indigo-600 mb-2">{number}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: Users,
      title: "AI-Powered Group Matching",
      description: "Our intelligent algorithm pairs you with study partners who share your academic goals and learning style."
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Automatically sync study sessions with your calendar and find the perfect time for group meetings."
    },
    {
      icon: BookOpen,
      title: "Resource Management",
      description: "Centralized platform for sharing and organizing study materials, notes, and resources."
    },
    {
      icon: Brain,
      title: "Adaptive Learning",
      description: "Personalized study plans that adapt to your progress and learning patterns."
    },
    {
      icon: BarChart2,
      title: "Progress Analytics",
      description: "Detailed insights and analytics to track your academic growth and identify areas for improvement."
    },
    {
      icon: MessageCircle,
      title: "Collaborative Tools",
      description: "Built-in communication tools for seamless group discussions and knowledge sharing."
    }
  ];

  return (
    <div className="pt-16 bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">
              Features that Empower Your Learning
            </h1>
            <p className="text-xl mb-8">
              Discover how StudySync revolutionizes collaborative learning
            </p>
          </div>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              StudySync by the Numbers
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard number="10k+" label="Active Users" />
            <StatCard number="95%" label="Success Rate" />
            <StatCard number="50+" label="Universities" />
            <StatCard number="24/7" label="Support" />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              How StudySync Works
            </h2>
            <p className="text-xl text-gray-600 mt-4">
              Four simple steps to transform your learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mx-auto mb-4">
                <Target className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Set Your Goals</h3>
              <p className="text-gray-600">Define your academic objectives and learning preferences</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mx-auto mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Matched</h3>
              <p className="text-gray-600">AI pairs you with compatible study partners</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mx-auto mb-4">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Schedule Sessions</h3>
              <p className="text-gray-600">Automatically find the best time for group study</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mx-auto mb-4">
                <Award className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your improvement with detailed analytics</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of students already using StudySync
          </p>
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default Features;