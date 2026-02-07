import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  API_BASE,
  API_BASE_ADMIN,
  API_BASE_MUSEUM,
  API_BASE_NOTIFICATIONS,
  API_BASE_STORIES
} from './constants/api';

// --- Types ---

export type User = {
  user_id?: number;
  name?: string;
  email?: string;
  role?: string;
  type?: string;
  image?: string; // Legacy/frontend-only? keeping for safety
  profileImage?: string; // New field from backend
  isVerified?: boolean | string | number;
};

export type AuthResponse = {
  message?: string;
  token?: string;
  user?: User;
  error?: string;
};

export type ForgotPasswordResponse = {
  message: string;
  emailSent?: boolean;
};

export type ResetPasswordResponse = {
  message: string;
};

export type Story = {
  story_id: number;
  title: string;
  preview?: string;
  content?: string;
  media_url?: string;
  god_or_goddess_name?: string;
  has_full_content?: boolean;
};

export type HeritageSite = {
  site_id: number;
  name: string;
  location?: string;
  description: string;
  photo_url?: string;
  image_url?: string;
  gps_coordinates?: string;
  tag?: string;
};

export type Museum = {
  site_id: number; // Museums might share the same schema or use 'museum_id' - adjusting based on usage
  museum_id?: number;
  name: string;
  location?: string;
  description: string;
  photo_url?: string;
  image_url?: string;
  opening_hours?: string;
  gps_coordinates?: string;
};

export type Review = {
  review_id: number;
  rating: number;
  thoughts: string;
  created_at: string;
  user?: {
    user_id: number;
    name: string;
  };
  museum?: {
    museum_id: number;
    name: string;
  };
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  type?: "booking" | "reminder" | "promo" | "info";
  read?: boolean;
  created_at?: string;
  notification_id?: number;
  message?: string;
  is_read?: boolean;
};

// --- Helper ---

async function http<T>(url: string, config: RequestInit = {}): Promise<T> {
  const token = await AsyncStorage.getItem('jwtToken');

  // Clean headers to ensure we don't force Content-Type for FormData
  const headers: HeadersInit = { ... (config.headers || {}) };

  // Only add JSON content type if it's NOT FormData
  // In React Native/Fetch, FormData is detected automatically if body is FormData
  const isFormData = config.body instanceof FormData;
  if (!isFormData) {
    (headers as any)['Content-Type'] = 'application/json';
  }

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...config,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

// --- Auth API ---

export const auth = {
  login: (data: { email: string; password: string }) =>
    http<AuthResponse>(`${API_BASE}/login`, { method: 'POST', body: JSON.stringify(data) }),

  register: (data: { name: string; email: string; password: string }) =>
    http<AuthResponse>(`${API_BASE}/register`, { method: 'POST', body: JSON.stringify(data) }),

  verifyOtp: (data: { email: string; otp_code: string }) =>
    http<AuthResponse>(`${API_BASE}/verify-otp`, { method: 'POST', body: JSON.stringify(data) }),

  resendOtp: (data: { email: string }) =>
    http<{ success: boolean; message: string }>(`${API_BASE}/resend-otp`, { method: 'POST', body: JSON.stringify(data) }),

  forgotPassword: (email: string) =>
    http<ForgotPasswordResponse>(`${API_BASE}/forgot-password`, { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (data: { email: string; otp_code: string; new_password: string }) =>
    http<ResetPasswordResponse>(`${API_BASE}/reset-password`, { method: 'POST', body: JSON.stringify(data) }),
};

// --- User API ---

export const user = {
  getProfile: () => http<{ user: User }>(`${API_BASE}/profile`),

  updateProfile: (formData: FormData) => {
    return http<{ user: User }>(`${API_BASE}/profile`, { method: 'PUT', body: formData });
  }
};

// --- Stories API ---

export const stories = {
  getPreview: () => http<{ stories: Story[] }>(`${API_BASE_STORIES}/preview`),
};

// --- Sites API ---

export const sites = {
  getAll: (isAdmin = false) => {
    return http<{ sites: HeritageSite[] }>(`${API_BASE_ADMIN}/sites/getAllHeritageSites`);
  },

  add: (data: any) =>
    http<{ message: string }>(`${API_BASE_ADMIN}/sites/addHeritageSite`, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data)
    }),

  update: (id: number, data: any) =>
    http<{ message: string }>(`${API_BASE_ADMIN}/sites/${id}`, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data)
    }),

  delete: (id: number) =>
    http<{ message: string }>(`${API_BASE_ADMIN}/sites/${id}`, { method: 'DELETE' }),
};

// --- Museums API ---

export const museums = {
  getAll: () => http<{ museums?: Museum[]; sites?: Museum[] }>(`${API_BASE_MUSEUM}/getMuseum`),

  add: (data: any) =>
    http<{ message: string }>(`${API_BASE_MUSEUM}/admin/add`, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data)
    }),

  update: (id: number, data: any) =>
    http<{ message: string }>(`${API_BASE_MUSEUM}/admin/${id}`, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data)
    }),

  delete: (id: number) =>
    http<{ message: string }>(`${API_BASE_MUSEUM}/admin/${id}`, { method: 'DELETE' }),
};

// --- Reviews API ---
// Note: Codebase used `http://192.168.1.146:8000/api/users/reviews`

export const reviews = {
  getAllAdmin: () => http<{ reviews: Review[] }>(`${API_BASE}/reviews`),

  getMyReviews: () => http<{ reviews: Review[] }>(`${API_BASE}/reviews/my-reviews`),

  create: (data: { museum_id: number; rating: number; thoughts: string }) =>
    http<{ message: string }>(`${API_BASE}/reviews`, { method: 'POST', body: JSON.stringify(data) }),

  delete: (id: number) =>
    http<{ message: string }>(`${API_BASE}/reviews/${id}`, { method: 'DELETE' }),
};

// --- Notifications API ---
// Note: Codebase used `http://192.168.1.146:8000/api/notifications`

export const notifications = {
  getAll: () => http<{ notifications: NotificationItem[] }>(`${API_BASE_NOTIFICATIONS}/getNotification`),

  getUnreadCount: () => http<{ unreadCount: number }>(`${API_BASE_NOTIFICATIONS}/unread/count`),

  markRead: (id: string) =>
    http<{ message: string }>(`${API_BASE_NOTIFICATIONS}/${id}/read`, { method: 'PUT' }),

  markAllRead: () =>
    http<{ message: string }>(`${API_BASE_NOTIFICATIONS}/read/all`, { method: 'PUT' }),

  deleteAll: () =>
    http<{ message: string }>(`${API_BASE_NOTIFICATIONS}/all`, { method: 'DELETE' }),
};
// --- Admin API ---

export const admin = {
  getAllUsers: () => http<{ users: User[] }>(`${API_BASE_ADMIN}/users/getAllUsers`),
  getAllBookings: () => http<{ bookings: any[] }>(`${BASE_URL}/api/tickets`),
};
