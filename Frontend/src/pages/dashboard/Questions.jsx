import { Timer } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { answerSchema } from "../../lib/validations/skill";
import { useEffect } from "react";

export default function Questions({
  step,
  questions,
  answers,
  setAnswers,
  timeLeft,
  setTimeLeft,
  onSubmit,
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(answerSchema),
    defaultValues: { answers: {} },
  });

  const watchedAnswers = watch("answers");
  const answeredCount = Object.values(watchedAnswers || {}).filter(
    (a) => a?.trim().length >= 10,
  ).length;

  // Timer
  useEffect(() => {
    if (step !== "questions") return;
    if (timeLeft <= 0) {
      handleSubmit(onSubmit)();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, step]);

  const getTimerColorClass = () => {
    if (timeLeft > 5 * 60) return "text-[#F97316]";
    if (timeLeft > 2 * 60) return "text-yellow-500";
    return "text-red-500";
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // sync to parent answers state for progress tracking
  useEffect(() => {
    setAnswers(watchedAnswers || {});
  }, [JSON.stringify(watchedAnswers)]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-black">Your Questions</h2>
              <div className="text-sm font-bold text-[#6B6B6B] uppercase tracking-wider mt-2 flex items-center gap-2">
                <div className="w-full max-w-[200px] h-2 bg-[#E8DDD0] rounded-full overflow-hidden inline-[block]">
                  <div
                    className="h-full bg-[#F97316] transition-all duration-300"
                    style={{ width: `${(answeredCount / 5) * 100}%` }}
                  ></div>
                </div>
                {answeredCount} of 5 answered
              </div>
            </div>
            <div className="bg-white border border-[#E8DDD0] rounded-[8px] px-6 py-4 flex items-center gap-3 shadow-sm">
              <Timer className={`w-6 h-6 ${getTimerColorClass()}`} />
              <span
                className={`text-2xl font-black font-mono tracking-widest ${getTimerColorClass()}`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="space-y-8">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="bg-white p-8 rounded-[16px] border border-[#E8DDD0] shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 bg-[#F5F0EB] text-[#F97316] font-black rounded-full flex items-center justify-center border border-[#F97316]/20">
                    Q{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-[#1C1C1C] leading-snug mb-6">
                      {q.text}
                    </p>
                    <div className="relative">
                      <textarea
                        placeholder="Write your answer here... be specific and explain your reasoning."
                        error={errors?.answer?.message}
                        {...register(`answers.${q.id}`)}
                        readOnly={step === "submitting"}
                        className="textarea textarea-neutral w-full min-h-[160px] bg-[#FAFAF8] border border-[#E8DDD0] rounded-[8px] p-5 text-[#1C1C1C] resize-y focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-colors"
                        maxLength={2000}
                      />
                      <div className="text-right text-xs font-medium text-[#6B6B6B] mt-2">
                        {(answers[q.id] || "").length} / 2000
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-end">
            <button
              type="submit"
              disabled={step === "submitting"}
              className="h-16 px-12 bg-[#F97316] text-white font-bold rounded-[8px] hover:bg-[#e86610] disabled:bg-[#F5F0EB] hover:-translate-y-1 shadow-xl shadow-orange-500/20 disabled:shadow-none disabled:text-[#6B6B6B] disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-xl w-full sm:w-auto"
            >
              {step === "submitting" ? (
                <>
                  <div className="w-6 h-6 border-2 border-[#6B6B6B] border-t-transparent rounded-full animate-spin"></div>
                  Evaluating Answers...
                </>
              ) : (
                <>Submit All Answers &rarr;</>
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
