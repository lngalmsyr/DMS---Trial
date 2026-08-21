import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Calendar, 
  TrendingDown, 
  TrendingUp, 
  Zap, 
  MessageCircle, 
  Calculator, 
  Save, 
  Building,
  Shield,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Deposan } from '../types';
import { formatRupiah, formatRupiahShort } from '../utils/cashflowEngine';

interface NasabahDetailModalProps {
  deposan: Deposan | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatsApp: (deposan: Deposan) => void;
  onOpenKADSim: (depositAmount: number, depositRate: number) => void;
  onUpdateDeposan: (updated: Deposan) => void;
}

export const NasabahDetailModal: React.FC<NasabahDetailModalProps> = ({
  deposan,
  isOpen,
  onClose,
  onOpenWhatsApp,
  onOpenKADSim,
  onUpdateDeposan,
}) => {
  if (!isOpen || !deposan) return null;

  const [notes, setNotes] = useState(deposan.notes || '');
  const [status, setStatus] = useState(deposan.status);
  const [tenorMonths, setTenorMonths] = useState(deposan.tenorMonths);

  const handleSave = () => {
    onUpdateDeposan({
      ...deposan,
      notes,
      status,
      tenorMonths,
      lastContactDate: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  const isGapCritical = deposan.cashflowGapStatus.includes('Kritis') || deposan.cashflowGapStatus.includes('Waspada');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
              {deposan.type === 'Badan Usaha' ? <Building className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{deposan.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  deposan.tier.includes('Platinum') ? 'bg-purple-100 text-purple-900' :
                  deposan.tier.includes('Korporasi') ? 'bg-blue-100 text-blue-900' :
                  'bg-amber-100 text-amber-900'
                }`}>
                  {deposan.tier}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                CIF: {deposan.cif} • Bilyet: {deposan.bilyetNo} • Telp/WA: {deposan.phone}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500">Nominal Deposito</span>
              <p className="text-base font-bold text-slate-900 mt-1">{formatRupiah(deposan.depositoNominal)}</p>
              <span className="text-[10px] text-blue-600 font-semibold">{deposan.rateDeposito}% p.a.</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500">Jatuh Tempo</span>
              <p className={`text-base font-bold mt-1 ${deposan.daysRemaining <= 7 ? 'text-rose-600' : 'text-slate-900'}`}>
                {deposan.daysRemaining} Hari Lagi
              </p>
              <span className="text-[10px] text-slate-500">{deposan.jatuhTempoDate}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500">Plafon Maks KAD (90%)</span>
              <p className="text-base font-bold text-emerald-600 mt-1">{formatRupiahShort(deposan.maxKADLimit)}</p>
              <span className="text-[10px] text-emerald-600">Zero Risk Lending</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500">Relationship Manager</span>
              <p className="text-xs font-bold text-slate-900 mt-1 truncate">{deposan.rmName}</p>
              <span className="text-[10px] text-slate-500">{deposan.rmPhone}</span>
            </div>
          </div>

          {/* CASA Flow & Cashflow Gap Section */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Analisis Arus Kas CASA (Giro & Tabungan 3 Bulan Terakhir)
                </h4>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                deposan.cashflowGapStatus.includes('Kritis') ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                deposan.cashflowGapStatus.includes('Waspada') ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {deposan.cashflowGapStatus} ({deposan.casaTrendPercent > 0 ? `+${deposan.casaTrendPercent}%` : `${deposan.casaTrendPercent}%`})
              </span>
            </div>

            {/* 3-Month Bar Visualization */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-400">3 Bulan Lalu (M-3)</span>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{formatRupiah(deposan.casaBalance3MonthsAgo)}</p>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-400">Bulan Lalu (M-1)</span>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{formatRupiah(deposan.casaBalancePrevMonth)}</p>
              </div>

              <div className={`p-3 rounded-lg border ${isGapCritical ? 'bg-rose-50/70 border-rose-300' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-semibold text-slate-500">Saldo CASA Saat Ini</span>
                <p className={`text-sm font-bold mt-0.5 ${isGapCritical ? 'text-rose-700' : 'text-slate-900'}`}>
                  {formatRupiah(deposan.casaBalanceCurrent)}
                </p>
              </div>
            </div>

            {/* AI / Engine Diagnostic Note */}
            <div className="p-3 rounded-lg bg-blue-50/80 border border-blue-200 text-xs text-blue-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-900">
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span>Rekomendasi DAMS: {deposan.recommendedAction}</span>
              </div>
              <p className="text-slate-700 leading-relaxed">{deposan.recommendationReason}</p>
            </div>
          </div>

          {/* CRM Action & Notes Update */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Status Retensi & Catatan RM:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Status Progres Retensi</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="pending">⏳ Pending (Belum Dihubungi)</option>
                  <option value="dihubungi">📞 Sudah Dihubungi RM / CS</option>
                  <option value="deal_kad">🎉 Deal KAD (Kredit Agunan Deposito)</option>
                  <option value="deal_perpanjang">✓ Deal Perpanjang Deposito ARO</option>
                  <option value="cross_sell_lain">💼 Cross-Sell Produk Lain (Investasi/KPR)</option>
                  <option value="cairkan">⚠️ Permintaan Pencairan / Pindah Bank</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Tenor Deposito Terpilih</label>
                <select
                  value={tenorMonths}
                  onChange={(e) => setTenorMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value={1}>1 Bulan</option>
                  <option value={3}>3 Bulan</option>
                  <option value={6}>6 Bulan</option>
                  <option value={12}>12 Bulan (1 Tahun)</option>
                  <option value={24}>24 Bulan (2 Tahun)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Catatan Interaksi & Respon Nasabah</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Tuliskan hasil pembicaraan dengan nasabah, jadwal follow-up, atau preferensi produk..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => onOpenWhatsApp(deposan)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Buka WhatsApp RM</span>
            </button>

            <button
              onClick={() => onOpenKADSim(deposan.depositoNominal, deposan.rateDeposito)}
              className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Calculator className="w-4 h-4" />
              <span>Simulasi KAD</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
