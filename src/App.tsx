import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { AnalitikView } from './components/AnalitikView';
import { WhatsAppModal } from './components/WhatsAppModal';
import { KADCalculatorModal } from './components/KADCalculatorModal';
import { NasabahDetailModal } from './components/NasabahDetailModal';
import { ImportExcelModal } from './components/ImportExcelModal';
import { PythonEngineModal } from './components/PythonEngineModal';
import { INITIAL_DEPOSANS } from './data/initialDeposans';
import { Deposan } from './types';
import { exportDeposansToExcel } from './utils/excelHelper';
import { Users, FileSpreadsheet, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'analitik' | 'nasabah'>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Persistent State for Deposans
  const [deposans, setDeposans] = useState<Deposan[]>(() => {
    const saved = localStorage.getItem('dams_deposans_data_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_DEPOSANS;
      }
    }
    return INITIAL_DEPOSANS;
  });

  useEffect(() => {
    localStorage.setItem('dams_deposans_data_v2', JSON.stringify(deposans));
  }, [deposans]);

  // Modals state
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [selectedDeposanForWA, setSelectedDeposanForWA] = useState<Deposan | null>(null);

  const [kadSimOpen, setKadSimOpen] = useState(false);
  const [kadSimDeposit, setKadSimDeposit] = useState<number>(2000000000);
  const [kadSimRate, setKadSimRate] = useState<number>(4.25);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDeposanForDetail, setSelectedDeposanForDetail] = useState<Deposan | null>(null);

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [pythonModalOpen, setPythonModalOpen] = useState(false);

  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Handlers
  const handleOpenWhatsApp = (deposan: Deposan) => {
    setSelectedDeposanForWA(deposan);
    setWaModalOpen(true);
  };

  const handleOpenKADSim = (depositAmount?: number, depositRate?: number) => {
    if (depositAmount) setKadSimDeposit(depositAmount);
    if (depositRate) setKadSimRate(depositRate);
    setKadSimOpen(true);
  };

  const handleOpenNasabahDetail = (deposan: Deposan) => {
    setSelectedDeposanForDetail(deposan);
    setDetailModalOpen(true);
  };

  const handleUpdateStatus = (id: string, newStatus: Deposan['status'], note?: string) => {
    setDeposans((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return {
            ...d,
            status: newStatus,
            notes: note ? `${d.notes ? d.notes + ' | ' : ''}${note}` : d.notes,
            lastContactDate: new Date().toISOString().split('T')[0],
          };
        }
        return d;
      })
    );
    showToast(`Status nasabah berhasil diperbarui menjadi ${newStatus}`);
  };

  const handleUpdateTenor = (id: string, tenorMonths: number) => {
    setDeposans((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return { ...d, tenorMonths };
        }
        return d;
      })
    );
    showToast('Tenor bilyet deposito diperbarui');
  };

  const handleUpdateDeposan = (updated: Deposan) => {
    setDeposans((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    showToast('Data & catatan nasabah berhasil disimpan');
  };

  const handleImportSuccess = (newDeposans: Deposan[]) => {
    setDeposans(newDeposans);
    showToast(`Sukses mengimpor ${newDeposans.length} data nasabah dari Excel!`);
  };

  const handleExportExcel = () => {
    exportDeposansToExcel(deposans);
    showToast('File Excel DAMS berhasil diunduh!');
  };

  const handleResetData = () => {
    setDeposans(INITIAL_DEPOSANS);
    showToast('Data dikembalikan ke sampel awal');
  };

  // Summary figures for Navbar
  const totalDeposito = deposans.reduce((sum, d) => sum + d.depositoNominal, 0);
  const potentialKAD = deposans.reduce((sum, d) => sum + d.maxKADLimit, 0);
  const currentLDR = 82.1; // Baseline
  const projectedLDR = 88.6; // With KAD

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-slate-800 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenImport={() => setImportModalOpen(true)}
        onExportExcel={handleExportExcel}
        onOpenPython={() => setPythonModalOpen(true)}
        onOpenKADSim={() => handleOpenKADSim(2000000000, 4.25)}
        totalDeposito={totalDeposito}
        potentialKAD={potentialKAD}
        currentLDR={currentLDR}
        projectedLDR={projectedLDR}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dynamic View Switching */}
        {activeView === 'dashboard' && (
          <DashboardView
            deposans={deposans}
            onOpenWhatsApp={handleOpenWhatsApp}
            onOpenKADSim={handleOpenKADSim}
            onOpenNasabahDetail={handleOpenNasabahDetail}
            onUpdateStatus={handleUpdateStatus}
            onUpdateTenor={handleUpdateTenor}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeView === 'analitik' && (
          <AnalitikView
            deposans={deposans}
            onOpenKADSim={handleOpenKADSim}
          />
        )}

        {activeView === 'nasabah' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Manajemen Lengkap Portofolio Deposan</h3>
                <p className="text-xs text-slate-500">Kelola CIF, kontak RM, serta riwayat interaksi nasabah</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setImportModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 transition-colors flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Import Excel Baru</span>
                </button>
                <button
                  onClick={handleResetData}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Reset Sampel
                </button>
              </div>
            </div>

            {/* Render Dashboard Table component with filtered view */}
            <DashboardView
              deposans={deposans}
              onOpenWhatsApp={handleOpenWhatsApp}
              onOpenKADSim={handleOpenKADSim}
              onOpenNasabahDetail={handleOpenNasabahDetail}
              onUpdateStatus={handleUpdateStatus}
              onUpdateTenor={handleUpdateTenor}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-700">
            DAMS (Deposit Management System) • Sistem Retensi Deposito & Penawaran KAD Mandiri
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
            <span>Optimalisasi LDR</span>
            <span>•</span>
            <span>Zero Risk NPL 0%</span>
            <span>•</span>
            <span>Deteksi Cashflow Gap</span>
          </div>
        </div>
      </footer>

      {/* Modals Container */}
      <WhatsAppModal
        deposan={selectedDeposanForWA}
        isOpen={waModalOpen}
        onClose={() => setWaModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />

      <KADCalculatorModal
        isOpen={kadSimOpen}
        onClose={() => setKadSimOpen(false)}
        initialDeposit={kadSimDeposit}
        initialDepositRate={kadSimRate}
      />

      <NasabahDetailModal
        deposan={selectedDeposanForDetail}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onOpenWhatsApp={handleOpenWhatsApp}
        onOpenKADSim={handleOpenKADSim}
        onUpdateDeposan={handleUpdateDeposan}
      />

      <ImportExcelModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      <PythonEngineModal
        isOpen={pythonModalOpen}
        onClose={() => setPythonModalOpen(false)}
      />
    </div>
  );
}
