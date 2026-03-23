import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "border-2 border-slate-600 text-white hover:bg-white/5 hover:border-slate-500",
  secondary:
    "bg-[#1a1d21] border border-slate-700/50 text-slate-300 hover:bg-[#1f2328] hover:border-slate-600",
  outline:
    "border-2 border-slate-600 text-white hover:bg-white/5 hover:border-slate-500",
  ghost:
    "text-slate-300 hover:bg-white/5",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-6 py-3.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
  disabled = false,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`
        relative inline-flex items-center justify-center font-semibold rounded-xl
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading && (
        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
      )}
      {children}
    </button>
  );
}
