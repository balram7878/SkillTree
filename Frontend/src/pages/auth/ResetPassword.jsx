import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { resetPasswordSchema } from "../../lib/validations/auth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import routes from "../../app/router/routeConfig";
import { useResetPasswordMutation } from "../../store/authApi";

function SkillTreeLogo({ size = 52 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="60"
        cy="60"
        rx="46"
        ry="28"
        stroke="#22c55e"
        strokeWidth="1.6"
        strokeOpacity="0.9"
        fill="none"
        transform="rotate(-55 60 60)"
      />
      <ellipse
        cx="60"
        cy="60"
        rx="46"
        ry="28"
        stroke="#16a34a"
        strokeWidth="1.4"
        strokeOpacity="0.75"
        fill="none"
        transform="rotate(5 60 60)"
      />
      <ellipse
        cx="60"
        cy="60"
        rx="46"
        ry="28"
        stroke="#4ade80"
        strokeWidth="1.2"
        strokeOpacity="0.6"
        fill="none"
        transform="rotate(65 60 60)"
      />
      <ellipse
        cx="60"
        cy="60"
        rx="22"
        ry="13"
        stroke="#86efac"
        strokeWidth="1"
        strokeOpacity="0.5"
        fill="none"
        transform="rotate(-55 60 60)"
      />
      <ellipse
        cx="60"
        cy="60"
        rx="22"
        ry="13"
        stroke="#4ade80"
        strokeWidth="0.9"
        strokeOpacity="0.4"
        fill="none"
        transform="rotate(5 60 60)"
      />
      <circle cx="60" cy="60" r="3.5" fill="#22c55e" fillOpacity="0.95" />
      <circle cx="60" cy="60" r="6" fill="#22c55e" fillOpacity="0.2" />
    </svg>
  );
}

function Card({ children }) {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-sm rounded-2xl px-8 py-10 bg-[#0a0a0a] border border-white/[0.07] shadow-[0_0_60px_rgba(34,197,94,0.05),0_25px_50px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col items-center mb-8 gap-2">
          <SkillTreeLogo size={52} />
          <span
            className="text-xl font-bold tracking-tight"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #86efac 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SkillTree
          </span>
        </div>
        {children}
      </div>
    </main>
  );
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [resetPassword, { isLoading, isSuccess, error }] =
    useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const serverError = error?.data?.message || error?.error || "";

  const onSubmit = async (data) => {
    // Token comes from the URL, but the backend expects it in request body.
    await resetPassword({ token, password: data.password });
  };

  if (isSuccess) {
    return (
      <Card>
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Password reset successful
          </h2>
          <p className="text-sm text-slate-400 mb-8">
            Your password has been updated. You can now log in with your new
            password.
          </p>
          <Button
            className="w-full"
            size="lg"
            onClick={() =>
              navigate(`${routes.login}?reset=success`, { replace: true })
            }
          >
            Continue to Login
          </Button>
        </div>
      </Card>
    );
  }

  if (!token) {
    return (
      <Card>
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Invalid Reset Link
          </h2>
          <p className="text-sm text-slate-400 mb-8">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <Link to={routes.forgotPassword}>
            <Button
              className="w-full text-white text-sm font-semibold cursor-pointer rounded-[10px] py-[10px] bg-[#343A40] border border-[#3f464d] transition-[background,border-color] duration-200 hover:bg-[#3f464d] hover:border-[#4b5563]"
              size="lg"
            >
              Request New Link
            </Button>
          </Link>
          <div className="mt-7">
            <Link
              to={routes.login}
              className="text-xs text-slate-500 hover:text-white font-semibold transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Reset your password
          </h2>
          <p className="text-sm text-slate-400">
            Enter your new password below.
          </p>
        </div>

        {serverError && (
          <div className="flex items-start gap-3 px-4 py-3 mb-6 rounded-xl bg-red-500/5 border border-red-500/20">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <p className="text-xs text-red-400 leading-relaxed">
              {serverError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} onChange={reset} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your new password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button
            type="submit"
            className="w-full text-white text-sm font-semibold cursor-pointer mt-1 rounded-[10px] py-[10px] bg-[#343A40] border border-[#3f464d] transition-[background,border-color] duration-200 hover:bg-[#3f464d] hover:border-[#4b5563]"
            size="lg"
            isLoading={isLoading}
          >
            Reset Password
          </Button>
        </form>

        <div className="mt-7 text-center">
          <Link
            to={routes.login}
            className="text-xs text-slate-500 hover:text-white font-semibold transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </Card>
  );
}
