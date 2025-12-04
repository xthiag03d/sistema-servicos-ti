import { NavLink, Outlet } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

export default function Layout() {
  const { message } = useData();

  return (
    <div className="container">
      <h1>🖥️ Sistema de Serviços de TI</h1>
      
      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <nav className="nav">
        <NavLink to="/" className="nav-link">
          📊 Dashboard
        </NavLink>
        <NavLink to="/clientes" className="nav-link">
          👥 Clientes
        </NavLink>
        <NavLink to="/servicos" className="nav-link">
          🔧 Serviços
        </NavLink>
        <NavLink to="/avaliacoes" className="nav-link">
          ⭐ Avaliações
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
}