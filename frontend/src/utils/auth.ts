import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ userId }, secret, {
    expiresIn: "30d",
  });
};

// Extract user ID from token (client-side)
export const getUserFromToken = () => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return null;
  
  try {
    // We don't need to verify the token client-side, just decode it
    const decoded = jwt.decode(token) as { userId: string };
    return decoded?.userId;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if user is authenticated (client-side)
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
};

// Logout user (client-side)
export const logout = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
};