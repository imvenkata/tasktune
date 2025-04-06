"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Define the backend URL using the environment variable that Docker sets
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
console.log("[AuthProvider] Using Backend URL:", BACKEND_URL); // Log Backend URL

interface User {
  id: number // Assuming ID is a number from the backend
  email: string
  // Add other fields returned by your /me endpoint if needed (e.g., name)
  // name?: string;
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  token: string | null // Store the JWT token
  refreshToken: string | null // Store the refresh token
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }> // Keep name for consistency, though backend might not use it directly
  logout: () => void
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response> // Helper for authenticated requests
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Start loading until initial check is done
  const router = useRouter()

  const logout = () => {
    console.log("[AuthProvider] logout called.");
    setUser(null)
    setToken(null)
    setRefreshToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    setIsLoading(false) // Ensure loading is set to false when logging out
    router.push("/auth") // Redirect to login page
  }

  // Check for existing token on initial load
  useEffect(() => {
    console.log("[AuthProvider] Initial useEffect running...");
    const storedToken = localStorage.getItem("token")
    const storedRefreshToken = localStorage.getItem("refreshToken")
    console.log("[AuthProvider] Stored token from localStorage:", storedToken);
    if (storedToken) {
      setToken(storedToken)
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken)
      }
      console.log("[AuthProvider] Token state set, calling fetchUserProfile...");
      fetchUserProfile(storedToken) 
        .catch(error => {
          console.error("[AuthProvider] Error in token validation flow:", error);
          // Try to refresh the token if we have a refresh token
          if (storedRefreshToken) {
            refreshAccessToken(storedRefreshToken)
              .catch(() => {
                logout(); // Force logout if refresh fails
              });
          } else {
            logout(); // Force logout if no refresh token
          }
        });
    } else {
      console.log("[AuthProvider] No token found, setting isLoading to false.");
      setIsLoading(false) // No token, stop loading
      router.push('/auth'); // Force redirect to auth page when no token is found
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array ensures this runs only once on mount

  const refreshAccessToken = async (currentRefreshToken: string): Promise<boolean> => {
    console.log("[AuthProvider] Attempting to refresh access token");
    try {
      const response = await fetch(`${BACKEND_URL}/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: currentRefreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.access_token;
        console.log("[AuthProvider] Token refresh successful");
        
        // Update state and localStorage
        setToken(newAccessToken);
        localStorage.setItem("token", newAccessToken);
        
        // Fetch user profile with new token
        await fetchUserProfile(newAccessToken);
        return true;
      } else {
        console.error("[AuthProvider] Token refresh failed:", response.status);
        return false;
      }
    } catch (error) {
      console.error("[AuthProvider] Error refreshing token:", error);
      return false;
    }
  };

  // Fetch user profile function
  const fetchUserProfile = async (currentToken: string) => {
    console.log("[AuthProvider] fetchUserProfile called with token:", currentToken);
    // Ensure loading is true when fetching profile
    // setIsLoading(true); // Already set to true initially, uncomment if needed elsewhere
    try {
      console.log(`[AuthProvider] Fetching ${BACKEND_URL}/me`);
      const response = await fetch(`${BACKEND_URL}/me`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      })
      console.log("[AuthProvider] /me response status:", response.status);

      if (response.ok) {
        const userData: User = await response.json()
        console.log("[AuthProvider] /me success, user data:", userData);
        setUser(userData)
      } else {
        console.error("[AuthProvider] Failed to fetch user profile, status:", response.status, response.statusText);
        // Token might be invalid or expired
        logout() // Clear invalid token and user data
      }
    } catch (error) {
      console.error("[AuthProvider] Error fetching user profile:", error)
      logout() // Clear state on error
    } finally {
      console.log("[AuthProvider] fetchUserProfile finished, setting isLoading to false.");
      setIsLoading(false)
    }
  }

  // Authenticated fetch helper
  const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const currentToken = token || localStorage.getItem("token") // Ensure we use the latest token
    if (!currentToken) {
      console.log("[AuthProvider] fetchWithAuth: No token found, logging out.")
      logout() // Redirect to login if no token
      throw new Error("User not authenticated")
    }

    const headers = new Headers(options.headers || {})
    headers.append("Authorization", `Bearer ${currentToken}`)
    headers.append("Content-Type", "application/json") // Assume JSON content type

    console.log(`[AuthProvider] fetchWithAuth: Fetching ${BACKEND_URL}${url}`);
    let response = await fetch(`${BACKEND_URL}${url}`, {
      ...options,
      headers,
    })

    console.log(`[AuthProvider] fetchWithAuth: Response status for ${url}:`, response.status);
    
    // Handle token expiration
    if (response.status === 401) { 
      console.log("[AuthProvider] fetchWithAuth: Received 401, attempting token refresh");
      
      // Try to refresh the token
      const currentRefreshToken = refreshToken || localStorage.getItem("refreshToken");
      if (currentRefreshToken && await refreshAccessToken(currentRefreshToken)) {
        // Retry the request with the new token
        const newToken = localStorage.getItem("token");
        headers.set("Authorization", `Bearer ${newToken}`);
        
        console.log(`[AuthProvider] fetchWithAuth: Retrying ${BACKEND_URL}${url} with new token`);
        response = await fetch(`${BACKEND_URL}${url}`, {
          ...options,
          headers,
        });
      } else {
        console.log("[AuthProvider] fetchWithAuth: Token refresh failed, logging out");
        logout();
        throw new Error("Unauthorized");
      }
    }

    return response
  }


  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    let errorMsg: string | undefined = undefined;
    console.log(`[AuthProvider] Attempting login for ${email}`);
    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // FastAPI token endpoint expects form data
        },
        body: new URLSearchParams({
          username: email, // FastAPI's OAuth2PasswordRequestForm uses 'username'
          password: password,
        }),
      })
      console.log("[AuthProvider] /login response status:", response.status);

      if (response.ok) {
        const data = await response.json()
        const new_token = data.access_token
        const new_refresh_token = data.refresh_token
        console.log("[AuthProvider] Login successful, received tokens");
        
        // Store both tokens
        setToken(new_token)
        setRefreshToken(new_refresh_token)
        localStorage.setItem("token", new_token)
        localStorage.setItem("refreshToken", new_refresh_token)
        
        console.log("[AuthProvider] Tokens stored, fetching user profile...");
        await fetchUserProfile(new_token) // Fetch user profile after successful login
        router.push("/") // Redirect to home/dashboard after login
        return { success: true };
      } else {
        errorMsg = "Invalid credentials or server error."; // Default
        try {
           const errorData = await response.json();
           // Log the entire error data structure for detailed diagnostics
           console.error("[AuthProvider] Login failed, raw response data:", errorData);

           // Check if the error data is an empty object
           if (Object.keys(errorData).length === 0) {
               errorMsg = `Login failed with status ${response.status}: Received an empty error response.`;
               console.error(errorMsg); // Log the specific case
           } else {
                // Try to get a specific message, fallback to default
                errorMsg = errorData.detail?.[0]?.msg || errorData.detail || errorMsg;
                console.error("[AuthProvider] Login failed, processed error:", response.status, errorMsg);
           }
        } catch (parseError) {
            console.error("[AuthProvider] Login failed with status:", response.status, "Could not parse error response body.");
            errorMsg = `Login failed with status ${response.status}: Invalid error response format.`; // Provide status in fallback
        }
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error("[AuthProvider] Login network/fetch error:", error)
      errorMsg = "Network error or server unavailable. Please try again later.";
      return { success: false, error: errorMsg };
    } finally {
      // isLoading is set to false within fetchUserProfile called on success
      if (errorMsg) setIsLoading(false); // Ensure loading stops on error too
       console.log("[AuthProvider] Login function finished.");
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    let errorMsg: string | undefined = undefined;
    console.log(`[AuthProvider] Attempting signup for ${email}`);
    try {
      const response = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }), // Include name if your backend /register expects it
      })
      console.log("[AuthProvider] /register response status:", response.status);

      if (response.ok) {
        console.log("[AuthProvider] Signup successful, attempting auto-login...");
        // Automatically log in the user after successful registration
        const loginResult = await login(email, password)
        return loginResult // Return the result of the login attempt

      } else {
         errorMsg = "Registration failed. Please try again."
         try {
             const errorData = await response.json();
             errorMsg = errorData.detail || errorMsg; // Use specific detail if available
             console.error("[AuthProvider] Signup failed:", response.status, errorMsg);
         } catch (parseError) {
            console.error("[AuthProvider] Signup failed with status:", response.status, "Could not parse error response.");
            errorMsg = `Signup failed with status ${response.status}: Invalid error response format.`; // Set specific error message
         }
         return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error("[AuthProvider] Signup network/fetch error:", error)
      errorMsg = "Network error or server unavailable during signup.";
      return { success: false, error: errorMsg };
    } finally {
      // isLoading is set to false via the subsequent login call
      if (errorMsg) setIsLoading(false); // Ensure loading stops on error too
      console.log("[AuthProvider] Signup function finished.");
    }
  }

  console.log("[AuthProvider] Rendering - isLoading:", isLoading, "Token:", token, "User:", user);
  return <AuthContext.Provider value={{ user, isLoading, token, refreshToken, login, signup, logout, fetchWithAuth }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

