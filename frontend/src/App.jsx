import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Dashboard from './pages/Dashboard';
import MenuManagement from './pages/MenuManagement';
import OrderManagement from './pages/OrderManagement';
import PetugasManagement from './pages/PetugasManagement';

// Components
import Navbar from './components/Navbar';
import AiChat from './components/AiChat';
import CartFloating from './components/CartFloating';

// Route guards
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" /></div>;
  return user ? children : <Navigate to="/login" />;
};

const UserRoute = ({ children }) => {
  const { user, loading, isUser } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (!isUser) return <Navigate to="/dashboard" />;
  return children;
};

const StaffRoute = ({ children }) => {
  const { user, loading, isStaff } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (!isStaff) return <Navigate to="/" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading, isStaff } = useAuth();
  if (loading) return null;
  if (user && isStaff) return <Navigate to="/dashboard" />;
  if (user) return <Navigate to="/" />;
  return children;
};

const AppLayout = ({ children }) => {
  const { user, isStaff } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      {user && !isStaff && (
        <>
          <CartFloating />
          <AiChat />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: { borderRadius: '12px', fontFamily: 'Plus Jakarta Sans, sans-serif' },
              success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
            }}
          />
          <Routes>
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

            {/* User routes */}
            <Route path="/" element={<AppLayout><Home /></AppLayout>} />
            <Route path="/menu" element={<AppLayout><Menu /></AppLayout>} />
            <Route path="/cart" element={<PrivateRoute><AppLayout><Cart /></AppLayout></PrivateRoute>} />
            <Route path="/checkout" element={<UserRoute><AppLayout><Checkout /></AppLayout></UserRoute>} />
            <Route path="/orders" element={<UserRoute><AppLayout><Orders /></AppLayout></UserRoute>} />

            {/* Staff routes */}
            <Route path="/dashboard" element={<StaffRoute><AppLayout><Dashboard /></AppLayout></StaffRoute>} />
            <Route path="/menu-management" element={<StaffRoute><AppLayout><MenuManagement /></AppLayout></StaffRoute>} />
            <Route path="/order-management" element={<StaffRoute><AppLayout><OrderManagement /></AppLayout></StaffRoute>} />
            <Route path="/petugas-management" element={<AdminRoute><AppLayout><PetugasManagement /></AppLayout></AdminRoute>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
