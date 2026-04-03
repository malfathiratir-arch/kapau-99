import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, isStaff, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Berhasil logout!');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isStaff ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 leading-tight text-sm">Rumah Makan</p>
              <p className="font-extrabold text-orange-500 leading-tight text-base">Kapau 99</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {!isStaff && (
              <>
                <NavLink to="/" active={isActive('/')}>Home</NavLink>
                <NavLink to="/menu" active={isActive('/menu')}>Menu</NavLink>
                {user && <NavLink to="/orders" active={isActive('/orders')}>Pesanan Saya</NavLink>}
              </>
            )}
            {isStaff && (
              <>
                <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
                <NavLink to="/menu-management" active={isActive('/menu-management')}>Kelola Menu</NavLink>
                <NavLink to="/order-management" active={isActive('/order-management')}>Pesanan</NavLink>
                {isAdmin && <NavLink to="/petugas-management" active={isActive('/petugas-management')}>Petugas</NavLink>}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user && !isStaff && (
              <Link to="/cart" className="relative">
                <button className="w-10 h-10 bg-orange-50 hover:bg-orange-100 rounded-xl flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce-in">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </button>
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 rounded-xl px-3 py-2 transition-colors">
                  <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user.name[0].toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hidden sm:block max-w-24 truncate">{user.name}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-slide-up z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Login sebagai</p>
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : user.role === 'petugas' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {user.role}
                      </span>
                    </div>
                    <button
                      onClick={() => { setMenuOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="btn-primary py-2 px-5 text-sm">Masuk</button>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button className="md:hidden w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-2 animate-slide-up">
            {!isStaff && (
              <>
                <MobileLink to="/" onClick={() => setMenuOpen(false)}>🏠 Home</MobileLink>
                <MobileLink to="/menu" onClick={() => setMenuOpen(false)}>🍛 Menu</MobileLink>
                {user && <MobileLink to="/orders" onClick={() => setMenuOpen(false)}>📋 Pesanan Saya</MobileLink>}
              </>
            )}
            {isStaff && (
              <>
                <MobileLink to="/dashboard" onClick={() => setMenuOpen(false)}>📊 Dashboard</MobileLink>
                <MobileLink to="/menu-management" onClick={() => setMenuOpen(false)}>🍽️ Kelola Menu</MobileLink>
                <MobileLink to="/order-management" onClick={() => setMenuOpen(false)}>📦 Pesanan</MobileLink>
                {isAdmin && <MobileLink to="/petugas-management" onClick={() => setMenuOpen(false)}>👥 Petugas</MobileLink>}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

const NavLink = ({ to, active, children }) => (
  <Link to={to} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${active ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500'}`}>
    {children}
  </Link>
);

const MobileLink = ({ to, onClick, children }) => (
  <Link to={to} onClick={onClick} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-xl transition-colors">
    {children}
  </Link>
);
