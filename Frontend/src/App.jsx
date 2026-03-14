import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import routeConfig from "./app/router/routeConfig";


export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path={routeConfig.login} element={<Login />} />
          <Route path={routeConfig.signup} element={<Signup />} />
          <Route path={routeConfig.verifyEmail} element={<VerifyEmail />} />
          <Route path={routeConfig.resetPassword} element={<ResetPassword />} />
          <Route path={routeConfig.forgotPassword} element={<ForgetPassword />} />
          <Route path={routeConfig.dashboard} element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}
