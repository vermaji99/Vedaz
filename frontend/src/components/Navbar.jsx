import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, User, LayoutGrid, LogOut, Zap, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group" onClick={() => setIsOpen(false)}>
            <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-200">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">Expert<span className="text-blue-600">Book</span></span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 text-sm font-bold transition-colors ${
                isActive('/') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Browse Experts</span>
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/my-bookings" 
                  className={`flex items-center space-x-2 text-sm font-bold transition-colors ${
                    isActive('/my-bookings') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>My Sessions</span>
                </Link>
                
                <Link 
                  to="/add-expert" 
                  className={`flex items-center space-x-2 text-sm font-bold transition-colors ${
                    isActive('/add-expert') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Zap className="h-4 w-4" />
                  <span>Become Expert</span>
                </Link>
              </>
            )}

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Hi, {user.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="text-gray-500 hover:text-gray-900 font-bold text-sm transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup"
                    className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              <Link 
                to="/" 
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 p-4 rounded-2xl font-bold transition-colors ${
                  isActive('/') ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
                <span>Browse Experts</span>
              </Link>
              
              {user && (
                <>
                  <Link 
                    to="/my-bookings" 
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 p-4 rounded-2xl font-bold transition-colors ${
                      isActive('/my-bookings') ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>My Sessions</span>
                  </Link>
                  
                  <Link 
                    to="/add-expert" 
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 p-4 rounded-2xl font-bold transition-colors ${
                      isActive('/add-expert') ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Zap className="h-5 w-5" />
                    <span>Become Expert</span>
                  </Link>
                </>
              )}

              <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
                {user ? (
                  <>
                    <div className="px-4">
                      <p className="text-sm text-gray-500 font-medium">Logged in as</p>
                      <p className="text-lg font-bold text-gray-900">{user.name}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-2 bg-red-50 text-red-600 p-4 rounded-2xl font-bold"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link 
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center bg-gray-50 text-gray-900 p-4 rounded-2xl font-bold"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center bg-blue-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-blue-100"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
