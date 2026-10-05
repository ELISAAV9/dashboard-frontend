import axios from "axios";
import { jwtDecode } from "jwt-decode";

const KC = import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8081";
const REALM = import.meta.env.VITE_KEYCLOAK_REALM || "cybersecurity";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || "fastapi-api";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const KEY = "jwt";

export const getToken = () => localStorage.getItem(KEY);
export const saveToken = (t) => localStorage.setItem(KEY, t);
export const clearToken = () => localStorage.removeItem(KEY);

export function tokenValido(t) {
  try {
    return jwtDecode(t).exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Login: pide el JWT a Keycloak (que valida usuario/clave contra LDAP)
export async function login(username, password) {
  const body = new URLSearchParams({
    grant_type: "password",
    client_id: CLIENT_ID,
    username,
    password,
  });
  const { data } = await axios.post(
    `${KC}/realms/${REALM}/protocol/openid-connect/token`,
    body
  );
  return data.access_token;
}

// Cliente para el backend: inyecta el JWT en cada request
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
