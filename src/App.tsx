import React, { useState } from 'react'
import { Dashboard } from './components/Dashboard'
import { InputForm, type ConnectionInput } from './components/InputForm'
import { generateReport } from './utils/calculator'

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [connections, setConnections] = useState<ConnectionInput[]>([]);

  const handleCalculate = (user: any, conns: ConnectionInput[]) => {
    const reportData = generateReport(user, conns);
    setUserData(reportData.calculatedUser);
    setConnections(reportData.connections as any); // cast for now, Dashboard uses same shape
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
        <InputForm onCalculate={handleCalculate} />
      )}
    </div>
  )
}

export default App
