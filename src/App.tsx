import React, { useState } from 'react'
import { Dashboard } from './components/Dashboard'
import { InputForm, type ConnectionInput } from './components/InputForm'
import { generateReport } from './utils/calculator'
import { supabase } from './lib/supabase'

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [connections, setConnections] = useState<ConnectionInput[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleCalculate = async (user: any, conns: ConnectionInput[]) => {
    setIsSaving(true);
    const reportData = generateReport(user, conns);
    
    try {
      const { error } = await supabase
        .from('calculations')
        .insert([{
           user_name: reportData.calculatedUser.name,
           user_dob: reportData.calculatedUser.dob,
           user_power_group: reportData.calculatedUser.powerGroup,
           connections: reportData.connections
        }]);
        
      if (error) console.error("Error saving to Supabase:", error.message);
    } catch (err) {
      console.error("Supabase exception:", err);
    }

    setUserData(reportData.calculatedUser);
    setConnections(reportData.connections as any); // cast for now, Dashboard uses same shape
    setIsSaving(false);
    setShowDashboard(true);
  };

  const handleBack = () => {
    setShowDashboard(false);
  };

  return (
    <div className="bg-slate-900 min-h-screen">
      {showDashboard ? (
        <Dashboard user={userData} initialConnections={connections} onBack={handleBack} />
      ) : (
        <div className="relative">
          {isSaving && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
              <div className="text-xl font-bold text-blue-400 animate-pulse">Saving to Database & Calculating...</div>
            </div>
          )}
          <InputForm onCalculate={handleCalculate} />
        </div>
      )}
    </div>
  )
}

export default App
