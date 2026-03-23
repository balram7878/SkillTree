import { forwardRef, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

const Input = forwardRef(function Input(
  { label, error, type = "text", hint, className = "", ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={`
            w-full px-4 py-3.5 rounded-xl
            bg-[#1a1d21] border border-slate-700/50
            text-white placeholder-slate-500
            transition-all duration-200
            focus:outline-none focus:border-slate-500
            ${error ? "border-red-500 focus:border-red-500 animate-shake" : ""}
            ${isPassword ? "pr-12" : ""}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {hint && !error && (
        <p className="mt-2 text-sm text-slate-500">{hint}</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
