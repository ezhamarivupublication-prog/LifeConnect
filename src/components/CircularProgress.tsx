export function CircularProgress({ percentage, color, size = 100, strokeWidth = 8, label }: { percentage: number, color: string, size?: number, strokeWidth?: number, label?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={"0 0  "}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-800"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="font-black text-white" style={{ fontSize: size / 4 }}>{percentage}%</span>
        {label && <span className="text-slate-400 font-medium mt-1" style={{ fontSize: size / 10 }}>{label}</span>}
      </div>
    </div>
  );
}
