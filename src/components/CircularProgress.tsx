import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export function CircularProgress({
  percentage,
  size = 140,
  strokeWidth = 12,
  color = '#3b82f6',
  label
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-slate-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-1000 ease-in-out drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute top-0 flex flex-col items-center justify-center" style={{ height: size, width: size }}>
        <span className="text-4xl font-black text-white drop-shadow-md">{percentage}%</span>
      </div>
      {label && <p className="mt-4 text-xl font-bold text-slate-200 tracking-wide">{label}</p>}
    </div>
  );
}
