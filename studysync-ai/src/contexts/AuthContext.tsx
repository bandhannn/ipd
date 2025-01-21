import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { Account, Client, ID } from "appwrite"

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Set your Appwrite endpoint
  .setProject("YOUR_PROJECT_ID") // Set your project ID

const account = new Account(client)

interface AuthContextType {
  user: any
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUserStatus()
  }, [])

  const checkUserStatus = async () => {
    try {
      const session = await account.get()
      setUser(session)
    } catch (error) {
      console.error("User is not logged in")
    }
  }

  const login = async (email: string, password: string) => {
    try {
      await account.createSession(email, password)
      await checkUserStatus()
    } catch (error) {
      console.error("Login failed", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await account.deleteSession("current")
      setUser(null)
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      await account.create(ID.unique(), email, password, name)
      await login(email, password)
    } catch (error) {
      console.error("Signup failed", error)
      throw error
    }
  }

  const value = {
    user,
    login,
    logout,
    signup,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

