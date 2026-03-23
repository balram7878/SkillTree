export default function Divider({ text = "Or" }) {
  return (
    <div className="flex items-center gap-2 my-6">
      <div className="flex-1 border-t border-slate-700/50" />
      <span className="text-sm text-slate-500 shrink-0">{text}</span>
      <div className="flex-1 border-t border-slate-700/50" />
    </div>
  );
}