import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import Button from "../../components/ui/Button";
import routes from "../../app/router/routeConfig";
import { useVerifyEmailQuery } from "../../store/authApi";

/* ── Lissajous-knot logo ─────────────────────────────────────────────── */
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

/* ── Shared card ─────────────────────────────────────────────────────── */
function Card({ children }) {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-sm rounded-2xl px-8 py-10 bg-[#0a0a0a] border border-white/[0.07] shadow-[0_0_60px_rgba(34,197,94,0.05),0_25px_50px_rgba(0,0,0,0.6)] text-center">
        {/* Logo always visible */}
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

/* ── Main component ──────────────────────────────────────────────────── */
export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { error, isLoading, isSuccess } = useVerifyEmailQuery(token, {
    skip: !token,
  });

  useEffect(() => {
    if (!isSuccess) return;

    // Brief pause so user sees the success state, then go to dashboard
    const redirectTimer = setTimeout(
      () => navigate(routes.dashboard, { replace: true }),
      1800,
    );

    return () => clearTimeout(redirectTimer);
  }, [isSuccess, navigate]);

  const errorMsg = !token
    ? "No verification token found. Please use the link from your email."
    : error?.data?.message ||
      error?.error ||
      "Invalid or expired verification link.";

  /* ── Verifying ─────────────────────────────────────────────────────── */
  if (token && isLoading) {
    return (
      <Card>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto bg-emerald-500/8 border border-emerald-500/20">
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">
          Verifying your email…
        </h2>
        <p className="text-sm text-slate-500">Hang tight, just a second.</p>
      </Card>
    );
  }

  /* ── Success ───────────────────────────────────────────────────────── */
  if (isSuccess) {
    return (
      <Card>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto bg-emerald-500/8 border border-emerald-500/20">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Email verified!</h2>
        <p className="text-sm text-slate-500">Taking you to your dashboard…</p>
      </Card>
    );
  }

  /* ── Error ─────────────────────────────────────────────────────────── */
  return (
    <Card>
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto bg-red-500/8 border border-red-500/20">
        <AlertTriangle className="w-6 h-6 text-red-400" />
      </div>
      <h2 className="text-lg font-bold text-white mb-2">Verification failed</h2>
      <p className="text-sm text-slate-500 mb-7">{errorMsg}</p>

      <Link to={routes.signup}>
        <Button
          size="lg"
          className="w-full text-white text-sm font-semibold cursor-pointer rounded-[10px] py-[10px] bg-[#343A40] border border-[#3f464d] transition-[background,border-color] duration-200 hover:bg-[#3f464d] hover:border-[#4b5563] mb-4"
        >
          Back to Sign Up
        </Button>
      </Link>

      <Link
        to={routes.login}
        className="text-xs text-slate-500 hover:text-white font-semibold transition-colors"
      >
        ← Back to login
      </Link>
    </Card>
  );
}
