import { useSelector } from "react-redux";
import { Bell } from "lucide-react";

export default function Header() {
  const { user } = useSelector((s) => s.auth);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E8DDD0] h-16 px-6 flex items-center justify-between shrink-0">
      <div className="flex-1">
        <span className="text-[#F97316] text-xl font-black tracking-tight">
          SkillTree
        </span>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative text-[#6B6B6B] hover:text-[#1C1C1C] transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#F97316] rounded-full border border-white"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#F5F0EB] border border-[#E8DDD0] flex items-center justify-center text-[#F97316] font-bold text-sm overflow-hidden">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-lg">{user?.name?.charAt(0) || "U"}</span>
            )}
          </div>
          <span className="text-sm font-medium hidden sm:block">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
}
