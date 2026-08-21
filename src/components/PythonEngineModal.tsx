import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  Play, 
  FileCode, 
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';
import { PYTHON_DAMS_SCRIPT } from '../utils/cashflowEngine';

interface PythonEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonEngineModal: React.FC<PythonEngineModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'script' | 'flow'>('script');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_DAMS_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-950 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-800 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">dams_engine.py</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  Python 3.10+ / Pandas
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logika Algoritma Deteksi Cashflow Gap & Rekomendasi KAD Sederhana
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 pb-0 flex items-center gap-2 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('script')}
            className={`px-3 py-1.5 font-mono font-semibold border-b-2 transition-colors ${
              activeTab === 'script' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Script Python (Pandas)
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-1.5 font-mono font-semibold border-b-2 transition-colors ${
              activeTab === 'flow' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Alur Logika Bisnis KAD
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'script' ? (
            <>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Algoritma Penentu Rekomendasi Berbasis Perubahan CASA:</span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1 font-mono text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin Kode Python'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-emerald-300 font-mono text-xs leading-relaxed overflow-x-auto selection:bg-emerald-900 selection:text-white">
                {PYTHON_DAMS_SCRIPT}
              </pre>
            </>
          ) : (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  1. Deteksi Cashflow Gap (CASA Drop &gt; 25-30%)
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Jika saldo rata-rata Giro & Tabungan nasabah turun drastis dalam 3 bulan terakhir, nasabah menghadapi risiko likuiditas modal kerja. Tanpa sistem proaktif, nasabah cenderung mencairkan deposito saat jatuh tempo.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  2. Solusi KAD (Kredit Agunan Deposito) Plafon 90%
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  KAD menjadi solusi win-win: nasabah mendapatkan dana likuiditas cepat tanpa mencairkan deposito dan bunga deposito tetap mengalir utuh. Bank mendapatkan portofolio kredit baru dengan NPL 0% (Zero Risk).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  3. Dampak Formula LDR Cabang
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Rumus dasar: <span className="font-mono text-amber-300">LDR = Total Kredit / Total DPK</span>.
                  KAD secara cerdas mempertahankan penyebut (DPK) sekaligus meningkatkan pembilang (Kredit), sehingga LDR cabang naik secara sehat dan aman.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
