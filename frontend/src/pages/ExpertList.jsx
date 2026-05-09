import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Briefcase, Filter, ArrowRight } from 'lucide-react';
import { fetchExperts } from '../store/slices/expertSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';

const categories = ['All', 'Technology', 'Health', 'Finance', 'Education', 'Lifestyle', 'Business'];

const ExpertCard = ({ expert }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ y: -5 }}
    className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
  >
    <div className="relative h-56 overflow-hidden">
      <img 
        src={expert.profileImage} 
        alt={expert.name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30">
          {expert.category}
        </span>
        <div className="flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
          <Star className="h-3 w-3 text-yellow-500 fill-current" />
          <span className="ml-1 text-xs font-bold text-gray-900">{expert.rating}</span>
        </div>
      </div>
    </div>

    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
        {expert.name}
      </h3>
      <div className="flex items-center text-gray-500 text-sm mb-4">
        <Briefcase className="h-4 w-4 mr-2" />
        <span>{expert.experience} Years Experience</span>
      </div>
      <p className="text-gray-600 text-sm line-clamp-2 mb-6 h-10">
        {expert.description}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Fee starts at</p>
          <p className="text-lg font-bold text-gray-900">₹{expert.fee || 500}</p>
        </div>
        <Link to={`/expert/${expert._id}`}>
          <Button variant="primary" size="sm" className="rounded-xl px-5">
            View Profile
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  </motion.div>
);

const ExpertList = () => {
  const dispatch = useDispatch();
  const { list: experts, loading, pagination, error } = useSelector((state) => state.experts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchExperts({ page, search, category }));
  }, [dispatch, page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    dispatch(fetchExperts({ page: 1, search, category }));
  };

  return (
    <div className="space-y-6 md:space-y-10 max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-6 md:py-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight"
        >
          Book an Expert <span className="text-blue-600">Instantly.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto px-4"
        >
          Connect with world-class professionals for personalized consultations across Technology, Business, Health, and more.
        </motion.p>
      </section>

      {/* Filters & Search */}
      <div className="sticky top-20 md:top-24 z-30 bg-white/80 backdrop-blur-xl border border-gray-100 p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-xl shadow-gray-200/50 flex flex-col md:flex-row gap-3 md:gap-4 items-center">
        <form onSubmit={handleSearch} className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search experts..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm md:text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl whitespace-nowrap text-xs md:text-sm font-bold transition-all ${
                category === cat 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {error ? (
        <div className="text-center py-20">
          <p className="text-red-500 font-bold mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchExperts({ page, search, category }))}>Retry</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
                  <Skeleton className="h-48 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))
            ) : experts.length > 0 ? (
              experts.map((expert) => <ExpertCard key={expert._id} expert={expert} />)
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No experts found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-10">
          <Button 
            variant="secondary" 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-bold transition-all ${
                page === i + 1 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <Button 
            variant="secondary" 
            disabled={page === pagination.totalPages} 
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExpertList;
