import axios from "axios";
import { Login } from "../../interfaces/auth";
import { Register } from "../../pages/Auth/Register/Register";



const API_URL = import.meta.env.VITE_URL_ENDPOINT_API;


export async function register(value: Register) {
  const formData = new FormData();
  formData.append("username", value.username);
  formData.append("email", value.email);
  formData.append("password", value.password);
  if (value.image_profile) {
    formData.append("image_profile", value.image_profile);
  }

  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error("Failed to register");
    }
  }
}



export async function login(value: Login) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, value);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error("Failed to login");
    }
  }
}

export async function loadUser() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to load user");
  }
}

export async function logout() {
  localStorage.removeItem("token");
  document.cookie =
    "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
