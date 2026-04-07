import Questions from "./Questions";
import Results from "./Results";
import SkillForm from "./SkillForm";
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  TrendingUp,
  Check,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useGetQuestionsMutation,
  useSubmitAnswersMutation,
} from "../../store/ragAPIs";
import { use } from "react";
import { useSelector } from "react-redux";

export default function Main({
  step,
  setStep,
  formData,
  setFormData,
  questions,
  setQuestions,
  answers,
  setAnswers,
  results,
  setResults,
  timeLeft,
  setTimeLeft,
}) {
  const [getQuestions] = useGetQuestionsMutation();
  const [submitAnswers] = useSubmitAnswersMutation();

  const { user } = useSelector((state) => state.auth);

  const handleGenerate = async (data) => {
    setStep("loading");
    setFormData(data);
    try {
      // Map frontend values to backend expected values
      const payload = {
        skill: data.skill === "Web Development" ? "web-development" : "aiml",
        domain: data.domain,
        level: data.level.toLowerCase(),
      };
      const response = await getQuestions(payload).unwrap();
      // response.questions is ["Q1?", "Q2?"...] — convert to objects
      const formatted = response.questions.map((q, i) => ({
        id: i,
        text: q,
      }));
      setQuestions(formatted);
      setAnswers({});
      setTimeLeft(15 * 60);
      setStep("questions");
    } catch (err) {
      setStep("idle");
      toast.error(
        err?.data?.message || "Failed to generate questions. Try again.",
      );
    }
  };
  const handleFinalSubmit = async (data) => {
    setStep("submitting");
    try {
      const payload = {
        skill:
          formData.skill === "Web Development" ? "web-development" : "aiml",
        domain: formData.domain,
        level: formData.level.toLowerCase(),
        answers: questions.map((q) => ({
          question: q.text,
          answer: data.answers[q.id] || "",
        })),
      };
      const response = await submitAnswers(payload).unwrap();
      // Map response to what Results.jsx expects
      setResults({
        overall: Math.round(response.overallScore * 10),
        verdict: response.evaluations[0]?.verdict || "Evaluated",
        feedback: response.summary?.topGaps?.join(", ") || "",
        topGaps: response.summary?.topGaps || [],
        details: response.evaluations.map((e, i) => ({
          id: i,
          question: questions[i]?.text || "",
          score: e.score,
          verdict: e.verdict,
          feedback: e.feedback,
          gaps: e.gaps,
          strongPoints: e.strongPoints,
        })),
      });
      setStep("results");
    } catch (err) {
      setStep("questions");
      toast.error(err?.data?.message || "Submission failed. Try again.");
    }
  };
  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-10 relative">
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
          {/* Top Greeting & Stats (Hidden if engaged in questions) */}
          {(step === "idle" || step === "loading") && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h1 className="text-4xl font-black mb-2">
                Hello, {user?.name ? user.name.split(" ")[0] : "Learner"}!
              </h1>
              <p className="text-xl text-[#6B6B6B] mb-8">
                Ready to verify your skills today?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Card 1 */}
                <div className="bg-white p-6 rounded-2xl border border-[#E8DDD0] shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F5F0EB] flex items-center justify-center text-[#F97316]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#6B6B6B] uppercase tracking-wide">
                      Skills Verified
                    </div>
                    <div className="text-2xl font-black">3</div>
                  </div>
                </div>
                {/* Stat Card 2 */}
                <div className="bg-white p-6 rounded-2xl border border-[#E8DDD0] shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F5F0EB] flex items-center justify-center text-[#F97316]">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#6B6B6B] uppercase tracking-wide">
                      Avg Score
                    </div>
                    <div className="text-2xl font-black">78/100</div>
                  </div>
                </div>
                {/* Stat Card 3 */}
                <div className="bg-white p-6 rounded-2xl border border-[#E8DDD0] shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F5F0EB] flex items-center justify-center text-[#F97316]">
                    <Clock3 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#6B6B6B] uppercase tracking-wide">
                      Last Active
                    </div>
                    <div className="text-2xl font-black">Today</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skill Verification Form Card (Idle / Loading) */}
          {(step === "idle" || step === "loading") && (
            <SkillForm step={step} onSubmit={handleGenerate} />
          )}

          {(step === "questions" || step === "submitting") && (
            <Questions
              step={step}
              questions={questions}
              answers={answers}
              setAnswers={setAnswers}
              timeLeft={timeLeft}
              setTimeLeft={setTimeLeft}
              onSubmit={handleFinalSubmit}
            />
          )}
          {step === "results" && results && (
            <Results
              results={results}
              onReset={() => {
                setStep("idle");
                setFormData({ skill: "", domain: "", level: "" });
                setQuestions([]);
                setAnswers({});
                setResults(null);
              }}
            />
          )}
        </div>
      </main>
    </>
  );
}
