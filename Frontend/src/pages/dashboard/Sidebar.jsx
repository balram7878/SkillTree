import {
  Clock3,
  Code2,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";
import { useLogoutMutation } from "../../store/authApi";

export default function Sidebar() {
  const [logout] = useLogoutMutation();

  return (
    <>
      <aside className="w-64 bg-white border-r border-[#E8DDD0] hidden md:flex flex-col py-6 shrink-0 z-10 max-h-screen">
        <nav className="flex-1 space-y-2 px-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl bg-[#F5F0EB] text-[#F97316] font-bold shadow-sm transition-all hover:opacity-90">
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl text-[#6B6B6B] hover:bg-[#F5F0EB] hover:text-[#1C1C1C] font-medium transition-all">
            <Code2 className="w-5 h-5 flex-shrink-0" />
            My Skills
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl text-[#6B6B6B] hover:bg-[#F5F0EB] hover:text-[#1C1C1C] font-medium transition-all">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            Verify Skills
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl text-[#6B6B6B] hover:bg-[#F5F0EB] hover:text-[#1C1C1C] font-medium transition-all">
            <Clock3 className="w-5 h-5 flex-shrink-0" />
            History
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl text-[#6B6B6B] hover:bg-[#F5F0EB] hover:text-[#1C1C1C] font-medium transition-all">
            <User className="w-5 h-5 flex-shrink-0" />
            Profile
          </button>
        </nav>

        <div className="px-4 mt-auto">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl text-[#6B6B6B] hover:bg-red-50 hover:text-red-700 font-medium transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
