import axios from "axios";
const URL = "http://localhost:3000";

export async function getPosts() {
  const res = await axios.get(`${URL}/posts`);

  if (res.status === 200) {
    return res.data;
  } else {
    return;
  }
}
export async function getPost(id) {
  const res = await axios.get(`${URL}/posts/${id}`);
  if (res.status === 200) {
    return res.data;
  } else {
    return;
  }
}
export async function createPost(post) {
  const res = await axios.post(`${URL}/posts`, post);
  return res;
}
export async function updatePost(id, post) {
  const res = await axios.put(`${URL}/posts/${id}`, post);
  return res;
}
export async function deletePost(id) {
  const res = await axios.delete(`${URL}/posts/${id}`);
  return res;
}

// USERS
export async function createUser(user) {
  const res = await axios.post(`${URL}/users`, user);
  return res;
}
export async function updateUser(id, user) {
  const res = await axios.put(`${URL}/users/${id}`, user);
  return res;
}
export async function deleteUser(id) {
  const res = await axios.delete(`${URL}/users/${id}`);
  return res;
}

// User login

export async function verifyUser(user) {
  const res = await axios.post(`${URL}/users/login`, user);
  if (res.data.success) {
     return res.data.token;
  } else {
    return
  }
}
