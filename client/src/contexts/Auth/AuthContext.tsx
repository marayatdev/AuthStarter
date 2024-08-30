import React, { createContext, useContext, useState, useEffect } from "react";

// import a library to manage cookies, e.g., js-cookie
import Cookies from "js-cookie";

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [refreshToken, setRefreshTokenState] = useState<string | null>(() => {
    return Cookies.get("refreshToken") || null;
  });

  const setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
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
      value={{ token, refreshToken, setToken, setRefreshToken }}
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
