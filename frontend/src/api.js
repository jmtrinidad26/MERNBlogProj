import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export { API_URL };
axios.defaults.headers.common["Authorization"] = sessionStorage.getItem("User") 
  ? `Bearer ${sessionStorage.getItem("User")}` 
  : "";

const handleError = (error) => {
  if (error.response) {
    throw error;
  } else if (error.request) {
    throw new Error("Network error. Please check your connection.");
  } else {
    throw new Error("An unexpected error occurred.");
  }
};

export async function getPosts() {
  try {
    const res = await axios.get(`${API_URL}/posts`);
    if (res.status === 200) {
      return res.data || [];
    }
    return [];
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function getPost(id) {
  try {
    const res = await axios.get(`${API_URL}/posts/${id}`);
    if (res.status === 200) {
      return res.data;
    }
    return null;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function createPost(post) {
  try {
    const res = await axios.post(`${API_URL}/posts`, post);
    return res;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function updatePost(id, post) {
  try {
    const token = sessionStorage.getItem("User");
    console.log('Frontend Update Debug:', {
      token: token ? 'Token exists' : 'No token',
      tokenLength: token?.length,
      tokenStart: token?.substring(0, 20) + '...'
    });
    const res = await axios.put(`${API_URL}/posts/${id}`, post);
    return res;
  } catch (error) {
    console.error('Update post error:', error.response?.data);
    handleError(error);
    throw error;
  }
}

export async function deletePost(id) {
  try {
    const token = sessionStorage.getItem("User");
    console.log('Frontend Delete Debug:', {
      token: token ? 'Token exists' : 'No token',
      tokenLength: token?.length,
      tokenStart: token?.substring(0, 20) + '...'
    });
    const res = await axios.delete(`${API_URL}/posts/${id}`);
    return res;
  } catch (error) {
    console.error('Delete post error:', error.response?.data);
    handleError(error);
    throw error;
  }
}

export async function createUser(user) {
  try {
    const res = await axios.post(`${API_URL}/users`, user);
    return res;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function updateUser(id, user) {
  try {
    const res = await axios.put(`${API_URL}/users/${id}`, user);
    return res;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    const res = await axios.delete(`${API_URL}/users/${id}`);
    return res;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function verifyUser(user) {
  try {
    const res = await axios.post(`${API_URL}/users/login`, user);
    if (res.data.success) {
      return res.data.token;
    } else {
      throw new Error(res.data.message || "Invalid credentials");
    }
  } catch (error) {
    handleError(error);
    throw error;
  }
}
