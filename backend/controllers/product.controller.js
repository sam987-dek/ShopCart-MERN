import Product from "../models/product.model.js";

// @desc    Create a new product
// @route   POST /products
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;

    if (!name || !description || price === undefined || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, description, price, category, stock",
      });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      imageUrl: imageUrl || undefined,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("createProduct error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while creating product",
    });
  }
};

// @desc    Get all products (with search, category filter, and sorting)
// @route   GET /products
// @query   search, category, sort
export const getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    const query = {};

    // Category filter (case-insensitive)
    if (category && category.trim() !== "" && category.toLowerCase() !== "all") {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    // Search filter across name or description
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    let queryBuilder = Product.find(query);

    // Bonus Challenge: Sorting support (price_asc, price_desc, newest)
    if (sort === "price_asc") {
      queryBuilder = queryBuilder.sort({ price: 1 });
    } else if (sort === "price_desc") {
      queryBuilder = queryBuilder.sort({ price: -1 });
    } else {
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
    }

    const products = await queryBuilder;

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("getProducts error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching products",
      error: error.message,
    });
  }
};

// @desc    Get a single product by ID
// @route   GET /products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("getProductById error:", error.message);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    });
  }
};
