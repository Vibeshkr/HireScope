import api from "../config/axios";

export const registerUser = async (userData) => {
  const response = await api.get( `/users?email=${encodeURIComponent(userData.email)}`);

  if (response.data.length > 0) {
    throw new Error(
      "An account with this email already exists."
    );
  }

  const result = await api.post("/users",userData);

  return result.data;
};

export const loginUser = async (email,password) => {
  const response = await api.get(`/users?email=${encodeURIComponent(email)}`);

  const user =response.data.find((item) =>item.password === password);

  if (!user) {
    throw new Error(
      "Invalid email or password."
    );
  }

  return user;
};

export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);

  return response.data;
};