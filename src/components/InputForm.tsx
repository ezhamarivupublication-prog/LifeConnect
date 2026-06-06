import React, { useState } from 'react';
import { Users, Plus, Trash2, Calculator, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export interface ConnectionInput {
  id: string;
  name: string;
  dob: Date | null;
}

interface InputFormProps {
  onCalculate: (user: any, connections: ConnectionInput[]) => void;
}

export function InputForm({ onCalculate }: InputFormProps) {
  const [userName, setUserName] = useState('');
  const [userDob, setUserDob] = useState<Date | null>(null);
  
  const [connections, setConnections] = useState<ConnectionInput[]>([
    { id: '1', name: '', dob: null }
  ]);

  const addConnection = () => {
    setConnections([...connections, { id: Date.now().toString(), name: '', dob: null }]);
  };

  const removeConnection = (id: string) => {
    setConnections(connections.filter(c => c.id !== id));
  };

  const updateConnection = (id: string, field: keyof ConnectionInput, value: any) => {
    setConnections(connections.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!userDob) {
      alert('Please enter your Date of Birth');
      return;
    }
    
    // Filter out empty names or DOBS
    const validConnections = connections.filter(c => c.name.trim() !== '' && c.dob !== null);
    if (validConnections.length === 0) {
      alert('Please add at least one connection with a name and date of birth');
      return;
    }

    // Convert dates to ISO strings for the calculation engine
    const userDobStr = userDob.toISOString();
    const formattedConnections = validConnections.map(c => ({
      ...c,
      dob: c.dob!.toISOString()
    }));

    // @ts-ignore - The calculation engine can accept ISO strings or Date objects depending on implementation
    onCalculate({ name: userName, dob: userDobStr }, formattedConnections);
  };

  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-slate-800/60 p-8 md:p-12 rounded-3xl border border-slate-700/50 backdrop-blur-md shadow-2xl">
        
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_20px_rgba(56,189,248,0.4)] animate-pulse">
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
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent inline-block pb-2 drop-shadow-lg">
            PowerConnect
          </h1>
          <p className="text-slate-300 mt-3 text-xl font-light tracking-wide">Enter details to calculate compatibility</p>
        </div>

        <form onSubmit={handleCalculate} className="space-y-12">
          
          {/* My Details */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" />
              My Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Your Name</label>
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-slate-300">Your Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 z-10 pointer-events-none" />
                  <DatePicker 
                    selected={userDob}
                    onChange={(date) => setUserDob(date)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholderText="Select your birthday"
                    dateFormat="MMMM d, yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    maxDate={new Date()}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Connections */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-emerald-400" />
                Connections
              </h2>
              <button 
                type="button"
                onClick={addConnection}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-600"
              >
                <Plus className="w-4 h-4" /> Add Person
              </button>
            </div>

            <div className="space-y-4">
              {connections.map((conn, index) => (
                <div key={conn.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 items-end relative group">
                  <div className="md:col-span-5 space-y-1">
                    <label className="text-xs font-medium text-slate-400">Friend's Name</label>
                    <input 
                      type="text" 
                      value={conn.name}
                      onChange={(e) => updateConnection(conn.id, 'name', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Friend's name"
                    />
                  </div>
                  <div className="md:col-span-6 space-y-1 relative">
                    <label className="text-xs font-medium text-slate-400">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10 pointer-events-none" />
                      <DatePicker 
                        selected={conn.dob}
                        onChange={(date) => updateConnection(conn.id, 'dob', date)}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholderText="Select birthday"
                        dateFormat="MMMM d, yyyy"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        maxDate={new Date()}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-1 flex justify-end pb-1">
                    {connections.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeConnection(conn.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-3"
            >
              <Calculator className="w-6 h-6" />
              Calculate Compatibility
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
