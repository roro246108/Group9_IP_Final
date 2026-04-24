import useCountdown from "../hooks/useCountdown";

const CountdownTimer = ({ expiresAt }) => {
  const { days, hours, minutes, seconds, expired } = useCountdown(expiresAt);

  if (expired) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#e57373" }}>
        <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{ background: "#e57373" }} />
        Offer Expired
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl"
      style={{ background: "#b6dbf0" }}
    >
      <span className="uppercase tracking-widest font-bold mr-1" style={{ fontSize: "9px", color: "#1a1a2e" }}>
        Ends in
      </span>
      <span className="font-black text-sm" style={{ color: "#1a1a2e" }}>{String(days).padStart(2, "0")}</span>
      <span style={{ color: "#1a1a2e", fontWeight: 900 }}>:</span>
      <span className="font-black text-sm" style={{ color: "#1a1a2e" }}>{String(hours).padStart(2, "0")}</span>
      <span style={{ color: "#1a1a2e", fontWeight: 900 }}>:</span>
      <span className="font-black text-sm" style={{ color: "#1a1a2e" }}>{String(minutes).padStart(2, "0")}</span>
      <span style={{ color: "#1a1a2e", fontWeight: 900 }}>:</span>
      <span className="font-black text-sm" style={{ color: "#1a1a2e" }}>{String(seconds).padStart(2, "0")}</span>
    </div>
  );
};

export default CountdownTimer;
