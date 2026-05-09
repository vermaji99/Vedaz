import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Calendar, Clock, User, CheckCircle, 
  AlertCircle, Clock3, XCircle, Info, ExternalLink 
} from 'lucide-react';
import { fetchBookingsByEmail } from '../store/slices/bookingSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';

const StatusBadge = ({ status }) => {
  const styles = {
    'Confirmed': 'bg-green-100 text-green-700 border-green-200',
    'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Completed': 'bg-blue-100 text-blue-700 border-blue-200',
    'Cancelled': 'bg-red-100 text-red-700 border-red-200',
  };

  const Icons = {
    'Confirmed': CheckCircle,
    'Pending': Clock3,
    'Completed': CheckCircle,
    'Cancelled': XCircle,
  };

  const Icon = Icons[status] || AlertCircle;

  return (
    <span className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${styles[status]}`}>
      <Icon className="h-3.5 w-3.5" />
      <span>{status}</span>
    </span>
  );
};

const MyBookings = () => {
  const dispatch = useDispatch();
  const { list: bookings, loading, error } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState(user?.email || '');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (user?.email && !searched) {
      dispatch(fetchBookingsByEmail(user.email));
      setSearched(true);
    }
  }, [user, dispatch, searched]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!email) return;
    dispatch(fetchBookingsByEmail(email));
    setSearched(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-gray-100 border border-gray-100 p-6 md:p-10 mb-8 md:mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-blue-50 rounded-full -mr-24 -mt-24 md:-mr-32 md:-mt-32 z-0" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 md:mb-4">My Bookings</h1>
          <p className="text-gray-500 text-base md:text-lg mb-6 md:mb-8 max-w-xl">Track your upcoming and past consultations. Enter your registered email to get started.</p>
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="registered@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-3 md:py-4 px-4 md:px-6 text-base md:text-lg rounded-xl md:rounded-2xl bg-gray-50 border-transparent focus:bg-white"
              />
            </div>
            <Button 
              type="submit" 
              isLoading={loading}
              className="py-3 md:py-4 px-8 md:px-10 rounded-xl md:rounded-2xl text-base md:text-lg shadow-lg shadow-blue-100"
            >
              Fetch My Sessions
            </Button>
          </form>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 border border-gray-100 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-6 md:h-8 w-32 md:w-48" />
                  <Skeleton className="h-6 md:h-8 w-20 md:w-24 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            ))
          ) : searched && bookings.length > 0 ? (
            bookings.map((booking) => {
              if (!booking.expert) return null;
              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                    <div className="flex items-center space-x-4 md:space-x-6">
                      <div className="relative shrink-0">
                        <img 
                          src={booking.expert?.profileImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80'} 
                          alt={booking.expert?.name || 'Expert'} 
                          className="h-16 w-16 md:h-20 md:w-20 rounded-xl md:rounded-2xl object-cover ring-4 ring-gray-50"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-lg">
                          <ExternalLink className="h-3 w-3" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                          {booking.expert?.name || 'Unknown Expert'}
                        </h3>
                        <p className="text-blue-600 font-bold text-xs md:text-sm uppercase tracking-wider">
                          {booking.expert?.category || 'General'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 md:gap-8">
                      <div className="space-y-1">
                        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                        <div className="flex items-center text-gray-700 font-bold text-sm md:text-base">
                          <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2 text-blue-500" />
                          {booking.date}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</p>
                        <div className="flex items-center text-gray-700 font-bold text-sm md:text-base">
                          <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2 text-blue-500" />
                          {booking.timeSlot}
                        </div>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>
                  
                  {booking.notes && (
                    <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-50 flex items-start space-x-3 text-gray-500">
                      <Info className="h-4 w-4 md:h-5 md:w-5 text-gray-300 shrink-0 mt-0.5" />
                      <p className="text-xs md:text-sm italic">"{booking.notes}"</p>
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : searched ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-gray-100 py-16 md:py-20 text-center px-6"
            >
              <div className="bg-gray-50 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Calendar className="h-8 w-8 md:h-10 md:w-10 text-gray-300" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">No Bookings Found</h3>
              <p className="text-gray-500 text-base md:text-lg">We couldn't find any sessions associated with this email.</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyBookings;
