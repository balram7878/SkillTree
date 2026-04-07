import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import { useNetworkStatus } from "./components/hooks/useNetworkStatus";
import { useGetServerStatusQuery, useGetMeQuery } from "./store/authApi";
import ErrorState from "./components/ui/ErrorState";
import routeConfig from "./app/router/routeConfig";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgetPassword from "./pages/auth/ForgetPassword";
import LandingPage from "./pages/landing page/Landing";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialized } = useSelector((s) => s.auth);
  if (!isInitialized) {
    return <div className="min-h-screen bg-[#000]" />;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={routeConfig.login} replace />
  );
}

function PublicRoute({ children }) {
  const { isAuthenticated, isInitialized } = useSelector((s) => s.auth);
  if (isInitialized && isAuthenticated) {
    return <Navigate to={routeConfig.dashboard} replace />;
  }
  return children;
}

export default function App() {
  const isOnline = useNetworkStatus();

  // Health check — only runs when online. Polls every 30s.
  const { isError: serverDown, refetch: retryHealth } = useGetServerStatusQuery(
    undefined,
    {
      skip: !isOnline, // don't bother if already offline
      pollingInterval: 30000, // re-check every 30s automatically
    },
  );

  // Auth check — only runs when server is reachable
  const {
    isError: authTimedOut,
    error: authError,
    isFetching: authLoading,
    refetch: retryAuth,
  } = useGetMeQuery(undefined, {
    skip: !isOnline || serverDown,
  });

  // --- Error priority: offline > server down > timeout ---
  if (!isOnline) {
    return (
      <ErrorState
        type="offline"
        onRetry={() => {
          // just re-render, the online event will fire naturally
          // but you can force a re-check:
          if (navigator.onLine) retryHealth();
        }}
      />
    );
  }

  if (serverDown) {
    return <ErrorState type="server" onRetry={retryHealth} />;
  }

  // timeout = getMe took too long / failed for non-auth reasons
  // distinguish from 401 (which is normal "not logged in")
  // authTimedOut here means network error, not 401
  let isRealError = authTimedOut && authError?.status != 401;
  if (isRealError) {
    return <ErrorState type="timeout" onRetry={retryAuth} />;
  }

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
        <Route
          path={routeConfig.landingPage}
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
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
        ></Route>
      </Routes>
    </Router>
  );
}
