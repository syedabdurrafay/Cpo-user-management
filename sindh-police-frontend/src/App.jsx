import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/public/Home";
import AdminDashboard from "./pages/Dashboard/Admin";
import DigDashboard from "./pages/Dashboard/digDashboard";
import SSPDashboard from "./pages/Dashboard/SSP";
import Employees from "./pages/Employees";
import Login from "./pages/Auth/Login";
import Registration from "./pages/Auth/Registration";
import IGProfile from "./components/IGProfile";
import Layout from './components/Layout';
import './index.css';
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles && !allowedRoles.some(role => 
    user.role && user.role.toUpperCase() === role.toUpperCase()
  )) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/dashboard/admin" 
          element={
            <ProtectedRoute allowedRoles={['IG', 'ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/personnel" 
          element={
            <ProtectedRoute allowedRoles={['IG', 'ADMIN']}>
              <Employees />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute allowedRoles={['IG', 'ADMIN']}>
              <IGProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected DIG Routes */}
        <Route 
          path="/dashboard/dig" 
          element={
            <ProtectedRoute allowedRoles={['DIG', 'AIG', 'IG', 'ADMIN']}>
              <DigDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected SSP Routes */}
        <Route 
          path="/dashboard/ssp" 
          element={
            <ProtectedRoute allowedRoles={['SSP', 'IG', 'ADMIN']}>
              <SSPDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Error Routes */}
        <Route path="/unauthorized" element={
          <div className="unauthorized-page">
            <h1>401 - Unauthorized Access</h1>
            <p>You don't have permission to access this page.</p>
            <a href="/">Return to Home</a>
          </div>
        } />
        
        <Route path="*" element={
          <div className="not-found-page">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/">Return to Home</a>
          </div>
        } />
      </Routes>
    </div>
  );
}