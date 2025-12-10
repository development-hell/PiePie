import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "@/features/Auth/api";
import type { LoginCredentials, RegisterCredentials, User } from "@/features/Auth/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
    } catch (err) {
      // 401 or 403 expected if not logged in
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    // setIsLoading(true); // Don't trigger global loading
    setError(null);
    try {
      const data = await authApi.login(credentials);
      // data should contain { access, refresh }
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      await checkAuth(); // Re-fetch user data using the new token
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
      throw err;
    } finally {
      // setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    // setIsLoading(true);
    setError(null);
    try {
      await authApi.register(credentials);
      // ... (logic remains same) ...
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
      throw err;
    } finally {
      // setIsLoading(false);
    }
  };

  const logout = async () => {
    // setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      // setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      const updatedUser = await authApi.updateProfile(data);
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Profile update failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        checkAuth,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
