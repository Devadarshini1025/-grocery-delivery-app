const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const connectDB = require('../config/db');

dotenv.config();

const sampleProducts = [
  {
    name: 'Fresh Organic Bananas',
    description: 'Sweet and ripe organic bananas rich in potassium and vitamins.',
    category: 'fruits',
    price: 45,
    unit: 'bunch',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=60',
    stock: 50,
    isAvailable: true,
    rating: 4.8,
    numReviews: 12,
  },
  {
    name: 'Red Gala Apples',
    description: 'Crisp and juicy sweet red apples sourced from local orchards.',
    category: 'fruits',
    price: 120,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=60',
    stock: 40,
    isAvailable: true,
    rating: 4.6,
    numReviews: 8,
  },
  {
    name: 'Farm Fresh Whole Milk',
    description: 'Pure, pasteurized farm fresh whole milk rich in calcium and protein.',
    category: 'dairy',
    price: 65,
    unit: 'liter',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60',
    stock: 30,
    isAvailable: true,
    rating: 4.9,
    numReviews: 24,
  },
  {
    name: 'Artisan Sourdough Bread',
    description: 'Freshly baked artisan sourdough loaf with crisp crust and chewy crumb.',
    category: 'bakery',
    price: 85,
    unit: 'loaf',
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&auto=format&fit=crop&q=60',
    stock: 20,
    isAvailable: true,
    rating: 4.7,
    numReviews: 15,
  },
  {
    name: 'Organic Vine Tomatoes',
    description: 'Bright red vine-ripened tomatoes, sweet and flavorful for salads or sauces.',
    category: 'vegetables',
    price: 40,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60',
    stock: 60,
    isAvailable: true,
    rating: 4.5,
    numReviews: 10,
  },
  {
    name: 'Fresh Spinach Leaves',
    description: 'Nutrient-rich washed baby spinach leaves, tender and pesticide-free.',
    category: 'vegetables',
    price: 35,
    unit: 'pack',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=60',
    stock: 25,
    isAvailable: true,
    rating: 4.8,
    numReviews: 6,
  },
  {
    name: 'Free-Range Brown Eggs',
    description: 'Farm fresh brown eggs from healthy free-range hens.',
    category: 'dairy',
    price: 90,
    unit: 'pack of 6',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=60',
    stock: 35,
    isAvailable: true,
    rating: 4.9,
    numReviews: 19,
  },
  {
    name: 'Greek Style Plain Yogurt',
    description: 'Thick, creamy plain Greek yogurt with no added sugars.',
    category: 'dairy',
    price: 75,
    unit: 'tub',
    image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500&auto=format&fit=crop&q=60',
    stock: 22,
    isAvailable: true,
    rating: 4.6,
    numReviews: 11,
  },
  {
    name: 'Premium Roasted Almonds',
    description: 'Lightly salted California almonds roasted to crunchy perfection.',
    category: 'snacks',
    price: 210,
    unit: '250g pack',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&auto=format&fit=crop&q=60',
    stock: 45,
    isAvailable: true,
    rating: 4.9,
    numReviews: 32,
  },
  {
    name: 'Cold Pressed Orange Juice',
    description: '100% pure squeezed Valencia oranges with pulp, no preservatives.',
    category: 'beverages',
    price: 95,
    unit: '500ml bottle',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=60',
    stock: 18,
    isAvailable: true,
    rating: 4.7,
    numReviews: 14,
  },
];

const seedData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    console.log('🗑️  Existing products cleared...');

    await Product.insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} sample products successfully seeded into MongoDB!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();

