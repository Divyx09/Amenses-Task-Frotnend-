import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Users, Plus, X, Vote, ArrowLeft, Share2,
  Clock, MapPin, User, Star, Heart, MessageCircle,
  CheckCircle, AlertCircle, TrendingUp, BarChart3,
  Image as ImageIcon, Play, Download, ExternalLink
} from 'lucide-react';
import { eventsAPI, pollsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [eventPolls, setEventPolls] = useState([]);
  const [showPollForm, setShowPollForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [pollFormData, setPollFormData] = useState({
    question: '',
    options: ['', '']
  });

  useEffect(() => {
    if (id) {
      fetchEventDetails();
      fetchEventPolls();
    }
    if (user && id) {
      checkIfUserJoined();
    }
  }, [id, user]);

  const fetchEventDetails = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockEvent = {
        _id: id,
        title: 'AI & Machine Learning Conference 2025',
        description: 'Join us for an exciting conference on the latest trends in AI and Machine Learning. Connect with industry leaders, learn about cutting-edge technologies, and network with like-minded professionals.',
        longDescription: 'This comprehensive conference brings together AI researchers, data scientists, and technology leaders from around the world. Over two days, you\'ll experience keynote presentations from industry pioneers, hands-on workshops, and networking opportunities that will shape the future of artificial intelligence.\n\nWhat you\'ll learn:\n• Latest developments in machine learning algorithms\n• Real-world AI implementation strategies\n• Ethical considerations in AI development\n• Future trends and opportunities\n\nWho should attend:\n• Data Scientists and AI Engineers\n• Technology Leaders and CTOs\n• Product Managers working with AI\n• Researchers and Academics\n• Students interested in AI careers',
        date: '2025-10-15T09:00:00Z',
        endDate: '2025-10-16T18:00:00Z',
        location: 'San Francisco Convention Center',
        address: '747 Howard St, San Francisco, CA 94103',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        price: 299,
        currency: 'USD',
        capacity: 500,
        attendees: 247,
        rating: 4.8,
        reviews: 156,
        tags: ['AI', 'Machine Learning', 'Technology', 'Conference', 'Networking'],
        organizer: {
          _id: 'org1',
          name: 'Tech Events Inc.',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
          verified: true,
          eventsCount: 45,
          followers: 12500
        },
        speakers: [
          {
            id: 1,
            name: 'Dr. Sarah Chen',
            title: 'Lead AI Researcher at Google',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b302?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
            topic: 'The Future of Neural Networks'
          },
          {
            id: 2,
            name: 'Michael Rodriguez',
            title: 'CTO at OpenAI',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
            topic: 'Ethical AI Development'
          },
          {
            id: 3,
            name: 'Dr. Aisha Patel',
            title: 'Data Science Director at Microsoft',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
            topic: 'Implementing AI in Enterprise'
          }
        ],
        schedule: [
          {
            time: '09:00 AM',
            title: 'Registration & Breakfast',
            type: 'break'
          },
          {
            time: '10:00 AM',
            title: 'Opening Keynote: The Future of AI',
            speaker: 'Dr. Sarah Chen',
            type: 'keynote'
          },
          {
            time: '11:00 AM',
            title: 'Machine Learning in Production',
            speaker: 'Michael Rodriguez',
            type: 'session'
          },
          {
            time: '12:00 PM',
            title: 'Lunch & Networking',
            type: 'break'
          },
          {
            time: '01:30 PM',
            title: 'Workshop: Building AI Models',
            speaker: 'Dr. Aisha Patel',
            type: 'workshop'
          }
        ],
        participants: [
          { _id: 'user1', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' },
          { _id: 'user2', name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b302?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' }
        ],
        createdBy: {
          _id: 'creator1',
          name: 'Event Organizer',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80'
        }
      };
      
      setEvent(mockEvent);
      setJoined(mockEvent.participants?.some(p => p._id === user?.id));
    } catch (err) {
      setError('Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventPolls = async () => {
    try {
      const response = await pollsAPI.getByEvent(id);
      
      // If no polls from API, use mock data for demonstration
      if (response.data && response.data.length > 0) {
        setEventPolls(response.data);
      } else {
        // Mock polls data for demonstration
        const mockPolls = [
          {
            _id: 'poll1',
            question: 'Which AI topic interests you most?',
            options: [
              { text: 'Machine Learning', votes: ['user1', 'user2', 'user3'] },
              { text: 'Natural Language Processing', votes: ['user4', 'user5'] },
              { text: 'Computer Vision', votes: ['user6'] },
              { text: 'Robotics', votes: ['user7', 'user8'] }
            ],
            createdBy: 'creator1',
            createdAt: '2025-01-15T10:00:00Z',
            totalVotes: 8
          },
          {
            _id: 'poll2',
            question: 'What time works best for networking?',
            options: [
              { text: 'Lunch Break', votes: ['user1', 'user3', 'user5', 'user7'] },
              { text: 'After Sessions', votes: ['user2', 'user4'] },
              { text: 'Morning Coffee', votes: ['user6', 'user8', 'user9'] }
            ],
            createdBy: 'creator1',
            createdAt: '2025-01-15T11:00:00Z',
            totalVotes: 9
          }
        ];
        setEventPolls(mockPolls);
      }
    } catch (err) {
      console.error('Failed to fetch polls:', err);
      // Still show mock data on error for better UX
      const mockPolls = [
        {
          _id: 'poll1',
          question: 'Which AI topic interests you most?',
          options: [
            { text: 'Machine Learning', votes: ['user1', 'user2', 'user3'] },
            { text: 'Natural Language Processing', votes: ['user4', 'user5'] },
            { text: 'Computer Vision', votes: ['user6'] },
            { text: 'Robotics', votes: ['user7', 'user8'] }
          ],
          createdBy: 'creator1',
          createdAt: '2025-01-15T10:00:00Z',
          totalVotes: 8
        }
      ];
      setEventPolls(mockPolls);
    }
  };

  const checkIfUserJoined = async () => {
    if (!user || !id) return;
    
    try {
      const response = await eventsAPI.getJoined();
      const joinedEventIds = response.data.map(event => event._id);
      setJoined(joinedEventIds.includes(id));
    } catch (err) {
      console.error('Error checking joined status:', err);
      setJoined(false);
    }
  };

  const handleJoinEvent = async () => {
    if (!user) {
      alert('Please login to join events');
      return;
    }
    
    if (joined) {
      alert('You have already joined this event!');
      return;
    }
    
    try {
      const response = await eventsAPI.join(id);
      setJoined(true);
      setEvent(prev => ({
        ...prev,
        attendees: prev.attendees + 1
      }));
      
      alert('Successfully joined the event!');
    } catch (err) {
      console.error('Error joining event:', err);
      if (err.response?.status === 400 && err.response?.data?.message?.includes('already')) {
        alert('You have already joined this event!');
        setJoined(true);
      } else {
        alert('Failed to join event. Please try again.');
      }
      setError('Failed to join event');
    }
  };

  const handleCreatePoll = async () => {
    if (!user) {
      alert('Please login to create polls');
      return;
    }
    
    if (!pollFormData.question.trim()) {
      alert('Please enter a poll question');
      return;
    }
    
    const validOptions = pollFormData.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    try {
      const response = await pollsAPI.create({
        eventId: id,
        question: pollFormData.question,
        options: validOptions
      });
      
      // Add the new poll to the list
      const newPoll = {
        _id: response.data._id || `poll${Date.now()}`,
        question: pollFormData.question,
        options: validOptions.map(text => ({ text, votes: [] })),
        createdBy: user?.id,
        createdAt: new Date().toISOString(),
        totalVotes: 0
      };
      
      setEventPolls(prev => [newPoll, ...prev]);
      setPollFormData({ question: '', options: ['', ''] });
      setShowPollForm(false);
      alert('Poll created successfully!');
    } catch (err) {
      console.error('Error creating poll:', err);
      alert('Failed to create poll. Please try again.');
      setError('Failed to create poll');
    }
  };

  const addPollOption = () => {
    setPollFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removePollOption = (index) => {
    if (pollFormData.options.length > 2) {
      setPollFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePollOption = (index, value) => {
    setPollFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleVote = async (pollId, optionIndex) => {
    if (!user) {
      alert('Please login to vote');
      return;
    }
    
    try {
      await pollsAPI.vote(pollId, optionIndex);
      
      // Update local state
      setEventPolls(prev => prev.map(poll => {
        if (poll._id === pollId) {
          const updatedPoll = { ...poll };
          // Remove user from all options first
          updatedPoll.options = updatedPoll.options.map(option => ({
            ...option,
            votes: option.votes.filter(vote => vote !== user?.id)
          }));
          // Add user to selected option
          updatedPoll.options[optionIndex].votes.push(user?.id);
          // Calculate total votes
          updatedPoll.totalVotes = updatedPoll.options.reduce((total, option) => total + option.votes.length, 0);
          return updatedPoll;
        }
        return poll;
      }));
      
      alert('Vote submitted successfully!');
    } catch (err) {
      console.error('Error voting:', err);
      alert('Failed to submit vote. Please try again.');
      setError('Failed to vote');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Event not found</p>
          <button 
            onClick={() => navigate('/events')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Header Controls */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <button 
            onClick={() => navigate('/events')}
            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex space-x-3">
            <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors">
              <Heart size={24} />
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors">
              <Share2 size={24} />
            </button>
          </div>
        </div>

        {/* Event Title and Basic Info */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {event.category}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{event.rating} ({event.reviews} reviews)</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{event.attendees}/{event.capacity} attending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2">
            {/* Action Bar */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-blue-600">
                    ${event.price}
                    <span className="text-sm text-gray-500 font-normal"> / person</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {event.capacity - event.attendees} spots left
                  </div>
                </div>
                <div className="flex space-x-3 w-full sm:w-auto">
                  {!joined ? (
                    <button 
                      onClick={handleJoinEvent}
                      className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Users size={20} />
                      <span>Join Event</span>
                    </button>
                  ) : (
                    <div className="flex-1 sm:flex-none bg-green-100 text-green-800 px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2">
                      <CheckCircle size={20} />
                      <span>Joined</span>
                    </div>
                  )}
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors">
                    <MessageCircle size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="flex border-b">
                {[
                  { id: 'overview', label: 'Overview', icon: Calendar },
                  { id: 'schedule', label: 'Schedule', icon: Clock },
                  { id: 'speakers', label: 'Speakers', icon: Users },
                  { id: 'polls', label: 'Polls & Voting', icon: Vote }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-4 px-4 border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="hidden sm:inline font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Description */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold mb-4">About This Event</h3>
                      <div className="prose max-w-none text-gray-600">
                        {event.longDescription.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-4 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Event Tags */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold mb-4">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Gallery */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold mb-4">Event Gallery</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {event.gallery.map((image, index) => (
                          <div key={index} className="relative group cursor-pointer">
                            <img 
                              src={image} 
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <ImageIcon className="text-white" size={24} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-6">Event Schedule</h3>
                    <div className="space-y-4">
                      {event.schedule.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-lg">
                              {item.time}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            {item.speaker && (
                              <p className="text-sm text-gray-600 mt-1">Speaker: {item.speaker}</p>
                            )}
                            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                              item.type === 'keynote' ? 'bg-purple-100 text-purple-800' :
                              item.type === 'workshop' ? 'bg-green-100 text-green-800' :
                              item.type === 'break' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {item.type?.charAt(0).toUpperCase() + item.type.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'speakers' && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-6">Featured Speakers</h3>
                    <div className="grid gap-6">
                      {event.speakers.map((speaker) => (
                        <div key={speaker.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <img 
                            src={speaker.avatar} 
                            alt={speaker.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{speaker.name}</h4>
                            <p className="text-blue-600 text-sm">{speaker.title}</p>
                            <p className="text-gray-600 text-sm mt-1">{speaker.topic}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'polls' && (
                  <div className="space-y-6">
                    {/* Poll Creation */}
                    {(joined || event.createdBy._id === user?.id) && (
                      <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Event Polls</h3>
                          <button 
                            onClick={() => setShowPollForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors duration-200"
                          >
                            <Plus size={16} />
                            <span>Create Poll</span>
                          </button>
                        </div>

                        {/* Poll Creation Form */}
                        <AnimatePresence>
                          {showPollForm && (
                            <motion.div 
                              className="bg-gray-50 border rounded-lg p-4 mb-6"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <h5 className="font-medium text-gray-900 mb-4">Create New Poll</h5>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Poll Question
                                  </label>
                                  <input
                                    type="text"
                                    value={pollFormData.question}
                                    onChange={(e) => setPollFormData(prev => ({ ...prev, question: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="What would you like to ask?"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Options
                                  </label>
                                  <div className="space-y-2">
                                    {pollFormData.options.map((option, index) => (
                                      <div key={index} className="flex items-center space-x-2">
                                        <input
                                          type="text"
                                          value={option}
                                          onChange={(e) => updatePollOption(index, e.target.value)}
                                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                          placeholder={`Option ${index + 1}`}
                                        />
                                        {pollFormData.options.length > 2 && (
                                          <button
                                            onClick={() => removePollOption(index)}
                                            className="text-red-600 hover:text-red-800 p-1"
                                          >
                                            <X size={16} />
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                    {pollFormData.options.length < 6 && (
                                      <button
                                        onClick={addPollOption}
                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                                      >
                                        <Plus size={16} />
                                        <span>Add Option</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex justify-end space-x-3">
                                  <button 
                                    onClick={() => {
                                      setShowPollForm(false);
                                      setPollFormData({ question: '', options: ['', ''] });
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    onClick={handleCreatePoll}
                                    disabled={!pollFormData.question.trim() || pollFormData.options.filter(opt => opt.trim()).length < 2}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                                  >
                                    Create Poll
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Polls Display */}
                    <div className="space-y-4">
                      {eventPolls.length > 0 ? (
                        eventPolls.map((poll) => (
                          <div key={poll._id} className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-start justify-between mb-4">
                              <h5 className="font-medium text-gray-900 text-lg">{poll.question}</h5>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <TrendingUp size={16} />
                                <span>{poll.options.reduce((sum, opt) => sum + opt.votes.length, 0)} votes</span>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              {poll.options.map((option, index) => {
                                const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
                                const percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
                                const hasUserVoted = option.votes.includes(user?.id);
                                const canVote = joined || event.createdBy._id === user?.id;
                                
                                return (
                                  <button
                                    key={index}
                                    onClick={() => canVote && handleVote(poll._id, index)}
                                    disabled={!canVote}
                                    className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200 ${
                                      hasUserVoted 
                                        ? 'border-green-500 bg-green-50' 
                                        : canVote 
                                          ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer' 
                                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                    }`}
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="flex items-center space-x-2 font-medium">
                                        {hasUserVoted && <CheckCircle size={16} className="text-green-600" />}
                                        <span>{option.text}</span>
                                      </span>
                                      <div className="flex items-center space-x-3">
                                        <span className="text-sm font-semibold">{Math.round(percentage)}%</span>
                                        <span className="text-sm text-gray-500">{option.votes.length} votes</span>
                                      </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full transition-all duration-500 ${
                                          hasUserVoted ? 'bg-green-500' : 'bg-blue-600'
                                        }`}
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                            
                            <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
                              <span>Created {new Date(poll.createdAt).toLocaleDateString()}</span>
                              <span>Total votes: {poll.options.reduce((sum, opt) => sum + opt.votes.length, 0)}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                          <Vote size={48} className="mx-auto mb-4 text-gray-400" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No polls yet</h3>
                          <p className="text-gray-600 mb-6">Be the first to create a poll and engage with participants!</p>
                          {(joined || event.createdBy._id === user?.id) && (
                            <button 
                              onClick={() => setShowPollForm(true)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                            >
                              Create First Poll
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Organizer Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-4">Organized by</h3>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={event.organizer.avatar} 
                  alt={event.organizer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{event.organizer.name}</h4>
                    {event.organizer.verified && (
                      <CheckCircle size={16} className="text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{event.organizer.eventsCount} events</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{event.organizer.followers.toLocaleString()} followers</span>
                <span>Verified Organizer</span>
              </div>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors">
                View Profile
              </button>
            </div>

            {/* Event Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-4">Event Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Registered</span>
                  <span className="font-semibold">{event.attendees}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Capacity</span>
                  <span className="font-semibold">{event.capacity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Availability</span>
                  <span className="font-semibold text-green-600">
                    {Math.round(((event.capacity - event.attendees) / event.capacity) * 100)}% available
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Recent Participants */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-4">Recent Participants</h3>
              <div className="space-y-3">
                {event.participants.slice(0, 5).map((participant, index) => (
                  <div key={participant._id} className="flex items-center space-x-3">
                    <img 
                      src={participant.avatar} 
                      alt={participant.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-700">{participant.name}</span>
                  </div>
                ))}
                {event.attendees > 5 && (
                  <div className="text-sm text-gray-500 pt-2 border-t">
                    +{event.attendees - 5} more participants
                  </div>
                )}
              </div>
            </div>

            {/* Share Event */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-4">Share Event</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Share2 size={16} />
                  <span className="text-sm">Share</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  <Download size={16} />
                  <span className="text-sm">Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default EventDetails;
