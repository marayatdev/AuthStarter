import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface User {
  username: string | null;
  email: string | null;
  imageProfile: string | null;
  role: number;
}

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  user: User;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setTokenState] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [refreshToken, setRefreshTokenState] = useState<string | null>(
    () => Cookies.get("refreshToken") || null
  );
  const [user, setUser] = useState<User>({
    username: null,
    email: null,
    imageProfile: null,
    role: 0,
  });

  const setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("token", token);
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          username: decoded.username || null,
          email: decoded.email || null,
          imageProfile: decoded.image_profile || null,
          role: decoded.role || 0,
        });
      } catch {
        setUser({ username: null, email: null, imageProfile: null, role: 0 });
      }
    } else {
      localStorage.removeItem("token");
      setUser({ username: null, email: null, imageProfile: null, role: 0 });
    }
    setTokenState(token);
  };

  const setRefreshToken = (refreshToken: string | null) => {
    if (refreshToken) {
      Cookies.set("refreshToken", refreshToken, { expires: 7 }); // Expires in 7 days
    } else {
      Cookies.remove("refreshToken");
    }
    setRefreshTokenState(refreshToken);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = Cookies.get("refreshToken");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, refreshToken, user, setToken, setRefreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
