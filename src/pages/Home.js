import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, Users, Vote, Zap, ArrowRight, Star,
  MapPin, Clock, Heart, Globe, TrendingUp, Award, 
  Facebook, Twitter, Instagram, Mail, Phone, MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/api';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      // Get the latest 3 events for featured section
      setFeaturedEvents(response.data.slice(0, 3));
    } catch (err) {
      console.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const defaultEventImage = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=250&fit=crop&crop=center";
  
  const getEventImage = (event) => {
    if (event.image) return event.image;
    // Different default images based on category or random
    const defaultImages = [
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=250&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=400&h=250&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=250&fit=crop&crop=center"
    ];
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  };

  const features = [
    {
      icon: Calendar,
      title: 'Smart Event Management',
      description: 'Create, schedule, and manage events with our intuitive interface. Never miss an important date again.',
      color: 'text-blue-500'
    },
    {
      icon: Vote,
      title: 'Real-time Polling',
      description: 'Engage your audience with interactive polls and get instant feedback from participants.',
      color: 'text-green-500'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team members and participants in real-time.',
      color: 'text-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'Analytics & Insights',
      description: 'Get detailed analytics on event performance and participant engagement.',
      color: 'text-orange-500'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with people worldwide and host virtual or hybrid events effortlessly.',
      color: 'text-indigo-500'
    },
    {
      icon: Award,
      title: 'Recognition System',
      description: 'Reward active participants and build a community around your events.',
      color: 'text-pink-500'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Events Created', icon: Calendar },
    { number: '150K+', label: 'Active Users', icon: Users },
    { number: '500K+', label: 'Polls Conducted', icon: Vote },
    { number: '99.9%', label: 'Uptime', icon: TrendingUp }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Event Manager",
      company: "TechCorp",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b932?w=100&h=100&fit=crop&crop=face",
      content: "Amenses has revolutionized how we manage our corporate events. The polling feature is a game-changer!"
    },
    {
      name: "Michael Chen",
      role: "Community Leader",
      company: "Local Hub",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      content: "The collaboration tools make it so easy to organize community events. Our engagement has increased by 300%!"
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      company: "StartupXYZ",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      content: "Beautiful interface, powerful features. Our team productivity has never been better!"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24">
        <motion.div
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              className="flex justify-center mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="relative">
                <Zap size={80} className="text-primary-500 floating" />
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Transform Your Events with{' '}
              <span className="text-primary-600">Smart Collaboration</span>
            </motion.h1>

            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Create engaging events, conduct real-time polls, and collaborate seamlessly with your team. 
              The future of event management is here.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {isAuthenticated ? (
                // Buttons for authenticated users
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/events" className="btn btn-primary text-lg px-8 py-4">
                      <Calendar size={20} />
                      My Events
                      <ArrowRight size={20} />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/events" className="btn btn-outline text-lg px-8 py-4">
                      <Vote size={20} />
                      Create Event
                    </Link>
                  </motion.div>
                </>
              ) : (
                // Buttons for non-authenticated users
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/register" className="btn btn-primary text-lg px-8 py-4">
                      <Users size={20} />
                      Get Started Free
                      <ArrowRight size={20} />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/login" className="btn btn-outline text-lg px-8 py-4">
                      Sign In
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <stat.icon size={28} className="text-primary-600" />
                  </div>
                </div>
                <motion.span
                  className="block text-3xl font-extrabold text-gray-900 mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3, delay: index * 0.5 }}
                >
                  {stat.number}
                </motion.span>
                <span className="text-gray-600 font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Featured Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing events happening around the world
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center">
              <div className="spinner" />
            </div>
          ) : (
            <div className="grid grid-3 max-w-6xl mx-auto">
              {featuredEvents.length > 0 ? (
                featuredEvents.map((event, index) => (
                  <motion.div
                    key={event._id}
                    className="card card-hover overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.2, duration: 0.8 }}
                    whileHover={{ y: -10 }}
                  >
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                      <img
                        src={getEventImage(event)}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          e.target.src = defaultEventImage;
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="badge badge-primary">{event.category || 'General'}</span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Heart size={20} className="text-white/80 hover:text-red-500 cursor-pointer" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      {event.date && (
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {event.participants?.length || 0} joined
                        </span>
                      </div>
                      <motion.button
                        className="btn btn-outline btn-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Learn More
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No events available yet. Be the first to create one!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Powerful Features for Modern Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, manage, and analyze successful events
            </p>
          </motion.div>

          <div className="grid grid-3 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card card-hover text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + index * 0.1, duration: 0.8 }}
                whileHover={{ y: -10 }}
              >
                <motion.div
                  className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center ${feature.color}`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon size={32} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by thousands of event organizers worldwide
            </p>
          </motion.div>

          <div className="grid grid-3 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="card card-hover"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.7 + index * 0.2, duration: 0.8 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.8 }}
          >
            <h2 className="text-3xl font-extrabold mb-4">
              {isAuthenticated ? "Ready to Create Your Next Event?" : "Ready to Transform Your Events?"}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              {isAuthenticated 
                ? "You're all set! Start creating amazing events and engaging with your audience through interactive polls."
                : "Join thousands of users who are already creating amazing events with Amenses. Start your journey today and see the difference."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                // CTA for authenticated users
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/events" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg">
                      <Calendar size={20} />
                      Create Event
                      <ArrowRight size={20} />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/events" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg">
                      <Vote size={20} />
                      View All Events
                    </Link>
                  </motion.div>
                </>
              ) : (
                // CTA for non-authenticated users
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg">
                      Get Started Free
                      <ArrowRight size={20} />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <button className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg">
                      <MessageCircle size={20} />
                      Contact Sales
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={32} className="text-primary-500" />
                <span className="text-2xl font-bold">Amenses</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Transform your events with smart collaboration tools. 
                Create, manage, and engage like never before.
              </p>
              <div className="flex gap-4">
                <Facebook size={24} className="text-gray-400 hover:text-white cursor-pointer" />
                <Twitter size={24} className="text-gray-400 hover:text-white cursor-pointer" />
                <Instagram size={24} className="text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white">Features</button></li>
                <li><button className="hover:text-white">Pricing</button></li>
                <li><button className="hover:text-white">API</button></li>
                <li><button className="hover:text-white">Documentation</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>support@amenses.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li><button className="hover:text-white">Help Center</button></li>
                <li><button className="hover:text-white">Community</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Amenses. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
