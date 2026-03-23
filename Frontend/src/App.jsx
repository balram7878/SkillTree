import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import routeConfig from "./app/router/routeConfig";
import { useGetMeQuery } from "./store/authApi";

// Blocks unauthenticated users from private routes.
// Waits for the initial getMe check to settle before rendering.
function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialized } = useSelector((s) => s.auth);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0d0f12] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={routeConfig.login} replace />
  );
}

// Redirects already-authenticated users away from auth pages.
function PublicRoute({ children }) {
  const { isAuthenticated, isInitialized } = useSelector((s) => s.auth);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0d0f12] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? (
    <Navigate to={routeConfig.dashboard} replace />
  ) : (
    children
  );
}

export default function App() {
  // Runs on mount — resolves auth state via httpOnly cookie.
  // authSlice extraReducers set isInitialized=true when this settles.
  useGetMeQuery();

  return (
    <Router>
      <Routes>
        <Route
          path={routeConfig.login}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path={routeConfig.signup}
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        {/* verifyEmail is public — accessed from email links + waiting screen */}
        <Route path={routeConfig.verifyEmail} element={<VerifyEmail />} />
        <Route
          path={routeConfig.resetPassword}
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path={routeConfig.forgotPassword}
          element={
            <PublicRoute>
              <ForgetPassword />
            </PublicRoute>
          }
        />
        <Route
          path={routeConfig.dashboard}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
