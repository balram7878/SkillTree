import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router";
import { AlertCircle, Mail, CheckCircle2, RotateCcw } from "lucide-react";
import { forgotPasswordSchema, loginSchema } from "../../lib/validations/auth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import SocialButton from "../../components/ui/SocialButton";
import Divider from "../../components/ui/Divider";
import routes from "../../app/router/routeConfig";
import { useForgotPasswordMutation, useLoginMutation } from "../../store/authApi";

/* ── Lissajous-knot logo — same as Signup ───────────────────────────── */
function SkillTreeLogo({ size = 36 }) {
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

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 px-4 py-3 mb-5 rounded-xl bg-red-500/5 border border-red-500/20">
      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
      <p className="text-xs text-red-400 leading-relaxed">{message}</p>
    </div>
  );
}

function SuccessBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 px-4 py-3 mb-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
      <p className="text-xs text-emerald-400 leading-relaxed">{message}</p>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [login, { isLoading, error, reset }] = useLoginMutation();
  const [forgotPassword, { isLoading: isForgotLoading, error: forgotError }] =
    useForgotPasswordMutation();
  const [isResetOverlayOpen, setIsResetOverlayOpen] = useState(false);
  const [submittedResetEmail, setSubmittedResetEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
    reset: resetForgotForm,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const serverError = error?.data?.message || "";

  const oauthError = searchParams.get("error");

  const oauthErrorMessages = {
    server_error: "OAuth sign-in failed. Please try again.",
    google_failed: "Google sign-in failed. Please try again.",
    github_failed: "GitHub sign-in failed. Please try again.",
  };

  const oauthErrorMessage = oauthError
    ? oauthErrorMessages[oauthError] || decodeURIComponent(oauthError)
    : "";
  const resetSuccessMessage =
    searchParams.get("reset") === "success"
      ? "Password reset successful. You can now log in with your new password."
      : "";
  const forgotServerError =
    forgotError?.data?.message || forgotError?.error || "";

  const onSubmit = async (data) => {
    const result = await login(data);

    if (result.error) return;

    const { nextStep, email } = result.data;
    if (nextStep === "VERIFY_EMAIL") {
      navigate(routes.verifyEmail, { state: { email } });
      return;
    }
    navigate(routes.dashboard);
  };

  const onForgotPasswordSubmit = async ({ email }) => {
    const result = await forgotPassword({ email });
    if (result.error) return;

    setSubmittedResetEmail(email);
  };

  const handleSocialLogin = (provider) => {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "https://skilltree-n3rh.onrender.com/api";
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 font-sans">
      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl px-8 py-10 bg-[#0a0a0a] border border-white/[0.07] shadow-[0_0_60px_rgba(34,197,94,0.05),0_25px_50px_rgba(0,0,0,0.6)]">
        {/* Logo */}
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

        <SuccessBanner message={resetSuccessMessage} />

        {isResetOverlayOpen ? (
          <div className="text-center">
            <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-6 bg-emerald-500/8 border border-emerald-500/20">
              {submittedResetEmail ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <Mail className="w-6 h-6 text-emerald-400" />
              )}
            </div>

            {submittedResetEmail ? (
              <>
                <h2 className="text-lg font-bold text-white mb-1">Check your inbox</h2>
                <p className="text-sm text-slate-500 mb-1">We sent a reset link to</p>
                <p className="text-sm font-semibold text-white mb-7">{submittedResetEmail}</p>

                {forgotServerError && <ErrorBanner message={forgotServerError} />}

                <Button
                  size="lg"
                  isLoading={isForgotLoading}
                  onClick={() => forgotPassword({ email: submittedResetEmail })}
                  className="w-full text-white text-sm font-semibold cursor-pointer mb-4 rounded-[10px] py-[10px] bg-[#343A40] border border-[#3f464d] transition-[background,border-color] duration-200 hover:bg-[#3f464d] hover:border-[#4b5563]"
                >
                  <RotateCcw className="w-4 h-4 mr-2 inline-block" />
                  Resend reset link
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setIsResetOverlayOpen(false);
                    setSubmittedResetEmail("");
                    resetForgotForm();
                  }}
                  className="text-xs text-slate-500 hover:text-white font-semibold transition-colors"
                >
                  &lt; Back to login
                </button>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-white mb-2">Reset your password</h2>
                <p className="text-sm text-slate-500 mb-6">
                  Enter your email and we&apos;ll send a reset link.
                </p>

                <ErrorBanner message={forgotServerError} />

                <form
                  onSubmit={handleForgotSubmit(onForgotPasswordSubmit)}
                  className="space-y-4 text-left"
                >
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    error={forgotErrors.email?.message}
                    {...registerForgot("email")}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    isLoading={isForgotLoading}
                    className="w-full text-white text-sm font-semibold cursor-pointer mt-1 rounded-[10px] py-[10px] bg-[#343A40] border border-[#3f464d] transition-[background,border-color] duration-200 hover:bg-[#3f464d] hover:border-[#4b5563]"
                  >
                    Send Reset Link
                  </Button>
                </form>

                <button
                  type="button"
                  onClick={() => {
                    setIsResetOverlayOpen(false);
                    setSubmittedResetEmail("");
                    resetForgotForm();
                  }}
                  className="mt-6 text-xs text-slate-500 hover:text-white font-semibold transition-colors"
                >
                  &lt; Back to login
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Social buttons */}
            <div className="flex gap-2 mb-5">
              <SocialButton
                provider="google"
                onClick={() => handleSocialLogin("google")}
              />
              <SocialButton
                provider="github"
                onClick={() => handleSocialLogin("github")}
              />
            </div>

            <Divider text="Or" />

            {/* OAuth / server error */}
            <ErrorBanner message={oauthErrorMessage || serverError} />

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              onChange={reset}
              className="space-y-4 mt-5"
            >
              <Input
                label="Email"
                type="email"
                required
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Password"
                required
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password")}
              />

              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetOverlayOpen(true);
                    setSubmittedResetEmail("");
                  }}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                className="w-full text-white text-sm font-semibold cursor-pointer mt-1 rounded-[10px] py-[10px] bg-[#343A40] border border-[#3f464d] transition-[background,border-color] duration-200 hover:bg-[#3f464d] hover:border-[#4b5563]"
              >
                Log In
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                to={routes.signup}
                className="text-slate-300 hover:text-white font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
