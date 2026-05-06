import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import BookService from './pages/BookServices';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'admin') return <Navigate to="/services" />;
    return children;
};

// New: Manager route guard
const ManagerRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'manager') return <Navigate to="/services" />;
    return children;
};

const AppRoutes = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/services" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/services" element={<Services />} />

                <Route path="/book/:serviceId" element={
                    <ProtectedRoute><BookService /></ProtectedRoute>
                } />
                <Route path="/my-bookings" element={
                    <ProtectedRoute><MyBookings /></ProtectedRoute>
                } />
                <Route path="/admin" element={
                    <AdminRoute><AdminDashboard /></AdminRoute>
                } />
                {/* New manager route */}
                <Route path="/manager" element={
                    <ManagerRoute><ManagerDashboard /></ManagerRoute>
                } />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;