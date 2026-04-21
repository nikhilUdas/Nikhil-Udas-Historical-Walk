// Base URL for all backend requests. Configure via EXPO_PUBLIC_API_BASE_URL at runtime.
// Fallback points to localhost for dev. Keep trailing /api for consistency with server routes.
export const BASE_URL =
  // process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://192.168.1.6:8000";
process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://nikhil-udas-historical-walk.onrender.com";
// If you encounter connection issues, ensure 192.168.100.95 matches your computer's IP.

export const API_BASE = `${BASE_URL}/api/users`;
export const API_BASE_STORIES = `${BASE_URL}/api/stories`;
export const API_BASE_ADMIN = `${BASE_URL}/api/admin`;
export const API_BASE_MUSEUM = `${BASE_URL}/api/museums`;
export const API_BASE_NOTIFICATIONS = `${BASE_URL}/api/notifications`;
export const API_BASE_AUTH = `${BASE_URL}/api/auth`;
export const API_BASE_TICKETS = `${BASE_URL}/api/tickets`;
export const API_BASE_PAYMENT = `${BASE_URL}/api/payment`;
export const API_BASE_SITES = `${BASE_URL}/api/heritage-sites`;
export const API_BASE_ADMIN_STATS = `${BASE_URL}/api/admin/stats`;
export const API_BASE_MEDIA = `${BASE_URL}/api/media`;
export const API_BASE_FAVORITES = `${BASE_URL}/api/favorites`;
