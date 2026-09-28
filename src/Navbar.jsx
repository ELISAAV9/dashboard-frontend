import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand navbar-dark app-nav">
      <div className="container">
        <span className="navbar-brand brand">Mi guardarropa</span>
        <div className="navbar-nav me-auto">
          <NavLink to="/" end className="nav-link">Mis prendas</NavLink>
          <NavLink to="/agregar" className="nav-link">Agregar prenda</NavLink>
        </div>
        <span className="text-white-50 me-3 d-none d-sm-inline">{usuario}</span>
        <button className="btn btn-outline-light btn-sm" onClick={salir}>Cerrar sesión</button>
      </div>
    </nav>
  );
}
