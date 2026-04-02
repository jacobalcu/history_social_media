import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
// Acts as broadcast channel
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Init state
  // Keeps user logged in on refresh
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Acts as glocal net catching all Axios responses
    const interceptor = axios.interceptors.response.use(
      (response) => response, // If response is good, pass it through
      (error) => {
        // If backend says "401 Unauthorized" (expired/bad token)
        if (error.response?.status === 401) {
          console.warn("Token expired. Logging out");
          localStorage.removeItem("token");
          setToken(null);
          setCurrentUser(null);
        }
        return Promise.reject(error);
      },
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);

        console.log("My Decoded Token:", decoded);

        setCurrentUser({ id: decoded.sub, username: decoded.username });
      } catch (error) {
        console.error("Invalid token found. Logging out.");
        logout();
      }
    } else {
      setCurrentUser(null);
    }
  }, [token]);

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
    <AuthContext.Provider value={{ token, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
