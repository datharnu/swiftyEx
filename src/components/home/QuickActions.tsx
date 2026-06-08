import { ArrowDownLeft, ArrowUpRight, Landmark, RefreshCcw } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      icon: <ArrowDownLeft strokeWidth={2} className="size-4 text-[#377CC8]" />,
      label: "Deposit",
    },
    {
      icon: <ArrowUpRight strokeWidth={2} className="size-4 text-[#242424]" />,
      label: "Withdraw",
    },
    {
      icon: <RefreshCcw strokeWidth={2} className="size-4 text-[#EED868]" />,
      label: "Swap",
    },
    {
      icon: <Landmark strokeWidth={2} className="size-4 text-[#469B88]" />,
      label: "OTC Desk",
    },
  ];

  return (
    <div className="pt-2 px-4">
      <div className="flex justify-between items-start">
        {actions.map((action) => (
          <div
            key={action.label}
            className="flex flex-col items-center gap-2"
          >
      <div className="rounded-full p-3 bg-white/60 backdrop-blur-xl border border-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:scale-105">
  {action.icon}
     </div>
     <span className="text-xs font-medium text-neutral-700">
  {action.label}
     </span>
          </div>
        ))}
      </div>
    </div>
  );
}