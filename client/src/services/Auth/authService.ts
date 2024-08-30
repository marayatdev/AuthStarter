import axios from "axios";

const API_URL = import.meta.env.VITE_URL_ENDPOINT_API;

export interface LoginResponse {
  token: string;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post(
    `${API_URL}/api/auth/login`,
    { email, password },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};



export const fetchUserDetails = async (token: string) => {
  const response = await axios.get(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
