import { useLogoutMutation } from "../../store/authApi";
export default function Dashboard() {
  const [logout] = useLogoutMutation();
  return (
    <div>
      <h1>Dashboard</h1>
      <button className="bg-white" onClick={logout}>logout</button>
    </div>
  );
}
