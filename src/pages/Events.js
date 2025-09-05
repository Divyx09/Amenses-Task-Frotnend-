import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, Users, MapPin, Star, ArrowRight, Vote, Plus, X, FileEdit
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { eventsAPI, pollsAPI } from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [joinedEvents, setJoinedEvents] = useState(new Set());
  const [showPollModal, setShowPollModal] = useState(false);
  const [selectedEventForPoll, setSelectedEventForPoll] = useState(null);
  const [pollFormData, setPollFormData] = useState({
    question: '',
    options: ['', '']
  });
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    organizer: ''
  });
  
  const { user } = useAuth();

  const fetchJoinedEvents = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await eventsAPI.getJoined();
      const joinedEventIds = response.data.map(event => event._id);
      setJoinedEvents(new Set(joinedEventIds));
    } catch (err) {
      console.error('Error fetching joined events:', err);
      setJoinedEvents(new Set());
    }
  }, [user]);

  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchJoinedEvents();
    }
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [user, fetchJoinedEvents]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll();
      setEvents(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId) => {
    if (!user) {
      alert('Please login to join events');
      return;
    }
    
    if (joinedEvents.has(eventId)) {
      alert('You have already joined this event!');
      return;
    }
    
    try {
      await eventsAPI.join(eventId);
      setJoinedEvents(prev => new Set([...prev, eventId]));
      alert('Successfully joined the event!');
    } catch (err) {
      console.error('Error joining event:', err);
      if (err.response?.status === 400 && err.response?.data?.message?.includes('already')) {
        alert('You have already joined this event!');
        setJoinedEvents(prev => new Set([...prev, eventId]));
      } else {
        alert('Failed to join event. Please try again.');
      }
    }
  };

  const handleCreateEvent = async () => {
    if (!user) {
      alert('Please login to create events');
      return;
    }
    
    // Validate required fields
    if (!eventFormData.title.trim()) {
      alert('Please enter an event title');
      return;
    }
    
    if (!eventFormData.description.trim()) {
      alert('Please enter an event description');
      return;
    }
    
    if (!eventFormData.date) {
      alert('Please select an event date');
      return;
    }
    
    if (!eventFormData.time) {
      alert('Please select an event time');
      return;
    }
    
    try {
      await eventsAPI.create({
        title: eventFormData.title,
        description: eventFormData.description,
        date: eventFormData.date,
        time: eventFormData.time,
        location: eventFormData.location || 'Ujjain',
        category: eventFormData.category || 'General',
        organizer: eventFormData.organizer || user.name || 'Anonymous'
      });
      
      // Reset form
      setEventFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: '',
        organizer: ''
      });
      setShowCreateEventModal(false);
      alert('Event created successfully!');
      
      // Refresh events list
      fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event. Please try again.');
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
      await pollsAPI.create({
        eventId: selectedEventForPoll,
        question: pollFormData.question,
        options: validOptions
      });
      
      setPollFormData({ question: '', options: ['', ''] });
      setShowPollModal(false);
      setSelectedEventForPoll(null);
      alert('Poll created successfully!');
    } catch (err) {
      console.error('Error creating poll:', err);
      alert('Failed to create poll. Please try again.');
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

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '3px solid #f3f4f6',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }}></div>
          <p style={{ 
            marginTop: '24px', 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#374151' 
          }}>
            Loading amazing events...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#fafafa',
        padding: isMobile ? '24px 0' : '48px 0'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ 
          paddingTop: isMobile ? '6px' : '48px',
          paddingBottom: isMobile ? '6px' : '48px' 
        }}>
          {/* Header */}
          <div className="text-center" style={{ marginBottom: isMobile ? '32px' : '64px' }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 style={{
                fontSize: isMobile ? '36px' : '64px',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #2563eb, #9333ea, #ec4899)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '24px',
                lineHeight: '1.1'
              }}>
                Upcoming Events
              </h1>
              <p style={{
                fontSize: isMobile ? '18px' : '24px',
                color: '#6b7280',
                maxWidth: '896px',
                margin: '0 auto',
                lineHeight: '1.6',
                padding: isMobile ? '0 16px' : '0'
              }}>
                Discover amazing events and connect with like-minded professionals
              </p>
              <div className="mt-8 flex justify-center">
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"></div>
              </div>
              
              {/* Create Event Button */}
              {user && (
                <div className="mt-8">
                  <button
                    onClick={() => setShowCreateEventModal(true)}
                    style={{
                      background: 'linear-gradient(to right, #2563eb, #8b5cf6)',
                      color: 'white',
                      fontWeight: '600',
                      padding: '12px 32px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '16px',
                      boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                      margin: '0 auto'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
                    }}
                  >
                    <FileEdit style={{ height: '18px', width: '18px' }} />
                    <span>Create New Event</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Error Message */}
          <div style={{
            textAlign: 'center',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            padding: '40px',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: '#fef2f2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '1px solid #fecaca'
            }}>
              <Calendar style={{ height: '28px', width: '28px', color: '#dc2626' }} />
            </div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: '12px' 
            }}>
              Oops! Something went wrong
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>{error}</p>
            <button 
              onClick={fetchEvents}
              style={{
                background: '#3b82f6',
                color: 'white',
                fontWeight: '600',
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #2563eb',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
        
        {/* Create Event Modal - Include modals even in error state */}
        {showCreateEventModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflow: 'auto',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>Create New Event</h3>
                <button
                  onClick={() => {
                    setShowCreateEventModal(false);
                    setEventFormData({
                      title: '',
                      description: '',
                      date: '',
                      time: '',
                      location: '',
                      category: '',
                      organizer: ''
                    });
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    color: '#6b7280'
                  }}
                >
                  <X style={{ height: '24px', width: '24px' }} />
                </button>
              </div>

              {/* Event Form Fields */}
              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Title */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={eventFormData.title}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter event title"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Description *
                  </label>
                  <textarea
                    value={eventFormData.description}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your event"
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                {/* Date and Time Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Date *
                    </label>
                    <input
                      type="date"
                      value={eventFormData.date}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, date: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Time *
                    </label>
                    <input
                      type="time"
                      value={eventFormData.time}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, time: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>
                </div>

                {/* Location and Category Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Location
                    </label>
                    <input
                      type="text"
                      value={eventFormData.location}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Event location (default: Ujjain)"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Category
                    </label>
                    <select
                      value={eventFormData.category}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, category: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    >
                      <option value="">Select category</option>
                      <option value="Technology">Technology</option>
                      <option value="Business">Business</option>
                      <option value="Education">Education</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Sports">Sports</option>
                      <option value="Health">Health</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                {/* Organizer */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Organizer Name
                  </label>
                  <input
                    type="text"
                    value={eventFormData.organizer}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, organizer: e.target.value }))}
                    placeholder={`Your name (default: ${user?.name || 'Anonymous'})`}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px' }}>
                <button
                  onClick={() => {
                    setShowCreateEventModal(false);
                    setEventFormData({
                      title: '',
                      description: '',
                      date: '',
                      time: '',
                      location: '',
                      category: '',
                      organizer: ''
                    });
                  }}
                  style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  style={{
                    background: 'linear-gradient(to right, #2563eb, #8b5cf6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Create Event
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#fafafa',
      padding: isMobile ? '24px 0' : '48px 0'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ 
        paddingTop: isMobile ? '6px' : '48px',
        paddingBottom: isMobile ? '6px' : '48px' 
      }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: isMobile ? '32px' : '64px' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{
              fontSize: isMobile ? '36px' : '64px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #2563eb, #9333ea, #ec4899)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '24px',
              lineHeight: '1.1'
            }}>
              Upcoming Events
            </h1>
            <p style={{
              fontSize: isMobile ? '18px' : '24px',
              color: '#6b7280',
              maxWidth: '896px',
              margin: '0 auto',
              lineHeight: '1.6',
              padding: isMobile ? '0 16px' : '0'
            }}>
              Discover amazing events and connect with like-minded professionals
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"></div>
            </div>
            
            {/* Create Event Button */}
            {user && (
              <div className="mt-8">
                <button
                  onClick={() => setShowCreateEventModal(true)}
                  style={{
                    background: 'linear-gradient(to right, #2563eb, #8b5cf6)',
                    color: 'white',
                    fontWeight: '600',
                    padding: '12px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '16px',
                    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                    margin: '0 auto'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
                  }}
                >
                  <FileEdit style={{ height: '18px', width: '18px' }} />
                  <span>Create New Event</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
        {/* Events Cards Grid */}
        {events.length > 0 ? (
        <div 
          className="events-grid-responsive"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
            gap: isMobile ? '24px' : '32px'
          }}
        >
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                background: '#fefefe',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: 'translateY(0px)',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)';
              }}
            >
              {/* Image Section */}
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img
                  src={event.imageUrl || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800'}
                  alt={event.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800';
                  }}
                />
                
                {/* Category Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: '#ffffff',
                  color: '#374151',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  {event.category}
                </div>

                {/* Organizer Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#ffffff',
                  color: '#374151',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: '600',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  {event.organizer}
                </div>
              </div>

              {/* Content Section */}
              <div style={{ padding: '20px' }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '8px',
                  lineHeight: '1.3'
                }}>
                  {event.title}
                </h3>
                
                <p style={{
                  color: '#6b7280',
                  marginBottom: '16px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  overflow: 'hidden'
                }}>
                  {event.description}
                </p>

                {/* Event Details */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#6b7280',
                    marginBottom: '6px',
                    fontSize: '13px'
                  }}>
                    <Calendar style={{ height: '14px', width: '14px', color: '#9ca3af' }} />
                    <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#6b7280',
                    marginBottom: '6px',
                    fontSize: '13px'
                  }}>
                    <MapPin style={{ height: '14px', width: '14px', color: '#9ca3af' }} />
                    <span>{event.location || 'Ujjain'}</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#6b7280',
                    fontSize: '13px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users style={{ height: '14px', width: '14px', color: '#9ca3af' }} />
                      <span>{event.attendees} attendees</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star style={{ height: '14px', width: '14px', color: '#fbbf24', fill: '#fbbf24' }} />
                      <span style={{ fontWeight: '600', color: '#374151' }}>{event.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', flexDirection: isMobile ? 'column' : 'row' }}>
                  {/* Join Event Button */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleJoinEvent(event._id);
                    }}
                    style={{
                      flex: 1,
                      background: joinedEvents.has(event._id) ? '#10b981' : '#3b82f6',
                      color: 'white',
                      fontWeight: '600',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => {
                      if (!joinedEvents.has(event._id)) {
                        e.target.style.background = '#2563eb';
                      }
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = joinedEvents.has(event._id) ? '#10b981' : '#3b82f6';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <span>{joinedEvents.has(event._id) ? 'Joined' : 'Join Event'}</span>
                    {!joinedEvents.has(event._id) && <ArrowRight style={{ height: '16px', width: '16px' }} />}
                  </button>

                  {/* Create Poll Button */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedEventForPoll(event._id);
                      setShowPollModal(true);
                    }}
                    style={{
                      flex: isMobile ? 1 : 'auto',
                      background: '#8b5cf6',
                      color: 'white',
                      fontWeight: '600',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      minWidth: isMobile ? 'auto' : '120px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#7c3aed';
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#8b5cf6';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <Vote style={{ height: '16px', width: '16px' }} />
                    <span>Poll</span>
                  </button>

                  {/* View Details Button */}
                  <Link to={`/events/${event._id}`} style={{ display: 'block', flex: isMobile ? 1 : 'auto' }}>
                    <button style={{
                      width: '100%',
                      background: '#6b7280',
                      color: 'white',
                      fontWeight: '600',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      minWidth: isMobile ? 'auto' : '100px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#4b5563';
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#6b7280';
                      e.target.style.transform = 'scale(1)';
                    }}
                    >
                      <span>Details</span>
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Calendar className="h-16 w-16 text-white" />
            </div>
            <h3 className="text-4xl font-bold text-gray-800 mb-4">No Events Available</h3>
            <p className="text-xl text-gray-600 mb-8">Check back later for exciting upcoming events.</p>
          </div>
        )}
      </div>

      {/* Poll Creation Modal */}
      {showPollModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>Create Poll</h3>
              <button
                onClick={() => {
                  setShowPollModal(false);
                  setPollFormData({ question: '', options: ['', ''] });
                  setSelectedEventForPoll(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  color: '#6b7280'
                }}
              >
                <X style={{ height: '24px', width: '24px' }} />
              </button>
            </div>

            {/* Poll Question */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Poll Question
              </label>
              <input
                type="text"
                value={pollFormData.question}
                onChange={(e) => setPollFormData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="What would you like to ask?"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Poll Options */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Poll Options
              </label>
              {pollFormData.options.map((option, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                  {pollFormData.options.length > 2 && (
                    <button
                      onClick={() => removePollOption(index)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <X style={{ height: '16px', width: '16px' }} />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={addPollOption}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px dashed #9ca3af',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                <Plus style={{ height: '16px', width: '16px' }} />
                Add Option
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowPollModal(false);
                  setPollFormData({ question: '', options: ['', ''] });
                  setSelectedEventForPoll(null);
                }}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePoll}
                style={{
                  background: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Create Poll
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateEventModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>Create New Event</h3>
              <button
                onClick={() => {
                  setShowCreateEventModal(false);
                  setEventFormData({
                    title: '',
                    description: '',
                    date: '',
                    time: '',
                    location: '',
                    category: '',
                    organizer: ''
                  });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  color: '#6b7280'
                }}
              >
                <X style={{ height: '24px', width: '24px' }} />
              </button>
            </div>

            {/* Event Form Fields */}
            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Event Title *
                </label>
                <input
                  type="text"
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Description *
                </label>
                <textarea
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your event"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Date and Time Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={eventFormData.date}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, date: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Time *
                  </label>
                  <input
                    type="time"
                    value={eventFormData.time}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, time: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>

              {/* Location and Category Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Event location (default: Ujjain)"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Category
                  </label>
                  <select
                    value={eventFormData.category}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, category: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  >
                    <option value="">Select category</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Sports">Sports</option>
                    <option value="Health">Health</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              {/* Organizer */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Organizer Name
                </label>
                <input
                  type="text"
                  value={eventFormData.organizer}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, organizer: e.target.value }))}
                  placeholder={`Your name (default: ${user?.name || 'Anonymous'})`}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px' }}>
              <button
                onClick={() => {
                  setShowCreateEventModal(false);
                  setEventFormData({
                    title: '',
                    description: '',
                    date: '',
                    time: '',
                    location: '',
                    category: '',
                    organizer: ''
                  });
                }}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                style={{
                  background: 'linear-gradient(to right, #2563eb, #8b5cf6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Create Event
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Events;
