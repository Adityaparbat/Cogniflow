'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  BookOpen, 
  Trophy, 
  MessageCircle, 
  Target, 
  Star, 
  Zap, 
  Play,
  Users,
  Award,
  Lightbulb,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Learning",
      description: "Engage with quizzes, flashcards, and AI-powered tutoring"
    },
    {
      icon: Trophy,
      title: "Gamified Experience",
      description: "Earn points, badges, and compete with friends"
    },
    {
      icon: MessageCircle,
      title: "AI Assistant",
      description: "Get instant help from our offline AI tutor"
    },
    {
      icon: Play,
      title: "Educational Games",
      description: "Learn through fun games and competitions"
    },
    {
      icon: Target,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics"
    },
    {
      icon: Zap,
      title: "Offline First",
      description: "Works completely offline - no internet required"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="CogniFlow Logo" 
                  width={40} 
                  height={40}
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">CogniFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login"
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/signup"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                Transform Learning into
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}Adventure
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl mx-auto">
                CogniFlow combines AI-powered tutoring, gamified learning, and offline functionality 
                to create the ultimate educational experience for students.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/signup"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Start Learning Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/login"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 transition-colors"
                >
                  Already have an account?
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose CogniFlow?
            </h2>
            <p className="text-xl text-gray-800 max-w-2xl mx-auto">
              Our platform offers everything you need for an engaging and effective learning experience.
            </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
                  <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                    </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-800">
                  {feature.description}
                </p>
                  </motion.div>
                ))}
              </div>
            </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who are already learning smarter with CogniFlow.
          </p>
          <Link 
            href="/signup"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Image 
                    src="/logo.png" 
                    alt="CogniFlow Logo" 
                    width={32} 
                    height={32}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold">CogniFlow</h3>
              </div>
              <p className="text-gray-400">
                Making learning fun, interactive, and accessible for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>AI Tutor</li>
                <li>Quizzes & Flashcards</li>
                <li>Educational Games</li>
                <li>Progress Tracking</li>
                </ul>
            </div>
                  <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                    </ul>
                  </div>
                  <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Partners</li>
                    </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CogniFlow. All rights reserved.</p>
          </div>
      </div>
      </footer>
    </div>
  );
}
