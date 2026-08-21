import React from 'react';
import { 
  Building2, 
  UploadCloud, 
  Download, 
  Code2, 
  Calculator, 
  TrendingUp, 
  Users, 
  LayoutDashboard,
  ShieldCheck,
  Search,
  Bell,
  Sparkles
} from 'lucide-react';
import { formatRupiahShort } from '../utils/cashflowEngine';

interface NavbarProps {
  activeView: 'dashboard' | 'analitik' | 'nasabah';
  setActiveView: (view: 'dashboard' | 'analitik' | 'nasabah') => void;
  onOpenImport: () => void;
  onExportExcel: () => void;
  onOpenPython: () => void;
  onOpenKADSim: () => void;
  totalDeposito: number;
  potentialKAD: number;
  currentLDR: number;
  projectedLDR: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onOpenImport,
  onExportExcel,
  onOpenPython,
  onOpenKADSim,
  totalDeposito,
  potentialKAD,
  currentLDR,
  projectedLDR,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner / Branch Health Bar */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-blue-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bank Mandiri • DAMS Hub Cabang</span>
          </span>
          <span className="text-slate-400 hidden md:inline">|</span>
          <span className="text-slate-300 hidden md:inline">
            Total Deposito: <strong className="text-white font-semibold">{formatRupiahShort(totalDeposito)}</strong>
          </span>
          <span className="text-slate-400 hidden md:inline">|</span>
          <span className="text-slate-300 hidden md:inline">
            Potensi KAD: <strong className="text-emerald-400 font-semibold">{formatRupiahShort(potentialKAD)}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">LDR Cabang:</span>
            <span className="font-bold text-amber-400">{currentLDR.toFixed(1)}%</span>
            <span className="text-slate-400">➔</span>
            <span className="text-slate-400">Potensi (+KAD):</span>
            <span className="font-bold text-emerald-400">{projectedLDR.toFixed(1)}%</span>
          </div>
          <button 
            onClick={onOpenKADSim}
            className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded text-[11px] font-bold transition-colors flex items-center gap-1"
          >
            <Calculator className="w-3 h-3" />
            <span>Kalkulator KAD</span>
          </button>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-black text-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900 tracking-tight">DAMS System</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                Deposit Retention & KAD Cross-Selling
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Pantauan Deposito</span>
            </button>

            <button
              onClick={() => setActiveView('analitik')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'analitik'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Analitik & LDR Engine</span>
            </button>

            <button
              onClick={() => setActiveView('nasabah')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'nasabah'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Daftar Deposan</span>
            </button>
          </nav>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search */}
          <div className="relative hidden sm:block w-48 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, CIF, bilyet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Python Logic Engine Button */}
          <button
            onClick={onOpenPython}
            className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Lihat Logika Algoritma Python"
          >
            <Code2 className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Logika Python</span>
          </button>

          {/* Import Excel */}
          <button
            onClick={onOpenImport}
            className="px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-2xs"
          >
            <UploadCloud className="w-4 h-4 text-emerald-600" />
            <span>Import Excel</span>
          </button>

          {/* Export Excel */}
          <button
            onClick={onExportExcel}
            className="p-2 sm:px-3 sm:py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
            title="Unduh Data Deposan Excel"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
