import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionSchema } from "../../lib/validations/skill";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

export default function SkillForm({ step, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      skill: "Web Development",
      domain: "",
      level: "Beginner",
    },
  });
  return (
    <>
      <section className="bg-white p-8 md:p-10 rounded-[16px] border-2 border-[#E8DDD0] shadow-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="text-3xl font-black mb-3">Verify a Skill</h2>
        <p className="text-lg text-[#6B6B6B] mb-8">
          Select your skill, enter a specific domain, choose your level — then
          face 5 AI-generated questions.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="flex flex-col">
              <label className="text-sm font-bold mb-2 text-[#1C1C1C]">
                Select Skill
              </label>
              <div className="relative">
                <select
                  error={errors.skill?.message}
                  {...register("skill")}
                  disabled={step === "loading"}
                  className="select select-ghost rounded-md border border-[#E8DDD0] focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                >
                  <option>Web Development</option>
                  <option>AIML</option>
                </select>
                {errors.skill && toast.error(errors.skill.message)}
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#6B6B6B]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-bold mb-2 text-[#1C1C1C]">
                Enter Domain
              </label>
              <input
                type="text"
                placeholder="e.g. React hooks and state"
                error={errors.domain?.message}
                {...register("domain")}
                disabled={step === "loading"}
                className="input input-neutral w-full bg-[#FAFAF8] rounded-md border border-[#E8DDD0] focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              />
              {errors.domain && toast.error(errors.domain.message)}
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-bold mb-2 text-[#1C1C1C]">
                Select Level
              </label>
              <div className="relative">
                <select
                  error={errors.level?.message}
                  {...register("level")}
                  disabled={step === "loading"}
                  className="select select-ghost rounded-md  border border-[#E8DDD0]  focus:outline-none focus:ring-2 focus:ring-[#F97316] "
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                {errors.level && toast.error(errors.level.message)}
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#6B6B6B]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={step === "loading"}
            className="w-full md:w-auto h-14 px-8 bg-[#F97316] text-white font-bold rounded-[8px] hover:bg-[#e86610] disabled:bg-[#F5F0EB] disabled:text-[#6B6B6B] disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-3 text-lg"
          >
            {step === "loading" ? (
              <>
                <div className="w-5 h-5 border-2 border-[#6B6B6B] border-t-transparent rounded-full animate-spin"></div>
                Generating your questions...
              </>
            ) : (
              <>Generate Questions &rarr;</>
            )}
          </button>
        </form>
      </section>
    </>
  );
}
