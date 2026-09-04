const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product'); // Ensure path matches your Product model location

dotenv.config();

const sampleProducts = [
  {
    name: 'Fresh Organic Apples',
    category: 'fruits',
    price: 120,
    unit: 'kg',
    description: 'Crisp, sweet, and juicy farm-fresh organic red apples.',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500',
    countInStock: 50,
  },
  {
    name: 'Organic Bananas',
    category: 'fruits',
    price: 60,
    unit: 'dozen',
    description: 'Rich in potassium, fresh naturally ripened bananas.',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500',
    countInStock: 40,
  },
  {
    name: 'Fresh Farm Broccoli',
    category: 'vegetables',
    price: 80,
    unit: '500g',
    description: 'Nutrient-rich, crisp green broccoli florets.',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500',
    countInStock: 30,
  },
  {
    name: 'Whole Wheat Bread',
    category: 'bakery',
    price: 45,
    unit: 'loaf',
    description: 'Freshly baked 100% whole grain wheat bread.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    countInStock: 25,
  },
  {
    name: 'Fresh Cow Milk',
    category: 'dairy',
    price: 65,
    unit: 'litre',
    description: 'Pasteurized pure whole milk delivered fresh daily.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500',
    countInStock: 60,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log('Sample Products Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();