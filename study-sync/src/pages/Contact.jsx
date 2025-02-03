import React from "react";
import { Mail, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactForm = () => (
  <motion.div
    className="bg-gray-50 p-8 rounded-lg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
    <form className="space-y-6">
      <div>
        <label className="block text-gray-700 mb-2">Name</label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
          placeholder="Your email"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">Message</label>
        <textarea
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
          rows="4"
          placeholder="Your message"
        ></textarea>
      </div>
      <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
        Send Message
      </button>
    </form>
  </motion.div>
);

const ContactInfo = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <h2 className="text-2xl font-bold mb-6">Connect with us</h2>
    <div className="space-y-6">
      <div className="flex items-center">
        <Mail className="h-6 w-6 text-indigo-600 mr-4" />
        <div>
          <h3 className="font-semibold">Email</h3>
          <p className="text-gray-600">support@studysync.com</p>
        </div>
      </div>
      <div className="flex items-center">
        <Github className="h-6 w-6 text-indigo-600 mr-4" />
        <div>
          <h3 className="font-semibold">GitHub</h3>
          <p className="text-gray-600">github.com/studysync</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const FAQ = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <h2 className="text-2xl font-bold mb-6">FAQ</h2>
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">How does group matching work?</h3>
        <p className="text-gray-600">Our AI algorithm analyzes your learning style, goals, and schedule to find the perfect study partners.</p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Is StudySync free?</h3>
        <p className="text-gray-600">We offer both free and premium plans. Contact us to learn more about our pricing options.</p>
      </div>
    </div>
  </motion.div>
);

const Contact = () => {
  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Get in touch with our team for support or inquiries
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <ContactForm />
          <ContactInfo />
        </div>

        <div className="mt-12">
          <FAQ />
        </div>
      </div>
    </div>
  );
};

export default Contact;
