export const badgeStyle = (badge: string) => {
    if (badge === "completed" )
      return "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30";
  
    if (badge === "started")
      return "bg-amber-400/15 text-amber-400 border border-amber-400/30";
  
    return "bg-sky-400/15 text-sky-400 border border-sky-400/30";
  };