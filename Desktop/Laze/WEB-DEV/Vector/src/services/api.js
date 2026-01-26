// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Token management
const getToken = () => localStorage.getItem("vector-token");
const setToken = (token) => localStorage.setItem("vector-token", token);
const removeToken = () => localStorage.removeItem("vector-token");

const getRefreshToken = () => localStorage.getItem("vector-refresh-token");
const setRefreshToken = (token) =>
  localStorage.setItem("vector-refresh-token", token);
const removeRefreshToken = () =>
  localStorage.removeItem("vector-refresh-token");

// Base fetch wrapper with auth
async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Handle 401 - try to refresh token
  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry original request with new token
      config.headers.Authorization = `Bearer ${getToken()}`;
      return fetch(`${API_BASE_URL}${endpoint}`, config);
    }
  }

  return response;
}

// Refresh access token
async function refreshAccessToken() {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.accessToken);
      return true;
    }

    // Refresh failed - clear tokens
    removeToken();
    removeRefreshToken();
    return false;
  } catch {
    return false;
  }
}

// Parse API response
async function parseResponse(response) {
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "An error occurred");
    }

    return data;
  }

  if (!response.ok) {
    throw new Error("An error occurred");
  }

  return null;
}

// ============================================
// Auth API
// ============================================
export const authAPI = {
  async register(name, email, password, phone = null) {
    const response = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone }),
    });

    const data = await parseResponse(response);

    // Store tokens
    setToken(data.accessToken);
    setRefreshToken(data.refreshToken);

    return data.user;
  },

  async login(email, password) {
    const response = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await parseResponse(response);

    // Store tokens
    setToken(data.accessToken);
    setRefreshToken(data.refreshToken);

    return data.user;
  },

  async logout() {
    removeToken();
    removeRefreshToken();
    localStorage.removeItem("vector-user");
  },

  async getCurrentUser() {
    const response = await apiFetch("/auth/me");
    return parseResponse(response);
  },

  isAuthenticated() {
    return !!getToken();
  },
};

// ============================================
// Courses API (Atlas Module)
// ============================================
export const coursesAPI = {
  async getAll() {
    const response = await apiFetch("/atlas/courses");
    return parseResponse(response);
  },

  async getById(id) {
    const response = await apiFetch(`/atlas/courses/${id}`);
    return parseResponse(response);
  },

  async getByStatus(status) {
    const response = await apiFetch(`/atlas/courses/status/${status}`);
    return parseResponse(response);
  },

  async getBySemester(semester) {
    const response = await apiFetch(
      `/atlas/courses/semester/${encodeURIComponent(semester)}`,
    );
    return parseResponse(response);
  },

  async search(query) {
    const response = await apiFetch(
      `/atlas/courses/search?query=${encodeURIComponent(query)}`,
    );
    return parseResponse(response);
  },

  async getSemesters() {
    const response = await apiFetch("/atlas/courses/semesters");
    return parseResponse(response);
  },

  async getStats() {
    const response = await apiFetch("/atlas/courses/stats");
    return parseResponse(response);
  },

  async create(course) {
    const response = await apiFetch("/atlas/courses", {
      method: "POST",
      body: JSON.stringify(course),
    });
    return parseResponse(response);
  },

  async update(id, course) {
    const response = await apiFetch(`/atlas/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(course),
    });
    return parseResponse(response);
  },

  async delete(id) {
    const response = await apiFetch(`/atlas/courses/${id}`, {
      method: "DELETE",
    });
    return parseResponse(response);
  },
};

// ============================================
// Deadlines API (Atlas Module)
// ============================================
export const deadlinesAPI = {
  async getAll() {
    const response = await apiFetch("/atlas/deadlines");
    return parseResponse(response);
  },

  async getById(id) {
    const response = await apiFetch(`/atlas/deadlines/${id}`);
    return parseResponse(response);
  },

  async getPending() {
    const response = await apiFetch("/atlas/deadlines/pending");
    return parseResponse(response);
  },

  async getCompleted() {
    const response = await apiFetch("/atlas/deadlines/completed");
    return parseResponse(response);
  },

  async getUpcoming() {
    const response = await apiFetch("/atlas/deadlines/upcoming");
    return parseResponse(response);
  },

  async getOverdue() {
    const response = await apiFetch("/atlas/deadlines/overdue");
    return parseResponse(response);
  },

  async getDueWithinDays(days) {
    const response = await apiFetch(`/atlas/deadlines/due-within/${days}`);
    return parseResponse(response);
  },

  async getByCourse(courseId) {
    const response = await apiFetch(`/atlas/deadlines/course/${courseId}`);
    return parseResponse(response);
  },

  async getStats() {
    const response = await apiFetch("/atlas/deadlines/stats");
    return parseResponse(response);
  },

  async create(deadline) {
    const response = await apiFetch("/atlas/deadlines", {
      method: "POST",
      body: JSON.stringify(deadline),
    });
    return parseResponse(response);
  },

  async update(id, deadline) {
    const response = await apiFetch(`/atlas/deadlines/${id}`, {
      method: "PUT",
      body: JSON.stringify(deadline),
    });
    return parseResponse(response);
  },

  async toggleCompletion(id) {
    const response = await apiFetch(`/atlas/deadlines/${id}/toggle`, {
      method: "PATCH",
    });
    return parseResponse(response);
  },

  async delete(id) {
    const response = await apiFetch(`/atlas/deadlines/${id}`, {
      method: "DELETE",
    });
    return parseResponse(response);
  },
};

// ============================================
// Wellbeing API (Atlas Module)
// ============================================
export const wellbeingAPI = {
  async getAll() {
    const response = await apiFetch("/atlas/wellbeing");
    return parseResponse(response);
  },

  async getById(id) {
    const response = await apiFetch(`/atlas/wellbeing/${id}`);
    return parseResponse(response);
  },

  async getToday() {
    const response = await apiFetch("/atlas/wellbeing/today");
    return parseResponse(response);
  },

  async getWeekly() {
    const response = await apiFetch("/atlas/wellbeing/week");
    return parseResponse(response);
  },

  async getMonthly() {
    const response = await apiFetch("/atlas/wellbeing/month");
    return parseResponse(response);
  },

  async getStats() {
    const response = await apiFetch("/atlas/wellbeing/stats");
    return parseResponse(response);
  },

  async getStreak() {
    const response = await apiFetch("/atlas/wellbeing/streak");
    return parseResponse(response);
  },

  async create(checkIn) {
    const response = await apiFetch("/atlas/wellbeing", {
      method: "POST",
      body: JSON.stringify(checkIn),
    });
    return parseResponse(response);
  },

  async update(id, checkIn) {
    const response = await apiFetch(`/atlas/wellbeing/${id}`, {
      method: "PUT",
      body: JSON.stringify(checkIn),
    });
    return parseResponse(response);
  },

  async delete(id) {
    const response = await apiFetch(`/atlas/wellbeing/${id}`, {
      method: "DELETE",
    });
    return parseResponse(response);
  },
};

// Export all APIs
export default {
  auth: authAPI,
  courses: coursesAPI,
  deadlines: deadlinesAPI,
  wellbeing: wellbeingAPI,
};
