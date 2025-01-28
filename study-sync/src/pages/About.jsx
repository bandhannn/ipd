import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X, Book, Users, ChartBar, Mail, Github } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About StudySync</h1>
          <p className="text-xl text-gray-600">
            Revolutionizing collaborative learning through AI-powered solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              StudySync is committed to transforming the way students learn and collaborate. 
              By harnessing the power of artificial intelligence, we create dynamic learning 
              environments that adapt to each student's unique needs and goals.
            </p>
            <p className="text-gray-600">
              Our platform combines cutting-edge technology with proven educational 
              principles to deliver a personalized learning experience that helps 
              students achieve their academic potential.
            </p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Why Choose StudySync?</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-4">1</div>
                <span>AI-powered study group matching</span>
              </li>
              <li className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-4">2</div>
                <span>Dynamic progress tracking</span>
              </li>
              <li className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-4">3</div>
                <span>Automated resource summarization</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
