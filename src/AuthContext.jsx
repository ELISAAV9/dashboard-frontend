import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { login as loginApi, getToken, saveToken, clearToken, tokenValido } from "./api.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function leerUsuario(token) {
  if (!token || !tokenValido(token)) return null;
  const d = jwtDecode(token);
  return d.preferred_username || d.sub;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const usuario = leerUsuario(token);

  const login = async (username, password) => {
    const t = await loginApi(username, password);
    console.log("JWT recibido de Keycloak:", t);
    saveToken(t);
    setToken(t);
  };

  const logout = () => {
    clearToken();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, usuario, autenticado: !!usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
