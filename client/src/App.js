import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TripDetails from './pages/TripDetails';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NavigationBar from './components/NavigationBar';
import CheckoutPage from './pages/CheckoutPage';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import { CartProvider } from './contexts/CartContext';
import Cart from './pages/Cart';
const Layout = () => (
  <div className="min-h-screen bg-gray-50">
    <NavigationBar />
    <main className="max-w-7xl mx-auto px-4 py-6">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/trips/:id" element={<TripDetails />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </main>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
     <CartProvider>
      <Router>
        <Layout />
      </Router>
     </CartProvider>
    </AuthProvider>
  );
};
<Route path="/cart" element={<Cart />} />
export default App;