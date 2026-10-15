import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://samarth25bcs10405_db_user:sam987pat@firstcluster-shard-00-00.jglrhe.mongodb.net:27017,firstcluster-shard-00-01.jglrhe.mongodb.net:27017,firstcluster-shard-00-02.jglrhe.mongodb.net:27017/shopcart?ssl=true&replicaSet=atlas-z98k7p-shard-0&authSource=admin&retryWrites=true&w=majority";

const categoryMap = {
  smartphones: "Electronics",
  laptops: "Electronics",
  tablets: "Electronics",
  mobile_accessories: "Electronics",
  fragrances: "Beauty & Personal Care",
  skincare: "Beauty & Personal Care",
  beauty: "Beauty & Personal Care",
  groceries: "Groceries",
  "home-decoration": "Home & Living",
  furniture: "Home & Living",
  lighting: "Home & Living",
  "kitchen-accessories": "Home & Living",
  tops: "Fashion",
  "womens-dresses": "Fashion",
  "mens-shirts": "Fashion",
  "mens-shoes": "Footwear",
  "womens-shoes": "Footwear",
  "mens-watches": "Accessories",
  "womens-watches": "Accessories",
  "womens-bags": "Accessories",
  "womens-jewellery": "Accessories",
  sunglasses: "Accessories",
  sports_accessories: "Sports",
  motorcycle: "Automotive",
  vehicle: "Automotive",
};

async function seedProductsFromApi() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    console.log("Fetching live products from DummyJSON API (no key required)...");
    const response = await fetch("https://dummyjson.com/products?limit=100");
    const data = await response.json();

    if (!data.products || !data.products.length) {
      throw new Error("No products returned from API");
    }

    console.log(`Fetched ${data.products.length} products from API! Processing...`);

    const formattedProducts = data.products.map((item) => {
      const normalizedCategory = categoryMap[item.category] || "General";
      const priceInINR = Math.max(199, Math.round(item.price * 85));

      return {
        name: item.title,
        description: item.description,
        price: priceInINR,
        category: normalizedCategory,
        stock: Math.max(5, item.stock || 20),
        imageUrl: item.thumbnail || (item.images && item.images[0]) || "",
      };
    });

    // Clear existing products and insert new ones
    await Product.deleteMany({});
    console.log("🧹 Cleared existing products collection");

    const inserted = await Product.insertMany(formattedProducts);
    console.log(`🎉 Successfully seeded ${inserted.length} real products from live API into MongoDB Atlas!`);

    // Log sample breakdown
    const categories = [...new Set(inserted.map((p) => p.category))];
    console.log("Categories populated:", categories);

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed products from API:", error.message);
    process.exit(1);
  }
}

seedProductsFromApi();
