import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email: string;
  username: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const response = await axios.post(`localhost:3000/api/auth/login`, data);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getDecodedToken = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
