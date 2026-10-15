import bcrypt from "bcrypt";
import Customer from "../models/customer.model.js";
import generateToken from "../utils/generateToken.js";

export const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: fullName, email, password, phone",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);


    const customer = await Customer.create({ fullName, email, password: hashedPassword, phone });

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      customer: {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.error("registerCustomer error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const customer = await Customer.findOne({ email });

   
    const isMatch = customer ? await bcrypt.compare(password, customer.password) : false;
    if (!customer || !isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    generateToken(res, customer._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("loginCustomer error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const customer = req.user;

    return res.status(200).json({
      _id: customer._id,
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
    });
  } catch (error) {
    console.error("getProfile error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logoutCustomer = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), 
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("logoutCustomer error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

   
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both oldPassword and newPassword are required",
      });
    }

  
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const customer = await Customer.findById(req.user._id);

    
    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, customer.password);
    if (!isOldPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    customer.password = await bcrypt.hash(newPassword, 10);
    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("changePassword error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
