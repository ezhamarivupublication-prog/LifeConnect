import React, { useState } from 'react';
import { CircularProgress } from './CircularProgress';
import { Trophy, Users, ShieldAlert, Award, AlertCircle } from 'lucide-react';

export interface Connection {
  id: string;
  name: string;
  powerGroup: string;
  compatibility: number;
}

interface DashboardProps {
  user: any;
  initialConnections: Connection[];
  onBack: () => void;
}

function getStatus(percentage: number) {
  if (percentage >= 75) return { text: 'Excellent Match', color: '#10b981', bg: 'bg-emerald-500/20', textClass: 'text-emerald-400' };
  if (percentage >= 50) return { text: 'Good Match', color: '#3b82f6', bg: 'bg-blue-500/20', textClass: 'text-blue-400' };
  if (percentage >= 25) return { text: 'Average Match', color: '#f59e0b', bg: 'bg-amber-500/20', textClass: 'text-amber-400' };
  return { text: 'Low Match', color: '#ef4444', bg: 'bg-red-500/20', textClass: 'text-red-400' };
}

export function Dashboard({ user, initialConnections, onBack }: DashboardProps) {
  const [connections] = useState<Connection[]>([...initialConnections].sort((a, b) => b.compatibility - a.compatibility));

  const stats = {
    total: connections.length,
    excellent: connections.filter(c => c.compatibility >= 75).length,
    good: connections.filter(c => c.compatibility >= 50 && c.compatibility < 75).length,
    average: connections.filter(c => c.compatibility >= 25 && c.compatibility < 50).length,
    low: connections.filter(c => c.compatibility < 25).length,
  };

  const handleExport = () => {
    // PDF Export Logic will be implemented later
    alert('PDF Export coming soon!');
  };

  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Main Branding Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_20px_rgba(56,189,248,0.4)] animate-pulse">
              <circle cx="30" cy="50" r="18" fill="url(#grad1)" />
              <circle cx="70" cy="50" r="18" fill="url(#grad2)" />
              <path d="M 45 50 L 55 50" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
              <path d="M 30 32 Q 50 10 70 32" stroke="url(#grad3)" strokeWidth="3" fill="none" strokeDasharray="4 4" className="animate-[spin_10s_linear_infinite]" style={{transformOrigin: "center"}} />
              <defs>
                <linearGradient id="grad1" x1="12" y1="32" x2="48" y2="68" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#818cf8" />
                </linearGradient>
                <linearGradient id="grad2" x1="52" y1="32" x2="88" y2="68" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#34d399" />
                  <stop offset="1" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="grad3" x1="30" y1="32" x2="70" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818cf8" />
                  <stop offset="1" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent inline-block pb-2 drop-shadow-lg">
            PowerConnect
          </h1>
        </div>

        {/* User Info Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-md shadow-2xl relative overflow-hidden">


          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">&larr; Back</button>
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              {user?.name || 'PowerConnect'}
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Power Group: <span className="text-blue-400 font-bold">{user?.powerGroup}</span></p>
          </div>
          <button 
            onClick={handleExport}
            className="mt-6 md:mt-0 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            Export PDF Report
          </button>
        </div>

        {/* Primary Visualization - Top Connection */}
        {connections.length > 0 && (
          <div className="bg-slate-800/40 p-10 rounded-3xl border border-slate-700/50 shadow-xl flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold text-slate-300 mb-8">Top Connection</h2>
            <CircularProgress 
              percentage={connections[0].compatibility} 
              size={220} 
              strokeWidth={16} 
              color={getStatus(connections[0].compatibility).color}
              label={getStatus(connections[0].compatibility).text}
            />
            <div className="mt-8">
              <p className="text-3xl font-bold text-white">{connections[0].name}</p>
              <p className="text-lg text-slate-400 mt-1">Power Group: <span className="text-blue-400">{connections[0].powerGroup}</span></p>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
            <Users className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-3xl font-black text-white">{stats.total}</span>
            <span className="text-sm text-slate-400 mt-1">Total Connections</span>
          </div>
          <div className="bg-emerald-900/20 p-6 rounded-2xl border border-emerald-800/30 flex flex-col items-center justify-center text-center">
            <Trophy className="w-8 h-8 text-emerald-400 mb-2" />
            <span className="text-3xl font-black text-emerald-400">{stats.excellent}</span>
            <span className="text-sm text-emerald-500/80 mt-1">Excellent</span>
          </div>
          <div className="bg-blue-900/20 p-6 rounded-2xl border border-blue-800/30 flex flex-col items-center justify-center text-center">
            <Award className="w-8 h-8 text-blue-400 mb-2" />
            <span className="text-3xl font-black text-blue-400">{stats.good}</span>
            <span className="text-sm text-blue-500/80 mt-1">Good</span>
          </div>
          <div className="bg-amber-900/20 p-6 rounded-2xl border border-amber-800/30 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
            <span className="text-3xl font-black text-amber-400">{stats.average}</span>
            <span className="text-sm text-amber-500/80 mt-1">Average</span>
          </div>
          <div className="bg-red-900/20 p-6 rounded-2xl border border-red-800/30 flex flex-col items-center justify-center text-center">
            <ShieldAlert className="w-8 h-8 text-red-400 mb-2" />
            <span className="text-3xl font-black text-red-400">{stats.low}</span>
            <span className="text-sm text-red-500/80 mt-1">Low Match</span>
          </div>
        </div>

        {/* Detailed Connection List & Ranking */}
        <div className="bg-slate-800/40 rounded-3xl border border-slate-700/50 overflow-hidden shadow-xl">
          <div className="p-8 border-b border-slate-700/50">
            <h2 className="text-2xl font-bold text-white">Connection Rankings</h2>
          </div>
          <div className="p-8 space-y-6">
            {connections.map((conn, index) => {
              const status = getStatus(conn.compatibility);
              return (
                <div key={conn.id} className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-slate-800/60 rounded-2xl hover:bg-slate-700/50 transition-colors border border-slate-700/50">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-xl font-black text-slate-400 border border-slate-700">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{conn.name}</h3>
                      <p className="text-slate-400 mt-1">Power Group: {conn.powerGroup}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 md:mt-0 flex items-center gap-8 w-full md:w-auto">
                    <div className="flex-1 md:w-48">
                      <div className="flex justify-between mb-2">
                        <span className={`font-semibold ${status.textClass}`}>{status.text}</span>
                        <span className="font-bold text-white">{conn.compatibility}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${conn.compatibility}%`, backgroundColor: status.color }}
                        />
                      </div>
                    </div>
                    <div className="hidden md:block">
                       <CircularProgress percentage={conn.compatibility} size={60} strokeWidth={6} color={status.color} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
