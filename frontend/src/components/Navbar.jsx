import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={18} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={18} /> },
  ];

  return (
    <nav className="navbar glass-panel container" style={{ marginTop: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
        <div style={{ width: '32px', height: '32px', background: 'var(--accent-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckSquare size={20} color="white" />
        </div>
        Ethara
      </div>
      
      <div className="nav-links">
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path} 
            className={location.pathname === item.path ? 'active' : ''}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {item.icon} {item.name}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user?.name}</div>
            <div className={`badge ${user?.role === 'Admin' ? 'badge-admin' : 'badge-member'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
              {user?.role}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
