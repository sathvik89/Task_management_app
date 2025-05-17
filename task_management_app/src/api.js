const API_URI = "https://task-management-app-4262.onrender.com/api";

// Helper to attach Authorization header using stored token
export const fetchWithToken = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URI}${url}`, {
      ...options,
      headers,
    });

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: "An unknown error occurred",
      }));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    return response;
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
};

// Login API call
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URI}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data; // expected { user, token }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Register API call
export const register = async (name, email, password, isAdmin = false) => {
  try {
    const response = await fetch(`${API_URI}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, isAdmin }), // ✅ Send isAdmin to backend
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data; // expected { user, token, message }
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Logout API call
export const logout = async () => {
  // Just clear local storage, no need for server call
  localStorage.removeItem("userInfo");
  localStorage.removeItem("token");
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await fetchWithToken("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};

// Update password
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await fetchWithToken("/auth/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to update password:", error);
    throw error;
  }
};

// Task API calls
export const getTasks = async (filters = {}) => {
  try {
    // Convert filters object to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response = await fetchWithToken(`/tasks?${queryParams}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw error;
  }
};

export const getTaskById = async (id) => {
  try {
    const response = await fetchWithToken(`/tasks/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch task ${id}:`, error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await fetchWithToken("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to create task:", error);
    throw error;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const response = await fetchWithToken(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    });
    return await response.json();
  } catch (error) {
    console.error(`Failed to update task ${id}:`, error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await fetchWithToken(`/tasks/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error(`Failed to delete task ${id}:`, error);
    throw error;
  }
};

export const restoreTask = async (id) => {
  try {
    const response = await fetchWithToken(`/tasks/${id}/restore`, {
      method: "PUT",
    });
    return await response.json();
  } catch (error) {
    console.error(`Failed to restore task ${id}:`, error);
    throw error;
  }
};

export const permanentDeleteTask = async (id) => {
  try {
    const response = await fetchWithToken(`/tasks/${id}/permanent`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error(`Failed to permanently delete task ${id}:`, error);
    throw error;
  }
};

export const getDeletedTasks = async () => {
  try {
    const response = await fetchWithToken("/tasks/trash");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch deleted tasks:", error);
    throw error;
  }
};

export const getTaskStats = async () => {
  try {
    const response = await fetchWithToken("/tasks/stats");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch task statistics:", error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await fetchWithToken("/auth/users");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};
