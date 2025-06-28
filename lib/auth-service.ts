import axios from "axios";
import { SignInFormValues, SignUpFormValues } from "./schema";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID || "",
    CLIENT_SECRET: process.env.NEXT_PUBLIC_CLIENT_SECRET || "",
  },
});

export const authService = {
  async signUp(data: SignUpFormValues) {
    const endpoint = "/api/register";
    const response = await api.post(endpoint, data);
    return response.data;
  },

  async signIn(data: SignInFormValues) {
    const response = await api.post("/api/login", data);
    return response.data;
  },

  async signOut() {
    const response = await api.post("/api/logout");
    return response.data;
  },
};
