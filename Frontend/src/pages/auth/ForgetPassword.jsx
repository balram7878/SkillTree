import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { useState as useLocalState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { forgotPasswordSchema } from "../../lib/validations/auth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import routes from "../../app/router/routeConfig";
import { useForgotPasswordMutation } from "../../store/authApi";

export default function ForgetPassword() {
  const [isSubmitted, setIsSubmitted] = useLocalState(false);
  const [submittedEmail, setSubmittedEmail] = useLocalState("");
  const [submittedMessage, setSubmittedMessage] = useLocalState(
    "If an account with that email exists, a password reset link has been sent.",
  );
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const serverError = error?.data?.message || error?.error || "";

  const onSubmit = async (data) => {
    const result = await forgotPassword(data);

    if (result.error) return;

    setSubmittedEmail(data.email);
    setSubmittedMessage(
      result.data?.message ||
        "If an account with that email exists, a password reset link has been sent.",
    );
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="animate-fadeIn text-center">
        <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
          <Mail className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Check your email</h2>
        <p className="text-slate-400 mb-2">{submittedMessage}</p>
        <p className="text-white font-semibold mb-8">{submittedEmail}</p>
        <p className="text-sm text-slate-500 mb-8">
          Click the link in the email to reset your password. If you don&apos;t
          see it, check your spam folder.
        </p>
        <Link
          to={routes.login}
          className="text-slate-400 hover:text-white font-semibold transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Forgot your password?
        </h2>
        <p className="text-slate-400">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-xl">
          <p className="text-sm text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {serverError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading}
        >
          Send Reset Link
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link
          to={routes.login}
          className="text-slate-400 hover:text-white font-semibold transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
