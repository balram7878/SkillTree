import { Award, Check, X } from "lucide-react";

export default function Results({ results, onReset }) {


  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h2 className="text-4xl font-black mb-8 text-center md:text-left">
          Your Verification Results
        </h2>

        {/* Overall Score Card */}
        <div className="bg-white rounded-[16px] border-2 border-[#E8DDD0] shadow-xl p-8 md:p-12 mb-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="shrink-0 flex flex-col items-center">
            <Award className="w-24 h-24 text-[#F97316] mb-4 drop-shadow-sm" />
            <div className="text-5xl font-black tracking-tighter text-[#1C1C1C]">
              {results.overall}
              <span className="text-2xl text-[#6B6B6B]">/100</span>
            </div>
            <span className="mt-4 px-5 py-2 bg-green-50 text-green-700 font-bold rounded-full border border-green-200">
              {results.verdict}
            </span>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4">Verification Complete</h3>
            <p className="text-xl text-[#6B6B6B] leading-relaxed">
              {results.feedback}
            </p>
          </div>
        </div>

        {/* Individual Question Results */}
        <div className="space-y-6 mb-12">
          <h3 className="text-2xl font-black mb-6">Question Breakdown</h3>
          {results.details.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded-[16px] border border-[#E8DDD0] shadow-sm p-6 flex flex-col md:flex-row gap-6 hover:border-[#F97316] transition-colors"
            >
              <div className="md:w-16 shrink-0 flex items-start md:justify-center">
                <div
                  className={`flex flex-col items-center justify-center p-3 rounded-[8px] font-black leading-none ${
                    item.score >= 8
                      ? "bg-green-100 text-green-700"
                      : item.score >= 5
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  <span className="text-xl">{item.score}</span>
                  <span className="text-[10px] uppercase font-bold opacity-80 mt-1">
                    / 10
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#6B6B6B] italic mb-3">
                  "
                  {item.question.length > 80
                    ? item.question.substring(0, 80) + "..."
                    : item.question}
                  "
                </p>
                <h4 className="font-bold text-lg mb-2">{item.verdict}</h4>
                <p className="mb-4 text-[#1C1C1C]">{item.feedback}</p>

                <div className="flex flex-wrap gap-2">
                  {item.strongPoints.map((sp, i) => (
                    <span
                      key={i}
                      className="text-xs font-bold px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                      {sp}
                    </span>
                  ))}
                  {item.gaps.map((gp, i) => (
                    <span
                      key={i}
                      className="text-xs font-bold px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-full flex items-center gap-1"
                    >
                      <X className="w-3 h-3" strokeWidth={3} />
                      {gp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skill Gap Summary */}
        <div className="bg-[#F5F0EB] rounded-[16px] p-8 md:p-10 mb-12 border border-[#E8DDD0]">
          <h3 className="text-2xl font-black mb-6">Skill Gap Summary</h3>
          <ul className="space-y-4">
            {results.topGaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="w-2.5 h-2.5 bg-[#F97316] rounded-full mt-2 shrink-0 shadow-sm border border-[#F97316]/50"></div>
                <span className="text-lg font-medium text-[#1C1C1C]">
                  {gap}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center mb-10">
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-8 py-4 bg-[#F97316] text-white font-bold rounded-[8px] hover:bg-[#e86610] shadow-md transition-all text-center"
          >
            Verify Another Skill
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[#E8DDD0] text-[#1C1C1C] font-bold rounded-[8px] hover:border-[#1C1C1C] hover:bg-white transition-all text-center">
            View Full Profile
          </button>
        </div>
      </div>
    </>
  );
}
