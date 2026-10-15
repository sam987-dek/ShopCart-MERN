import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = (userData) => api.post("/customers/register", userData);
export const loginUser = (credentials) => api.post("/customers/login", credentials);
export const getMyProfile = () => api.get("/customers/me");
export const logoutUser = () => api.post("/customers/logout");
export const fetchProducts = (params = {}) => api.get("/products", { params });
export const fetchProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (productData) => api.post("/products", productData);

// Wishlist endpoints
export const getWishlist = () => api.get("/wishlist");
export const addToWishlist = (productId) => api.post(`/wishlist/${productId}`);
export const removeFromWishlist = (productId) => api.delete(`/wishlist/${productId}`);
export const toggleWishlistItem = (productId) => api.patch(`/wishlist/${productId}/toggle`);

// Cart endpoints
export const getCart = () => api.get("/cart");
export const addToCart = (productId) => api.post(`/cart/${productId}`);
export const updateCartQuantity = (productId, quantity) => api.patch(`/cart/${productId}`, { quantity });
export const removeFromCart = (productId) => api.delete(`/cart/${productId}`);

// Order endpoints
export const createPaymentOrder = (shippingAddress) => api.post("/orders/create-payment-order", { shippingAddress });
export const verifyPayment = (paymentData) => api.post("/orders/verify-payment", paymentData);
export const getMyOrders = () => api.get("/orders");
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status });

export default api;
