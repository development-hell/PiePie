import axios from "axios";

// Helper to get cookie by name (still useful for hybrid/CSRF if needed)
const getCookie = (name: string) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

// Create axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor: Attach Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Still attach CSRF token for non-safe methods as a good practice
    const csrfToken = getCookie("csrftoken");
    if (csrfToken && !config.method?.match(/^(get|head|options|trace)$/i)) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 and if we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // Attempt refresh
          // Use a fresh axios instance or fetch to avoid infinite interceptor loops
          const response = await axios.post(
            `${api.defaults.baseURL}/auth/token/refresh/`, 
            { refresh: refreshToken }
          );
          
          const { access } = response.data;
          
          // Store new token
          localStorage.setItem("accessToken", access);
          
          // Update headers
          api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
          originalRequest.headers["Authorization"] = `Bearer ${access}`;
          
          // Retry original request
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);
          // Clear tokens and let the auth context/guard handle redirect
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login"; 
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Optional: window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
