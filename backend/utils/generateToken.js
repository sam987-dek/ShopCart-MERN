import jwt from "jsonwebtoken";

/**
 * 
 *
 * @param {Object} res      
 * @param {string} userId 
 * 
 **/ 
const generateToken = (res, userId) => {
  const token = jwt.sign(
    { id: userId },          
    process.env.JWT_SECRET,   
    { expiresIn: "7d" }       
  );

  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("token", token, {
    httpOnly: true,            
    secure: isProduction, 
    sameSite: isProduction ? "none" : "lax",         
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
};

export default generateToken;
