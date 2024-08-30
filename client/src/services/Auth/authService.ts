import axios from "axios";

interface Login {
  email: string;
  password: string;
}

export async function login(value: Login) {
  const API_URL = import.meta.env.VITE_URL_ENDPOINT_API;

  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, value);
    return response.data;
  } catch (error) {
    throw new Error("Failed to login");
  }
}
