const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Expert = require('./models/Expert');

dotenv.config();

const experts = [
  {
    name: 'Dr. John Doe',
    category: 'Technology',
    experience: 12,
    rating: 4.8,
    fee: 1500,
    description: 'Expert in Cloud Architecture and Full Stack Development. 12+ years of experience in leading tech firms.',
    bio: 'John has architected scalable systems for Fortune 500 companies and mentored hundreds of developers worldwide. He specializes in AWS, React, and high-performance Node.js applications.',
    expertise: ['AWS', 'React', 'Node.js', 'System Design'],
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=512&q=80'
  },
  {
    name: 'Jane Smith',
    category: 'Health',
    experience: 8,
    rating: 4.9,
    fee: 1200,
    description: 'Certified Nutritionist and Wellness Coach. Helping people achieve their health goals for 8 years.',
    bio: 'Jane combines clinical nutrition with behavioral psychology to create sustainable lifestyle changes. She has worked with elite athletes and busy executives alike.',
    expertise: ['Keto', 'Intermittent Fasting', 'Mental Wellness', 'Yoga'],
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=512&q=80'
  },
  {
    name: 'Robert Brown',
    category: 'Finance',
    experience: 15,
    rating: 4.7,
    fee: 2500,
    description: 'Investment Banker and Financial Advisor. Expert in wealth management and retirement planning.',
    bio: 'Robert helps individuals and families build generational wealth through disciplined investing and tax-efficient strategies.',
    expertise: ['Stocks', 'Real Estate', 'Tax Planning', 'Retirement'],
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=512&q=80'
  },
  {
    name: 'Emily Davis',
    category: 'Education',
    experience: 10,
    rating: 4.6,
    fee: 800,
    description: 'Experienced Educator specializing in Online Learning Systems and Curriculum Development.',
    bio: 'Emily is a pioneer in digital pedagogy, helping schools and universities transition to hybrid learning models effectively.',
    expertise: ['LMS', 'Pedagogy', 'EdTech', 'Public Speaking'],
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=512&q=80'
  },
  {
    name: 'Michael Wilson',
    category: 'Business',
    experience: 20,
    rating: 4.9,
    fee: 3000,
    description: 'Business Consultant and Entrepreneur. Helped over 50 startups scale to success.',
    bio: 'Michael is a serial entrepreneur who has seen everything from seed stage to IPO. He provides strategic guidance on scaling, operations, and fundraising.',
    expertise: ['Scaling', 'Fundraising', 'Strategy', 'Operations'],
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=512&q=80'
  },
  {
    name: 'Sarah Miller',
    category: 'Lifestyle',
    experience: 7,
    rating: 4.5,
    fee: 1000,
    description: 'Personal Stylist and Life Coach. Expert in personal branding and confidence building.',
    bio: 'Sarah believes that how you present yourself is the first step to success. She helps clients find their unique voice and style.',
    expertise: ['Personal Branding', 'Confidence', 'Fashion', 'Etiquette'],
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=512&q=80'
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Expert.deleteMany();
    await Expert.insertMany(experts);
    console.log('Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
