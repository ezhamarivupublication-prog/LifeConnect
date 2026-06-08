import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { RefreshCw, Database, LogOut, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Record {
  id: string;
  created_at: string;
  user_name: string;
  user_dob: string;
  user_power_group: string;
  connections: any[];
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('calculations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching records:', error);
      } else {
        setRecords(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleExportExcel = () => {
    if (records.length === 0) return;
    
    const rows: any[] = [];
    
    records.forEach(record => {
      if (!record.connections || record.connections.length === 0) {
        rows.push({
          'Created At': new Date(record.created_at).toLocaleString(),
          'User Name': record.user_name,
          'User DOB': record.user_dob,
          'User Power Group': record.user_power_group,
          'Friend Name': 'None',
          'Friend DOB': 'None',
          'Friend Power Group': 'None',
          'Overall Match %': 'N/A',
          'Date Match %': 'N/A',
          'Month Match %': 'N/A'
        });
      } else {
        record.connections.forEach(conn => {
          rows.push({
            'Created At': new Date(record.created_at).toLocaleString(),
            'User Name': record.user_name,
            'User DOB': record.user_dob,
            'User Power Group': record.user_power_group,
            'Friend Name': conn.name,
            'Friend DOB': conn.dob ? new Date(conn.dob).toLocaleDateString() : 'N/A',
            'Friend Power Group': conn.powerGroup,
            'Overall Match %': conn.compatibility,
            'Date Match %': conn.dateCompatibility ?? 'N/A',
            'Month Match %': conn.monthCompatibility ?? 'N/A'
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Calculations");
    XLSX.writeFile(workbook, "PowerConnect_Reports.xlsx");
  };

  const handleExportPDF = () => {
    if (records.length === 0) return;
    
    const doc = new jsPDF('landscape');
    
    // Header
    doc.setFillColor(30, 41, 59); // slate-800
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    doc.setTextColor(56, 189, 248); // blue-400
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("PowerConnect", 14, 22);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("Admin Calculation Reports", 14, 30);
    
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, doc.internal.pageSize.width - 70, 26);
    
    const tableBody: any[] = [];
    
    records.forEach(record => {
      if (!record.connections || record.connections.length === 0) {
        tableBody.push([
          new Date(record.created_at).toLocaleString(),
          record.user_name,
          record.user_dob,
          record.user_power_group,
          'No Connections',
          '-',
          '-',
          '-'
        ]);
      } else {
        record.connections.forEach((conn, index) => {
          tableBody.push([
            index === 0 ? new Date(record.created_at).toLocaleString() : '',
            index === 0 ? record.user_name : '',
            index === 0 ? record.user_dob : '',
            index === 0 ? record.user_power_group : '',
            conn.name,
            conn.powerGroup,
            `${conn.compatibility}%`,
            `D: ${conn.dateCompatibility ?? '-'}% | M: ${conn.monthCompatibility ?? '-'}%`
          ]);
        });
      }
    });

    autoTable(doc, {
      startY: 50,
      head: [['Date', 'User', 'User DOB', 'User Power', 'Friend', 'Friend Power', 'Match', 'Details']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [56, 189, 248], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      alternateRowStyles: { fillColor: [241, 245, 249] }, // slate-50
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 45 },
        4: { cellWidth: 30 },
        5: { cellWidth: 45 },
        6: { cellWidth: 20 },
        7: { cellWidth: 35 }
      }
    });

    doc.save('PowerConnect_Reports.pdf');
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-400" />
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Viewing all calculation records</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
             <Link to="/" className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-semibold flex items-center justify-center">
               Calculator
             </Link>
             <button 
               onClick={handleExportExcel}
               className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors font-semibold"
               disabled={loading || records.length === 0}
             >
               <FileText className="w-4 h-4" />
               Excel
             </button>
             <button 
               onClick={handleExportPDF}
               className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-colors font-semibold"
               disabled={loading || records.length === 0}
             >
               <Download className="w-4 h-4" />
               PDF
             </button>
             <button 
               onClick={fetchRecords}
               className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-semibold"
               disabled={loading}
             >
               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
             </button>
             <button 
               onClick={onLogout}
               className="flex items-center gap-2 px-5 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition-colors font-semibold border border-red-500/30"
             >
               <LogOut className="w-4 h-4" />
               Sign Out
             </button>
          </div>
        </div>

        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700">
                  <th className="p-4 text-slate-300 font-semibold">Date / Time</th>
                  <th className="p-4 text-slate-300 font-semibold">User Name</th>
                  <th className="p-4 text-slate-300 font-semibold">DOB</th>
                  <th className="p-4 text-slate-300 font-semibold">Power Group</th>
                  <th className="p-4 text-slate-300 font-semibold w-1/3">Connections Checked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {loading && records.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">Loading records...</td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">No calculation records found.</td>
                  </tr>
                ) : (
                  records.map(record => (
                    <tr key={record.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 text-slate-400 text-sm">
                        {new Date(record.created_at).toLocaleString()}
                      </td>
                      <td className="p-4 text-white font-medium">{record.user_name}</td>
                      <td className="p-4 text-slate-300">{record.user_dob}</td>
                      <td className="p-4">
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30">
                          {record.user_power_group}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">
                        {record.connections && record.connections.length > 0 ? (
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {record.connections.map((conn, idx) => (
                              <div key={idx} className="text-xs bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                                <div>
                                  <span className="font-semibold text-white text-sm">{conn.name}</span>
                                  {conn.dob && (
                                    <span className="text-slate-400 ml-1">({new Date(conn.dob).toLocaleDateString()})</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-blue-400 font-medium">Group {conn.powerGroup}</span>
                                  <span className="text-emerald-400 font-bold">{conn.compatibility}% Match</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">No friends added</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
