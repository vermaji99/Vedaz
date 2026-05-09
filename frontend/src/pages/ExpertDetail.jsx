import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { 
  Star, Briefcase, Calendar, Clock, ChevronLeft, 
  CheckCircle2, ShieldCheck, Zap, Globe, MessageSquare 
} from 'lucide-react';

import { fetchExpertById, clearSelectedExpert } from '../store/slices/expertSlice';
import { createBooking, resetBookingState } from '../store/slices/bookingSlice';
import API_BASE_URL from '../utils/config';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';

const socket = io(API_BASE_URL);

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  notes: z.string().max(500, 'Notes too long').optional(),
});

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", 
  "14:00", "15:00", "16:00", "17:00"
];

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedExpert: expert, loading } = useSelector((state) => state.experts);
  const { bookingInProgress, success } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);

  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: ''
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: ''
      });
    }
  }, [user, reset]);

  const fetchBookedSlots = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/bookings/slots/${id}?date=${selectedDate}`);
      setBookedSlots(response.data.data);
    } catch (err) {
      console.error('Failed to fetch slots', err);
    }
  }, [id, selectedDate]);

  useEffect(() => {
    dispatch(fetchExpertById(id));
    
    socket.emit('join_expert', id);
    fetchBookedSlots();

    socket.on('slot_booked', (data) => {
      if (data.expertId === id && data.date === selectedDate) {
        setBookedSlots(prev => [...new Set([...prev, data.timeSlot])]);
        if (selectedSlot === data.timeSlot) {
          setSelectedSlot(null);
          toast.error('This slot was just booked by someone else!');
        }
      }
    });

    return () => {
      socket.emit('leave_expert', id);
      socket.off('slot_booked');
      dispatch(clearSelectedExpert());
      dispatch(resetBookingState());
    };
  }, [id, selectedDate, dispatch, fetchBookedSlots]);

  const onBookingSubmit = async (data) => {
    if (!selectedSlot) return;

    const bookingData = {
      expert: id,
      userName: data.name,
      userEmail: data.email,
      userPhone: data.phone,
      date: selectedDate,
      timeSlot: selectedSlot,
      notes: data.notes
    };

    dispatch(createBooking(bookingData))
      .unwrap()
      .then(() => {
        toast.success('Booking Confirmed!');
        setShowForm(false);
        reset();
      })
      .catch((err) => {
        toast.error(err || 'Booking failed');
        fetchBookedSlots(); // Refresh slots on failure
      });
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8">
      <Skeleton className="h-10 w-32 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        <Skeleton className="lg:col-span-1 h-[400px] md:h-[500px] rounded-3xl" />
        <Skeleton className="lg:col-span-2 h-[400px] md:h-[500px] rounded-3xl" />
      </div>
    </div>
  );

  if (!expert) return <div className="text-center py-20">Expert not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="mb-6 md:mb-8 group"
      >
        <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-gray-100 border border-gray-100 text-center">
            <div className="relative inline-block mb-4 md:mb-6">
              <img 
                src={expert.profileImage} 
                alt={expert.name} 
                className="w-32 h-32 md:w-40 md:h-40 rounded-[1.5rem] md:rounded-[2rem] object-cover mx-auto ring-6 md:ring-8 ring-blue-50 shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-white flex items-center justify-center">
                <ShieldCheck className="h-3 w-3 md:h-4 md:w-4 text-white" />
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 md:mb-2">{expert.name}</h1>
            <p className="text-blue-600 font-bold mb-3 md:mb-4 text-sm md:text-base">{expert.category}</p>
            
            <div className="flex items-center justify-center space-x-3 md:space-x-4 mb-6 md:mb-8">
              <div className="text-center px-3 md:px-4 border-r border-gray-100">
                <p className="text-lg md:text-xl font-black text-gray-900">{expert.rating}</p>
                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase">Rating</p>
              </div>
              <div className="text-center px-3 md:px-4">
                <p className="text-lg md:text-xl font-black text-gray-900">{expert.experience}+</p>
                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase">Years</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="primary" className="w-full py-3 md:py-4 rounded-xl md:rounded-2xl shadow-lg shadow-blue-200 text-sm md:text-base">
                <Zap className="h-4 w-4 mr-2 fill-current" />
                Quick Consult
              </Button>
              <Button variant="secondary" className="w-full py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-base">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat Now
              </Button>
            </div>
          </div>

          <div className="bg-blue-600 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 text-white shadow-xl shadow-blue-100 overflow-hidden relative">
            <Globe className="absolute -right-10 -bottom-10 h-32 w-32 md:h-40 md:w-40 text-white/10" />
            <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2">Consultation Fee</h3>
            <p className="text-3xl md:text-4xl font-black mb-3 md:mb-4">₹{expert.fee || 500}<span className="text-base md:text-lg font-medium opacity-70">/session</span></p>
            <p className="text-xs md:text-sm opacity-80 leading-relaxed">Includes 45 mins of 1-on-1 session with lifetime access to recordings.</p>
          </div>
        </motion.div>

        {/* Details & Booking */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6 md:space-y-8"
        >
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-gray-100 border border-gray-100">
            <section className="mb-8 md:mb-10">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-3 md:mb-4">About</h2>
              <p className="text-gray-500 leading-relaxed text-base md:text-lg">
                {expert.description} {expert.bio}
              </p>
            </section>

            <section className="mb-8 md:mb-10">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 md:mb-6">Select a Date & Time</h2>
              
              {/* Horizontal Date Selector */}
              <div className="flex space-x-3 md:space-x-4 overflow-x-auto pb-4 mb-6 md:mb-8 no-scrollbar scroll-smooth">
                {[...Array(7)].map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() + i);
                  const dateStr = d.toISOString().split('T')[0];
                  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = d.getDate();
                  const isSelected = selectedDate === dateStr;
                  
                  return (
                    <button
                      key={dateStr}
                      onClick={() => {
                        setSelectedDate(dateStr);
                        setSelectedSlot(null);
                      }}
                      className={`flex flex-col items-center justify-center min-w-[70px] md:min-w-[80px] py-3 md:py-4 rounded-xl md:rounded-2xl border transition-all ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                          : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200'
                      }`}
                    >
                      <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider mb-0.5 md:mb-1 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                        {dayName}
                      </span>
                      <span className="text-lg md:text-xl font-black">{dayNum}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
                <div className="space-y-3 md:space-y-4">
                  <label className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Custom Date</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedSlot(null);
                    }}
                    className="w-full p-3 md:p-4 bg-gray-50 border-none rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-gray-700 text-sm md:text-base"
                  />
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <label className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Available Slots</label>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {timeSlots.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold transition-all text-xs md:text-sm ${
                            isBooked 
                              ? 'bg-gray-100 text-gray-300 cursor-not-allowed line-through' 
                              : selectedSlot === slot
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]'
                                : 'bg-white border border-gray-100 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <AnimatePresence mode="wait">
              {!showForm ? (
                <motion.div
                  key="book-button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    disabled={!selectedSlot}
                    onClick={() => setShowForm(true)}
                    className="w-full py-4 md:py-5 rounded-xl md:rounded-[2rem] text-lg md:text-xl shadow-xl shadow-blue-100"
                  >
                    {selectedSlot ? `Book for ${selectedSlot}` : 'Select a Slot'}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="booking-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-gray-50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-black text-gray-900">Confirm Booking</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                  
                  <form onSubmit={handleSubmit(onBookingSubmit)} className="space-y-3 md:space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <Input 
                        label="Full Name" 
                        placeholder="John Doe"
                        {...register('name')}
                        error={errors.name?.message}
                        className="text-sm"
                      />
                      <Input 
                        label="Email" 
                        placeholder="john@example.com"
                        {...register('email')}
                        error={errors.email?.message}
                        className="text-sm"
                      />
                    </div>
                    <Input 
                      label="Phone" 
                      placeholder="+91 9876543210"
                      {...register('phone')}
                      error={errors.phone?.message}
                      className="text-sm"
                    />
                    <Input 
                      label="Notes (Optional)" 
                      placeholder="I want to discuss about..."
                      {...register('notes')}
                      error={errors.notes?.message}
                      className="text-sm"
                    />
                    
                    <Button 
                      type="submit" 
                      isLoading={bookingInProgress}
                      className="w-full py-3 md:py-4 rounded-xl md:rounded-2xl shadow-lg shadow-blue-200 mt-4 text-sm md:text-base"
                    >
                      Confirm and Pay ₹{expert.fee || 500}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-green-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Success!</h2>
              <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8">Your session with {expert.name} is confirmed for {selectedDate} at {selectedSlot}.</p>
              <div className="space-y-3">
                <Button variant="primary" className="w-full py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-base" onClick={() => navigate('/my-bookings')}>
                  View My Bookings
                </Button>
                <Button variant="ghost" className="w-full text-sm md:text-base" onClick={() => dispatch(resetBookingState())}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpertDetail;
