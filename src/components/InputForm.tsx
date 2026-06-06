import React, { useState } from 'react';
import { Users, Plus, Trash2, Calculator } from 'lucide-react';

export interface ConnectionInput {
  id: string;
  name: string;
  dob: string;
}

interface InputFormProps {
  onCalculate: (user: any, connections: ConnectionInput[]) => void;
}

export function InputForm({ onCalculate }: InputFormProps) {
  const [userName, setUserName] = useState('');
  const [userDob, setUserDob] = useState('');
  
  const [connections, setConnections] = useState<ConnectionInput[]>([
    { id: '1', name: '', dob: '' }
  ]);

  const addConnection = () => {
    setConnections([...connections, { id: Date.now().toString(), name: '', dob: '' }]);
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
    const validConnections = connections.filter(c => c.name.trim() !== '' && c.dob !== '');
    if (validConnections.length === 0) {
      alert('Please add at least one connection with a name and date of birth');
      return;
    }

    onCalculate({ name: userName, dob: userDob }, validConnections);
  };

  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-slate-800/60 p-8 md:p-12 rounded-3xl border border-slate-700/50 backdrop-blur-md shadow-2xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent inline-block pb-2">
            PowerConnect
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Enter details to calculate compatibility</p>
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Your Date of Birth</label>
                <input 
                  type="date" 
                  value={userDob}
                  onChange={(e) => setUserDob(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
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
                  <div className="md:col-span-6 space-y-1">
                    <label className="text-xs font-medium text-slate-400">Date of Birth</label>
                    <input 
                      type="date" 
                      value={conn.dob}
                      onChange={(e) => updateConnection(conn.id, 'dob', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
