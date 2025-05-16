const API_URI = "http://localhost:8800/api";

// Helper to attach Authorization header using stored token
export const fetchWithToken = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  return fetch(`${API_URI}${url}`, {
    ...options,
    headers,
  });
};

// Login API call
export const login = async (email, password) => {
  const response = await fetch(`${API_URI}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return await response.json(); // expected { user, token }
};

// Logout API call
export const logout = async () => {
  const response = await fetchWithToken("/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    console.warn("Failed to logout on server");
  }
};
