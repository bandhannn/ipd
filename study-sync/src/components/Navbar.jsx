import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X, Book, Users, ChartBar, Mail, Github, User, Lock } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Book className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-800">StudySync</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-indigo-600">About</Link>
            <Link to="/features" className="text-gray-600 hover:text-indigo-600">Features</Link>
            <Link to="/contact" className="text-gray-600 hover:text-indigo-600">Contact</Link>
            <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
            <Link to="/signup">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700">
                Sign Up
              </button>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            <Link to="/" className="block py-2 text-gray-600 hover:text-indigo-600">Home</Link>
            <Link to="/about" className="block py-2 text-gray-600 hover:text-indigo-600">About</Link>
            <Link to="/features" className="block py-2 text-gray-600 hover:text-indigo-600">Features</Link>
            <Link to="/contact" className="block py-2 text-gray-600 hover:text-indigo-600">Contact</Link>
            <Link to="/login" className="block py-2 text-gray-600 hover:text-indigo-600">Login</Link>
            <Link to="/signup" className="block py-2 text-gray-600 hover:text-indigo-600">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;