import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router";
import { AlertCircle, Mail, CheckCircle2, RotateCcw } from "lucide-react";
import { signupSchema } from "../../lib/validations/auth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import SocialButton from "../../components/ui/SocialButton";
import Divider from "../../components/ui/Divider";
import routes from "../../app/router/routeConfig";
import { useSignupMutation, useResendVerificationMutation } from "../../store/authApi";

/* ── Lissajous-knot logo ─────────────────────────────────────────────── */
function SkillTreeLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer loop A */}
      <ellipse cx="60" cy="60" rx="46" ry="28" stroke="#22c55e" strokeWidth="1.6" strokeOpacity="0.9" fill="none" transform="rotate(-55 60 60)" />
      {/* Outer loop B */}
      <ellipse cx="60" cy="60" rx="46" ry="28" stroke="#16a34a" strokeWidth="1.4" strokeOpacity="0.75" fill="none" transform="rotate(5 60 60)" />
      {/* Outer loop C */}
      <ellipse cx="60" cy="60" rx="46" ry="28" stroke="#4ade80" strokeWidth="1.2" strokeOpacity="0.6" fill="none" transform="rotate(65 60 60)" />
      {/* Inner tight loop */}
      <ellipse cx="60" cy="60" rx="22" ry="13" stroke="#86efac" strokeWidth="1" strokeOpacity="0.5" fill="none" transform="rotate(-55 60 60)" />
      <ellipse cx="60" cy="60" rx="22" ry="13" stroke="#4ade80" strokeWidth="0.9" strokeOpacity="0.4" fill="none" transform="rotate(5 60 60)" />
      {/* Centre glow dot */}
      <circle cx="60" cy="60" r="3.5" fill="#22c55e" fillOpacity="0.95" />
      <circle cx="60" cy="60" r="6" fill="#22c55e" fillOpacity="0.2" />
    </svg>
  );
}

/* ── Error banner ────────────────────────────────────────────────────── */
function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 px-4 py-3 mb-5 rounded-xl bg-red-500/5 border border-red-500/20">
      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
      <p className="text-xs text-red-400 leading-relaxed">{message}</p>
    </div>
  );
}

/* ── Email sent overlay — renders in-place over the card ─────────────── */
function EmailSentOverlay({ email }) {
  const [resend, { isLoading, isSuccess, error }] = useResendVerificationMutation();
  const resendError = error?.data?.message || error?.error || "";

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-6 bg-emerald-500/8 border border-emerald-500/20">
        <Mail className="w-6 h-6 text-emerald-400" />
      </div>

      <h2 className="text-lg font-bold text-white mb-1">Check your inbox</h2>
      <p className="text-sm text-slate-500 mb-1">We sent a verification link to</p>
      <p className="text-sm font-semibold text-white mb-7">{email}</p>

      {/* Resend success */}
      {isSuccess && (
        <div className="flex items-center gap-2 justify-center px-4 py-3 mb-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-400">Verification email resent!</p>
        </div>
      )}

      {/* Resend error */}
      {resendError && (
        <div className="flex items-start gap-2 px-4 py-3 mb-5 rounded-xl bg-red-500/5 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-xs text-red-400">{resendError}</p>
        </div>
      )}

      {/* Resend button */}
      <Button
        size="lg"
        isLoading={isLoading}
        onClick={() => resend(email)}
        className="w-full text-white text-sm font-semibold cursor-pointer mb-4 rounded-[10px] py-[10px] bg-[#343A40] border border-[#3f464d] transition-[background,border-color] duration-200 hover:bg-[#3f464d] hover:border-[#4b5563]"
      >
        <RotateCcw className="w-4 h-4 mr-2 inline-block" />
        Resend email
      </Button>

      <p className="text-xs text-slate-600 mb-6">
        Didn&apos;t get it? Check your spam folder first.
      </p>

      <Link
        to={routes.login}
        className="text-xs text-slate-500 hover:text-white font-semibold transition-colors"
      >
        ← Back to login
      </Link>
    </div>
  );
}

/* ── Main Signup component ───────────────────────────────────────────── */
export default function Signup() {
  const [searchParams] = useSearchParams();
  const [signup, { isLoading, error, reset }] = useSignupMutation();

  // Tracks the submitted email — when set, swaps card content to EmailSentOverlay
  const [submittedEmail, setSubmittedEmail] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const serverError = error?.data?.message || error?.error || "";

  const oauthError = searchParams.get("error");
  const oauthErrorMessages = {
    server_error: "OAuth sign-in failed. Please try again.",
    google_failed: "Google sign-in failed. Please try again.",
    github_failed: "GitHub sign-in failed. Please try again.",
  };
  const oauthErrorMessage = oauthError
    ? oauthErrorMessages[oauthError] || decodeURIComponent(oauthError)
    : "";

  const onSubmit = async (data) => {
    const result = await signup(data);
    if (result.error) return; // ErrorBanner handles it
    setSubmittedEmail(data.email); // ← swap card content in-place, no navigation
  };

  const handleSocialLogin = (provider) => {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "https://skilltree-n3rh.onrender.com/api";
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-sm rounded-2xl px-8 py-10 bg-[#0a0a0a] border border-white/[0.07] shadow-[0_0_60px_rgba(34,197,94,0.05),0_25px_50px_rgba(0,0,0,0.6)]">

        {/* ── Logo — always visible ────────────────────────────────────── */}
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

        {/* ── Swap content based on state ──────────────────────────────── */}
        {submittedEmail ? (
          /* Email sent — show overlay content in same card */
          <EmailSentOverlay email={submittedEmail} />
        ) : (
          /* Signup form */
          <>
            <div className="flex gap-2 mb-5">
              <SocialButton provider="google" onClick={() => handleSocialLogin("google")} />
              <SocialButton provider="github" onClick={() => handleSocialLogin("github")} />
            </div>

            <Divider text="Or" />

            <ErrorBanner message={oauthErrorMessage || serverError} />

            <form
              onSubmit={handleSubmit(onSubmit)}
              onChange={reset}
              className="space-y-4 mt-5"
            >
              <Input
                label="Full Name"
                type="text"
                placeholder="eg. John Francisco"
                error={errors.name?.message}
                {...register("name")}
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                error={errors.password?.message}
                {...register("password")}
              />

              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                className="w-full text-white text-sm font-semibold cursor-pointer mt-1 rounded-[10px] py-[10px] bg-[#343A40] border border-[#3f464d] transition-[background,border-color] duration-200 hover:bg-[#3f464d] hover:border-[#4b5563]"
              >
                Sign Up
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to={routes.login} className="text-slate-300 hover:text-white font-semibold transition-colors">
                Log in
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}