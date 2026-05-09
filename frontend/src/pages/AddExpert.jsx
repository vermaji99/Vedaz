import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/config';
import { toast } from 'react-hot-toast';

const AddExpert = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Mental Health',
    experience: '',
    rating: 4.5,
    description: '',
    bio: '',
    availableSlots: [
      { date: '2026-05-10', time: '10:00 AM' },
      { date: '2026-05-10', time: '11:00 AM' },
      { date: '2026-05-10', time: '02:00 PM' },
      { date: '2026-05-11', time: '10:00 AM' },
      { date: '2026-05-11', time: '03:00 PM' }
    ]
  });

  const categories = ['Mental Health', 'Career Coaching', 'Finance', 'Health & Fitness', 'Technology'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/experts`, formData);
      toast.success('Expert added successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add expert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-[2rem] md:rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 my-4 md:my-10">
      <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 md:mb-8">Add New Expert</h1>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700"
            required
            placeholder="Dr. Jane Smith"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Experience (Years)</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700"
              required
              placeholder="e.g. 10+ years"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Short Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700"
            required
            placeholder="e.g. Expert in Mental Health with 10 years experience"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-700 resize-none"
            required
            placeholder="Tell us about your expertise..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-black py-4 rounded-xl md:rounded-2xl hover:bg-blue-700 focus:outline-none shadow-lg shadow-blue-100 transition duration-300 ease-in-out disabled:opacity-50 mt-4"
        >
          {loading ? 'Adding Expert...' : 'Create Expert Profile'}
        </button>
      </form>
    </div>
  );
};

export default AddExpert;
