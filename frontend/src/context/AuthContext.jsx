import { createContext, useState } from "react";

// Acts as broadcast channel
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Init state
  // Keeps user logged in on refresh
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Create login func
  const login = (newToken) => {
    // Update React state
    setToken(newToken);
    // Save to browsers localStorage
    localStorage.setItem("token", newToken);
  };

  // Create logout func
  const logout = () => {
    // Clear React state
    setToken(null);
    // Remove token from localStorage
    localStorage.removeItem("token");
  };

  // Wrap entire application in AuthProvider, giving everything access to these values
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
