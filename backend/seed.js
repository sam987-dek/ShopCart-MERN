import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";

dotenv.config();

const sampleProducts = [
  // Electronics & Gadgets
  {
    name: "Apple iPhone 15 Pro (128 GB, Titanium)",
    description: "Aerospace-grade titanium design with A17 Pro chip, customizable Action button, Super Retina XDR display, and 48MP camera system with 3x Telephoto.",
    price: 129900,
    category: "Electronics",
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Sony WH-1000XM5 Wireless ANC Headphones",
    description: "Industry-leading noise cancellation powered by two processors and 8 microphones. Hi-Res Audio, 30-hour battery life, and crystal-clear hands-free calling.",
    price: 29990,
    category: "Audio",
    stock: 22,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "MacBook Air 15-inch M3 Chip (16GB, 512GB)",
    description: "Strikingly thin design with blazing-fast 8-core CPU and 10-core GPU. Liquid Retina display, MagSafe 3 charging, and up to 18 hours of battery.",
    price: 134900,
    category: "Electronics",
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Keychron K2 Wireless Mechanical Keyboard",
    description: "Compact 75% layout keyboard with tactile Gateron G Pro Brown switches, Mac & Windows layout, RGB backlighting, and Bluetooth 5.1 multi-device connectivity.",
    price: 8499,
    category: "Electronics",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
  },

  // Wearables & Watches
  {
    name: "Apple Watch Ultra 2 GPS + Cellular",
    description: "Rugged 49mm titanium case, precision dual-frequency GPS, 3000 nits brightness, water resistant 100m, and up to 72 hours in Low Power Mode.",
    price: 89900,
    category: "Wearables",
    stock: 14,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Samsung Galaxy Watch 6 Classic (47mm)",
    description: "Iconic rotating bezel, Sapphire Crystal glass, advanced Sleep Coaching, BIA body composition analysis, and ECG tracking.",
    price: 36999,
    category: "Wearables",
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
  },

  // Footwear & Sneakers
  {
    name: "Nike Air Jordan 1 Retro High OG",
    description: "Legendary basketball silhouette crafted with premium full-grain leather, encapsulated Air-Sole cushioning, and rubber cupsole for durable traction.",
    price: 16995,
    category: "Footwear",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Adidas Ultraboost Light Running Shoes",
    description: "Lightest Ultraboost ever made with 30% lighter BOOST material. Primeknit+ upper for supportive sock-like fit and Continental Rubber outsole.",
    price: 18999,
    category: "Footwear",
    stock: 28,
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
  },

  // Fashion & Accessories
  {
    name: "Handcrafted Vintage Leather Messenger Bag",
    description: "Made from vegetable-tanned full grain buffalo leather with YKK antique brass zippers, padded 15.6 inch laptop sleeve, and adjustable shoulder strap.",
    price: 4999,
    category: "Fashion",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Ray-Ban Classic Polarized Aviator Sunglasses",
    description: "Timeless teardrop frame with polished gold metal and crystal green polarized G-15 lenses offering 100% UV protection and glare elimination.",
    price: 11290,
    category: "Fashion",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
  },

  // Home & Kitchen
  {
    name: "De'Longhi Dedica Pump Espresso Maker",
    description: "Compact stainless steel 15-bar professional espresso and cappuccino maker with manual milk frother and thermoblock heating system.",
    price: 24990,
    category: "Home & Kitchen",
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Minimalist Matte Ceramic Mug Set (Set of 4)",
    description: "Artisan stoneware ceramic mugs crafted with an ergonomic loop handle and smooth matte glaze. Dishwasher, oven, and microwave safe.",
    price: 1499,
    category: "Home & Kitchen",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop&q=80",
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for updating catalog with INR pricing...");
    
    // Replace old USD products with the new expanded INR catalog
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    
    console.log(`Successfully seeded ${sampleProducts.length} premium products in INR!`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err.message);
    process.exit(1);
  }
};

seedDB();
