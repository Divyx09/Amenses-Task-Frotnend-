import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Users, Plus, X, Search, Star,
  Globe, Laptop, TrendingUp, Network, Mic, BookOpen, Grid, List,
  ArrowRight, AlertCircle, Clock, MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: ''
  });
  
  const { user } = useAuth();

  const categories = [
    { value: 'all', label: 'All Categories', icon: Globe },
    { value: 'technology', label: 'Technology', icon: Laptop },
    { value: 'business', label: 'Business', icon: TrendingUp },
    { value: 'workshop', label: 'Workshop', icon: Users },
    { value: 'networking', label: 'Networking', icon: Network },
    { value: 'conference', label: 'Conference', icon: Mic },
    { value: 'education', label: 'Education', icon: BookOpen }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory, sortBy]);

  const fetchEvents = async () => {
    try {
      // Mock data for better UI demonstration
      const mockEvents = [
        {
          _id: '1',
          title: 'AI & Machine Learning Conference 2025',
          description: 'Join industry leaders for cutting-edge insights into AI and ML technologies.',
          date: '2025-10-15T09:00:00Z',
          location: 'San Francisco Convention Center',
          category: 'technology',
          price: 299,
          capacity: 500,
          attendees: 247,
          rating: 4.8,
          reviews: 156,
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          featured: true,
          organizer: 'Tech Events Inc.',
          tags: ['AI', 'Machine Learning', 'Technology'],
          createdBy: { _id: 'user1', name: 'John Doe' }
        },
        {
          _id: '2',
          title: 'Digital Marketing Masterclass',
          description: 'Learn advanced digital marketing strategies from industry experts.',
          date: '2025-09-20T14:00:00Z',
          location: 'New York Business Center',
          category: 'business',
          price: 199,
          capacity: 100,
          attendees: 87,
          rating: 4.6,
          reviews: 92,
          image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          featured: false,
          organizer: 'Marketing Pro',
          tags: ['Marketing', 'Digital', 'Business'],
          createdBy: { _id: 'user2', name: 'Jane Smith' }
        },
        {
          _id: '3',
          title: 'React Development Workshop',
          description: 'Hands-on workshop for building modern React applications.',
          date: '2025-09-25T10:00:00Z',
          location: 'Tech Hub Seattle',
          category: 'workshop',
          price: 149,
          capacity: 50,
          attendees: 32,
          rating: 4.9,
          reviews: 45,
          image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          featured: true,
          organizer: 'Dev Academy',
          tags: ['React', 'JavaScript', 'Development'],
          createdBy: { _id: 'user3', name: 'Bob Johnson' }
        },
        {
          _id: '4',
          title: 'Startup Networking Night',
          description: 'Connect with fellow entrepreneurs and startup enthusiasts.',
          date: '2025-09-18T18:00:00Z',
          location: 'Innovation District, Boston',
          category: 'networking',
          price: 25,
          capacity: 200,
          attendees: 156,
          rating: 4.4,
          reviews: 78,
          image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          featured: false,
          organizer: 'Startup Community',
          tags: ['Networking', 'Startup', 'Business'],
          createdBy: { _id: 'user4', name: 'Alice Brown' }
        },
        {
          _id: '5',
          title: 'UX/UI Design Conference',
          description: 'Explore the latest trends in user experience and interface design.',
          date: '2025-10-05T09:00:00Z',
          location: 'Design Center, Austin',
          category: 'conference',
          price: 249,
          capacity: 300,
          attendees: 198,
          rating: 4.7,
          reviews: 112,
          image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          featured: true,
          organizer: 'Design Guild',
          tags: ['UX', 'UI', 'Design'],
          createdBy: { _id: 'user5', name: 'Charlie Wilson' }
        },
        {
          _id: '6',
          title: 'Data Science Bootcamp',
          description: 'Intensive bootcamp covering data analysis, visualization, and machine learning.',
          date: '2025-11-01T09:00:00Z',
          location: 'Data Institute, Chicago',
          category: 'education',
          price: 399,
          capacity: 75,
          attendees: 52,
          rating: 4.8,
          reviews: 89,
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          featured: false,
          organizer: 'Data Academy',
          tags: ['Data Science', 'Analytics', 'Education'],
          createdBy: { _id: 'user6', name: 'Diana Davis' }
        }
      ];
      
      setEvents(mockEvents);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'popularity':
          return b.attendees - a.attendees;
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  const getAttendancePercentage = (attendees, capacity) => {
    return Math.round((attendees / capacity) * 100);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    // Create event logic here
    setShowCreateForm(false);
  };

  const handleJoinEvent = async (eventId) => {
    // Join event logic here
    console.log('Joining event:', eventId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-300 text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-blue-900/60 to-indigo-900/80"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Discover Amazing
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Events
              </span>
            </h1>
            <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with like-minded people, learn from industry experts, and create unforgettable experiences at our curated events.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events by title, location, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Category Filters */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-purple-200 mb-3">Filter by Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                        selectedCategory === category.value
                          ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-white/5 border-white/20 text-purple-200 hover:bg-white/10 hover:border-purple-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Sort Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-purple-200 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none min-w-[140px]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">View</label>
                <div className="flex bg-white/10 backdrop-blur-lg rounded-lg p-1 border border-white/20">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-purple-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-purple-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Create Event Button */}
              <div>
                <label className="block text-sm font-medium text-transparent mb-2">Action</label>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Event</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid/List */}
        <div className="mb-8">
          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-purple-200">
              <span className="text-lg font-medium">{filteredEvents.length}</span>
              <span className="ml-2">events found</span>
              {searchTerm && (
                <span className="ml-2 text-purple-300">
                  for "{searchTerm}"
                </span>
              )}
            </div>
            {filteredEvents.length > 0 && (
              <div className="text-sm text-purple-300">
                Showing {Math.min(12, filteredEvents.length)} of {filteredEvents.length} events
              </div>
            )}
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Calendar className="w-24 h-24 text-purple-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">No events found</h3>
              <p className="text-purple-300 mb-8 max-w-md mx-auto">
                {searchTerm || selectedCategory !== 'all'
                  ? "Try adjusting your search terms or filters to find more events."
                  : "Be the first to create an amazing event for the community!"}
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Create First Event
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'space-y-6'
              }
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link to={`/events/${event._id}`}>
                    {viewMode === 'grid' ? (
                      // Grid Card View
                      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 hover:border-purple-400/40 h-full">
                        {/* Event Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          
                          {/* Featured Badge */}
                          {event.featured && (
                            <div className="absolute top-4 left-4">
                              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                                <Star className="w-3 h-3 fill-current" />
                                <span>Featured</span>
                              </span>
                            </div>
                          )}
                          
                          {/* Price Badge */}
                          <div className="absolute top-4 right-4">
                            <span className="bg-purple-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                              {formatPrice(event.price)}
                            </span>
                          </div>
                          
                          {/* Category Tag */}
                          <div className="absolute bottom-4 left-4">
                            <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                              {event.category}
                            </span>
                          </div>
                        </div>

                        {/* Event Content */}
                        <div className="p-6">
                          {/* Event Title */}
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors line-clamp-2">
                            {event.title}
                          </h3>
                          
                          {/* Event Description */}
                          <p className="text-purple-200 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>
                          
                          {/* Event Details */}
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center text-purple-300 text-sm">
                              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center text-purple-300 text-sm">
                              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center text-purple-300 text-sm">
                              <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span>{event.attendees} / {event.capacity} attendees</span>
                            </div>
                          </div>
                          
                          {/* Rating and Organizer */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-white text-sm font-medium">{event.rating}</span>
                              <span className="text-purple-300 text-sm">({event.reviews})</span>
                            </div>
                            <span className="text-purple-300 text-sm">by {event.organizer}</span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-purple-300 mb-1">
                              <span>Attendance</span>
                              <span>{getAttendancePercentage(event.attendees, event.capacity)}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${getAttendancePercentage(event.attendees, event.capacity)}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {event.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="bg-purple-600/30 text-purple-200 px-2 py-1 rounded-md text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                            {event.tags.length > 3 && (
                              <span className="text-purple-300 text-xs self-center">
                                +{event.tags.length - 3} more
                              </span>
                            )}
                          </div>
                          
                          {/* Action Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleJoinEvent(event._id);
                            }}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg hover:shadow-purple-500/25"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // List View (simplified)
                      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:border-purple-400/40 p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                              {event.title}
                            </h3>
                            <p className="text-purple-200 text-sm mb-3">
                              {event.description}
                            </p>
                            <div className="flex items-center space-x-4 text-purple-300 text-sm">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(event.date)}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {event.location}
                              </span>
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {event.attendees}/{event.capacity}
                              </span>
                            </div>
                          </div>
                          <div className="ml-6 text-right">
                            <div className="text-white font-semibold text-lg mb-2">
                              {formatPrice(event.price)}
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleJoinEvent(event._id);
                              }}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
                            >
                              <span>View Details</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
