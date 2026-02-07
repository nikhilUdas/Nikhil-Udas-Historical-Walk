// Base URL for all backend requests. Configure via EXPO_PUBLIC_API_BASE_URL at runtime.
// Fallback points to localhost for dev. Keep trailing /api for consistency with server routes.
export const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://10.121.105.190:8000";

export const API_BASE = `${BASE_URL}/api/users`;
export const API_BASE_STORIES = `${BASE_URL}/api/stories`;
export const API_BASE_ADMIN = `${BASE_URL}/api/admin`;
export const API_BASE_MUSEUM = `${BASE_URL}/api/museums`;
export const API_BASE_NOTIFICATIONS = `${BASE_URL}/api/notifications`;
export const API_BASE_AUTH = `${BASE_URL}/api/auth`;
