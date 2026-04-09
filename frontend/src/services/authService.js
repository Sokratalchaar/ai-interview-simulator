import axios from "axios";

const API = "https://ai-interview-backend-ehir.onrender.com/api/auth";

export const login = async (email, password) => {
  const response = await axios.post(`${API}/login`, {
    email,
    password,
  });

  return response.data;
};