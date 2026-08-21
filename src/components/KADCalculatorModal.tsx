import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  Percent, 
  ArrowRight,
  Info,
  Scale
} from 'lucide-react';
import { formatRupiah, formatRupiahShort } from '../utils/cashflowEngine';

interface KADCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDeposit?: number;
  initialDepositRate?: number;
  totalDPKCabang?: number;
  totalKreditCabang?: number;
}

export const KADCalculatorModal: React.FC<KADCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialDeposit = 2000000000,
  initialDepositRate = 4.25,
  totalDPKCabang = 28000000000,
  totalKreditCabang = 23000000000,
}) => {
  const [depositoVal, setDepositoVal] = useState<number>(initialDeposit);
  const [rateDepo, setRateDepo] = useState<number>(initialDepositRate);
  const [persenPlafon, setPersenPlafon] = useState<number>(90); // 90%
  const [spreadMargin, setSpreadMargin] = useState<number>(2.5); // Spread 2.5% di atas bunga depo
  const [tenorBulan, setTenorBulan] = useState<number>(6);

  if (!isOpen) return null;

  const plafonKAD = (depositoVal * persenPlafon) / 100;
  const sukuBungaKAD = rateDepo + spreadMargin; // e.g. 4.25 + 2.5 = 6.75%
  
  // Pendapatan Bunga Deposito Nasabah (Gross tahunan & per periode tenor)
  const bungaDepositoDiterima = (depositoVal * (rateDepo / 100) * (tenorBulan / 12));
  
  // Biaya Bunga Pinjaman KAD yang dibayar
  const biayaBungaKAD = (plafonKAD * (sukuBungaKAD / 100) * (tenorBulan / 12));
  
  // Beban Biaya Riil (Net Cost)
  const netBiayaBunga = biayaBungaKAD - bungaDepositoDiterima;

  // LDR Simulation:
  // Current LDR = Kredit / DPK
  const currentLDR = (totalKreditCabang / totalDPKCabang) * 100;
  
  // Scenario 1: Nasabah cairkan deposito (DPK turun, Kredit tetap)
  const dpkIfLiquidated = totalDPKCabang - depositoVal;
  const ldrIfLiquidated = (totalKreditCabang / dpkIfLiquidated) * 100; // DPK hilang!
  
  // Scenario 2: Nasabah ambil KAD (DPK tetap, Kredit NAIK sebesar Plafon KAD)
  const kreditWithKAD = totalKreditCabang + plafonKAD;
  const ldrWithKAD = (kreditWithKAD / totalDPKCabang) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold">Kalkulator & Simulator Kredit Agunan Deposito (KAD)</h3>
              <p className="text-xs text-blue-100">
                Solusi Likuiditas Nasabah • Zero-Risk Lending (NPL 0%) • Optimasi LDR Cabang
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Input Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nominal Deposito (Rp)</label>
              <input
                type="number"
                value={depositoVal}
                step="50000000"
                onChange={(e) => setDepositoVal(Math.max(10000000, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 font-semibold">{formatRupiah(depositoVal)}</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Bunga Deposito (%)</label>
              <input
                type="number"
                value={rateDepo}
                step="0.25"
                onChange={(e) => setRateDepo(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 font-semibold">{rateDepo}% p.a.</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Plafon KAD (%)</label>
              <select
                value={persenPlafon}
                onChange={(e) => setPersenPlafon(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value={90}>Maks 90% (Rekomendasi)</option>
                <option value={85}>85% Plafon</option>
                <option value={80}>80% Plafon</option>
                <option value={70}>70% Plafon</option>
              </select>
              <span className="text-[10px] text-emerald-600 font-bold">{formatRupiah(plafonKAD)}</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tenor Pinjaman</label>
              <select
                value={tenorBulan}
                onChange={(e) => setTenorBulan(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value={1}>1 Bulan</option>
                <option value={3}>3 Bulan</option>
                <option value={6}>6 Bulan</option>
                <option value={12}>12 Bulan (1 Tahun)</option>
              </select>
              <span className="text-[10px] text-slate-500 font-semibold">Spread: +{spreadMargin}% ({sukuBungaKAD}% p.a.)</span>
            </div>
          </div>

          {/* Value Comparison Card (Nasabah Perspective) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Keuntungan Finansial Bagi Nasabah (Tanpa Cairkan Deposito):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[11px] font-semibold text-emerald-800">Dana Cair Langsung (Plafon)</span>
                <p className="text-lg font-black text-emerald-700 mt-1">{formatRupiah(plafonKAD)}</p>
                <p className="text-[10px] text-emerald-600 mt-1">90% bilyet siap pakai modal kerja</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-[11px] font-semibold text-blue-800">Bunga Deposito Tetap Masuk</span>
                <p className="text-lg font-black text-blue-700 mt-1">+{formatRupiah(bungaDepositoDiterima)}</p>
                <p className="text-[10px] text-blue-600 mt-1">Dihitung selama {tenorBulan} bulan ({rateDepo}%)</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[11px] font-semibold text-amber-800">Biaya Riil Pinjaman (Net Cost)</span>
                <p className="text-lg font-black text-amber-800 mt-1">{formatRupiah(netBiayaBunga)}</p>
                <p className="text-[10px] text-amber-700 mt-1">Hanya selisih spread {spreadMargin}% p.a.</p>
              </div>
            </div>
          </div>

          {/* LDR Branch Impact Simulator */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
                  Dampak Terhadap Rasio LDR Cabang (LDR = Kredit / DPK)
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Zero-Risk NPL 0%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700">
                <span className="text-slate-400">1. Posisi LDR Saat Ini</span>
                <p className="text-base font-bold text-white mt-1">{currentLDR.toFixed(1)}%</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Kredit: {formatRupiahShort(totalKreditCabang)} / DPK: {formatRupiahShort(totalDPKCabang)}</p>
              </div>

              <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800/60">
                <span className="text-rose-300">2. Jika Deposito Dicairkan</span>
                <p className="text-base font-bold text-rose-400 mt-1">DPK Hilang {formatRupiahShort(depositoVal)}</p>
                <p className="text-[10px] text-rose-300/80 mt-0.5">Memicu risiko likuiditas & maturity mismatch</p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-700">
                <span className="text-emerald-300">3. Jika Sukses KAD (Rekomendasi)</span>
                <p className="text-base font-bold text-emerald-400 mt-1">{ldrWithKAD.toFixed(1)}% (+{(ldrWithKAD - currentLDR).toFixed(1)}%)</p>
                <p className="text-[10px] text-emerald-300/80 mt-0.5">DPK tetap utuh & Portofolio kredit naik!</p>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 bg-slate-800/60 p-3 rounded-lg flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Keunggulan Bank:</strong> KAD adalah fasilitas kredit dengan jaminan bilyet 100% di bank kita sendiri. Jika nasabah gagal bayar, bank cukup melikuidasi deposito agunan (NPL 0%). Ini adalah cara paling aman menaikkan Loan to Deposit Ratio (LDR) cabang.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            Tutup Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
