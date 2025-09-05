import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Users, Plus, X, Vote, BarChart3, 
  Clock, MapPin, User, ChevronRight, PlusCircle
} from 'lucide-react';
import { eventsAPI, pollsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventPolls, setEventPolls] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPollForm, setShowPollForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: ''
  });

  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', '']
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await eventsAPI.create(newEvent);
      setEvents([response.data, ...events]);
      setNewEvent({ title: '', description: '', date: '', location: '', category: '' });
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create event');
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      await eventsAPI.join(eventId);
      fetchEvents();
    } catch (err) {
      setError('Failed to join event');
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;
    
    try {
      const pollData = {
        eventId: selectedEvent._id,
        question: newPoll.question,
        options: newPoll.options.filter(option => option.trim() !== '').map(option => ({ text: option, votes: [] }))
      };
      
      await pollsAPI.create(pollData);
      
      setNewPoll({ question: '', options: ['', ''] });
      setShowPollForm(false);
      // Refresh polls for this event
      fetchEventPolls(selectedEvent._id);
    } catch (err) {
      setError('Failed to create poll');
    }
  };

  const fetchEventPolls = async (eventId) => {
    try {
      const response = await pollsAPI.getByEvent(eventId);
      setEventPolls(response.data);
    } catch (err) {
      console.error('Failed to fetch polls:', err);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      await pollsAPI.vote(pollId, optionIndex);
      // Refresh polls to show updated votes
      fetchEventPolls(selectedEvent._id);
    } catch (err) {
      setError('Failed to vote');
    }
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    fetchEventPolls(event._id);
  };

  const addPollOption = () => {
    setNewPoll({
      ...newPoll,
      options: [...newPoll.options, '']
    });
  };

  const updatePollOption = (index, value) => {
    const updatedOptions = [...newPoll.options];
    updatedOptions[index] = value;
    setNewPoll({
      ...newPoll,
      options: updatedOptions
    });
  };

  const removePollOption = (index) => {
    if (newPoll.options.length > 2) {
      const updatedOptions = newPoll.options.filter((_, i) => i !== index);
      setNewPoll({
        ...newPoll,
        options: updatedOptions
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-gray-600">Discover and join amazing events</p>
          </div>
          <motion.button 
            onClick={() => setShowCreateForm(true)}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            <span>Create Event</span>
          </motion.button>
        </div>

        {error && (
          <motion.div 
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Create Event Modal */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Create New Event</h3>
                  <button 
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={newEvent.category}
                        onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Conference, Workshop, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="City, Online, etc."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button 
                      type="submit" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
                    >
                      Create Event
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </AnimatePresence>

        {/* Event Details Modal with Polls */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h3>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                {/* Event Details */}
                <div className="space-y-4 mb-6">
                  {selectedEvent.description && (
                    <p className="text-gray-600">{selectedEvent.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {selectedEvent.date && (
                      <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>{new Date(selectedEvent.date).toLocaleDateString()} at {new Date(selectedEvent.date).toLocaleTimeString()}</span>
                      </div>
                    )}
                    {selectedEvent.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin size={16} />
                        <span>{selectedEvent.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>{selectedEvent.participants?.length || 0} participants</span>
                    </div>
                  </div>
                </div>
                
                {/* Polls Section */}
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold flex items-center space-x-2">
                      <Vote size={20} />
                      <span>Polls</span>
                    </h4>
                    {(selectedEvent.createdBy?._id === user?.id || selectedEvent.participants?.some(p => p._id === user?.id)) && (
                      <button 
                        onClick={() => setShowPollForm(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                      >
                        <PlusCircle size={16} />
                        <span>Create Poll</span>
                      </button>
                    )}
                  </div>
                  
                  {/* Poll Creation Form */}
                  {showPollForm && (
                    <motion.div 
                      className="bg-gray-50 rounded-lg p-4 mb-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <form onSubmit={handleCreatePoll} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Poll Question</label>
                          <input
                            type="text"
                            value={newPoll.question}
                            onChange={(e) => setNewPoll({...newPoll, question: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="What would you like to ask?"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                          {newPoll.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updatePollOption(index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={`Option ${index + 1}`}
                                required
                              />
                              {newPoll.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removePollOption(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X size={20} />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addPollOption}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            + Add Option
                          </button>
                        </div>
                        
                        <div className="flex space-x-3">
                          <button 
                            type="submit" 
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium"
                          >
                            Create Poll
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setShowPollForm(false)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                  
                  {/* Polls Display */}
                  <div className="space-y-4">
                    {eventPolls.length > 0 ? (
                      eventPolls.map((poll) => (
                        <div key={poll._id} className="bg-white border rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-3">{poll.question}</h5>
                          <div className="space-y-2">
                            {poll.options.map((option, index) => {
                              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
                              const percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
                              const hasUserVoted = option.votes.some(vote => vote.toString() === user?.id);
                              const canVote = selectedEvent.participants?.some(p => p._id === user?.id) || selectedEvent.createdBy?._id === user?.id;
                              
                              return (
                                <button
                                  key={index}
                                  onClick={() => canVote && handleVote(poll._id, index)}
                                  disabled={!canVote}
                                  className={`w-full text-left p-3 border rounded-md transition-all duration-200 ${
                                    hasUserVoted 
                                      ? 'border-green-500 bg-green-50' 
                                      : canVote 
                                        ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer' 
                                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="flex items-center space-x-2">
                                      {hasUserVoted && <span className="text-green-600">✓</span>}
                                      <span>{option.text}</span>
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <div className="w-16 bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                                          style={{ width: `${percentage}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-sm text-gray-500">{option.votes.length}</span>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-3 text-sm text-gray-500">
                            Total votes: {poll.options.reduce((sum, opt) => sum + opt.votes.length, 0)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Vote size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No polls yet. Create one to engage participants!</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <motion.div 
              key={event._id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  {event.category && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium mb-2">
                      {event.category}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users size={16} className="mr-1" />
                  {event.participants?.length || 0}
                </div>
              </div>
              
              {event.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
              )}
              
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                {event.date && (
                  <div className="flex items-center">
                    <Clock size={14} className="mr-2" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-2" />
                    {event.location}
                  </div>
                )}
                <div className="flex items-center">
                  <User size={14} className="mr-2" />
                  {event.createdBy?.name || 'Unknown'}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setSelectedEvent(event)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center space-x-1"
                >
                  <span>View Details</span>
                  <ChevronRight size={16} />
                </button>
                
                {event.createdBy?._id !== user?.id && 
                 !event.participants?.some(p => p._id === user?.id) && (
                  <button 
                    onClick={() => handleJoinEvent(event._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Join Event
                  </button>
                )}
                
                {event.participants?.some(p => p._id === user?.id) && (
                  <span className="text-green-600 font-medium text-sm flex items-center space-x-1">
                    <span>✓ Joined</span>
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-600 mb-6">Be the first to create an amazing event!</p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Create First Event
            </button>
          </motion.div>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">{selectedEvent.title}</h3>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                {/* Event Details */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Event Information</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        {selectedEvent.date && (
                          <div className="flex items-center">
                            <Clock size={16} className="mr-2" />
                            {new Date(selectedEvent.date).toLocaleDateString()}
                          </div>
                        )}
                        {selectedEvent.location && (
                          <div className="flex items-center">
                            <MapPin size={16} className="mr-2" />
                            {selectedEvent.location}
                          </div>
                        )}
                        <div className="flex items-center">
                          <User size={16} className="mr-2" />
                          Organized by {selectedEvent.createdBy?.name || 'Unknown'}
                        </div>
                        <div className="flex items-center">
                          <Users size={16} className="mr-2" />
                          {selectedEvent.participants?.length || 0} participants
                        </div>
                      </div>
                    </div>
                    
                    {selectedEvent.description && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Description</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {selectedEvent.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Participants */}
                  {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Participants</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.participants.map((participant) => (
                          <span 
                            key={participant._id} 
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {participant.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Polls Section */}
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                      <Vote size={20} />
                      <span>Event Polls</span>
                    </h4>
                    
                    {(selectedEvent.createdBy?._id === user?.id || selectedEvent.participants?.some(p => p._id === user?.id)) && (
                      <button 
                        onClick={() => setShowPollForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200"
                      >
                        <Plus size={16} />
                        <span>Create Poll</span>
                      </button>
                    )}
                  </div>

                  {/* Poll Creation Form */}
                  {showPollForm && (
                    <motion.div 
                      className="bg-gray-50 border rounded-lg p-4 mb-6"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
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
                                  onChange={(e) => {
                                    const newOptions = [...pollFormData.options];
                                    newOptions[index] = e.target.value;
                                    setPollFormData(prev => ({ ...prev, options: newOptions }));
                                  }}
                                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder={`Option ${index + 1}`}
                                />
                                {pollFormData.options.length > 2 && (
                                  <button
                                    onClick={() => {
                                      const newOptions = pollFormData.options.filter((_, i) => i !== index);
                                      setPollFormData(prev => ({ ...prev, options: newOptions }));
                                    }}
                                    className="text-red-600 hover:text-red-800 p-1"
                                  >
                                    <X size={16} />
                                  </button>
                                )}
                              </div>
                            ))}
                            {pollFormData.options.length < 6 && (
                              <button
                                onClick={() => setPollFormData(prev => ({ ...prev, options: [...prev.options, ''] }))}
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

                  {/* Polls Display */}
                  <div className="space-y-4">
                    {eventPolls.length > 0 ? (
                      eventPolls.map((poll) => (
                        <div key={poll._id} className="bg-white border rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-3">{poll.question}</h5>
                          <div className="space-y-2">
                            {poll.options.map((option, index) => {
                              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
                              const percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
                              const hasUserVoted = option.votes.some(vote => vote.toString() === user?.id);
                              const canVote = selectedEvent.participants?.some(p => p._id === user?.id) || selectedEvent.createdBy?._id === user?.id;
                              
                              return (
                                <button
                                  key={index}
                                  onClick={() => canVote && handleVote(poll._id, index)}
                                  disabled={!canVote}
                                  className={`w-full text-left p-3 border rounded-md transition-all duration-200 ${
                                    hasUserVoted 
                                      ? 'border-green-500 bg-green-50' 
                                      : canVote 
                                        ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer' 
                                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="flex items-center space-x-2">
                                      {hasUserVoted && <span className="text-green-600">✓</span>}
                                      <span>{option.text}</span>
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <div className="w-16 bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                                          style={{ width: `${percentage}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-sm text-gray-500">{option.votes.length}</span>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-3 text-sm text-gray-500">
                            Total votes: {poll.options.reduce((sum, opt) => sum + opt.votes.length, 0)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Vote size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No polls yet. Create one to engage participants!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
