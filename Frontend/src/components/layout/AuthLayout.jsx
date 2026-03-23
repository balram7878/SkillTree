import { Outlet } from "react-router";

export default function AuthLayout({ children = null }) {
  return children || <Outlet />;
}
