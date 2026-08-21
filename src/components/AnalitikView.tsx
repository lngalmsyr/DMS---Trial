import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  Award, 
  DollarSign, 
  Percent, 
  Zap,
  Info,
  BarChart3,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Deposan } from '../types';
import { formatRupiah, formatRupiahShort } from '../utils/cashflowEngine';

interface AnalitikViewProps {
  deposans: Deposan[];
  onOpenKADSim: (depositAmount: number, depositRate: number) => void;
}

export const AnalitikView: React.FC<AnalitikViewProps> = ({
  deposans,
  onOpenKADSim,
}) => {
  const totalDeposito = deposans.reduce((sum, d) => sum + d.depositoNominal, 0);
  const totalKADPotential = deposans.reduce((sum, d) => sum + d.maxKADLimit, 0);
  const totalKreditExisting = 23000000000; // 23 Miliar
  const totalDPKExisting = 28000000000; // 28 Miliar

  // Dynamic LDR Calculations
  const currentLDR = (totalKreditExisting / totalDPKExisting) * 100;
  
  // Jika 40% dari potensi KAD berhasil dikonversi
  const kadConversionEst = totalKADPotential * 0.4;
  const projectedKredit = totalKreditExisting + kadConversionEst;
  const projectedLDR = (projectedKredit / totalDPKExisting) * 100;

  // Breakdown counts
  const countKadTarget = deposans.filter(d => d.recommendedAction.includes('KAD')).length;
  const countRetensi = deposans.filter(d => d.recommendedAction.includes('Perpanjangan')).length;
  const countInvestasi = deposans.filter(d => d.recommendedAction.includes('Investasi')).length;
  const countLending = deposans.filter(d => d.recommendedAction.includes('Lending')).length;

  return (
    <div className="space-y-6">
      {/* Top Banner: LDR & Strategic Focus */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Zap className="w-3.5 h-3.5" />
            <span>Optimalisasi LDR & LLDR Berbasis Zero-Risk Lending</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Menaikkan LDR Cabang Secara Agresif dengan Risiko Kredit (NPL) 0%
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Kredit Agunan Deposito (KAD) adalah instrumen paling efektif untuk menaikkan rasio likuiditas. 
            Mengingat rumus <span className="font-mono text-amber-300 font-bold">LDR = Total Kredit / Total DPK</span>, penawaran KAD secara bersamaan 
            <strong className="text-white"> mempertahankan penyebut (DPK tetap utuh)</strong> dan 
            <strong className="text-emerald-400"> meningkatkan pembilang (Portofolio Kredit bertambah)</strong>.
          </p>
        </div>

        {/* Dynamic LDR Metric comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">LDR Cabang Saat Ini</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{currentLDR.toFixed(1)}%</p>
            <span className="text-[11px] text-slate-400">Kredit {formatRupiahShort(totalKreditExisting)} / DPK {formatRupiahShort(totalDPKExisting)}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Estimasi Realisasi KAD (40%)</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">+{formatRupiahShort(kadConversionEst)}</p>
            <span className="text-[11px] text-emerald-400/80">Kredit Baru dengan NPL 0%</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Proyeksi LDR Baru</span>
            <p className="text-2xl font-black text-emerald-300 mt-1">{projectedLDR.toFixed(1)}%</p>
            <span className="text-[11px] text-emerald-400">Naik +{(projectedLDR - currentLDR).toFixed(1)}% Tanpa Risiko NPL</span>
          </div>
        </div>
      </div>

      {/* 2. Dua Ancaman Utama Perbankan & Solusi DAMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card: Maturity Mismatch (Risiko Likuiditas) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">1. Ancaman Maturity Mismatch (Risiko Likuiditas)</h3>
              <p className="text-xs text-slate-500">Ketidakseimbangan jangka waktu pendanaan vs penyaluran</p>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            Bank menyalurkan kredit jangka panjang (KPR 15-20 tahun atau kredit investasi korporasi 5 tahun), namun didanai oleh uang deposito jangka pendek (1, 3, atau 12 bulan).
          </p>

          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-1.5">
            <p className="font-bold text-rose-900">⚠️ Risiko Jika Deposan Kakap Menarik Dana:</p>
            <p className="leading-relaxed text-rose-800">
              Jika nasabah tiba-tiba mencairkan deposito karena butuh modal kerja mendadak, uang tersebut sebenarnya sedang "terkunci" di kredit jangka panjang debitur lain. Hal ini memicu pengetatan likuiditas cabang.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
            <p className="font-bold text-emerald-900">🛡️ Solusi DAMS Proaktif:</p>
            <p className="leading-relaxed text-emerald-800">
              Sistem DAMS mendeteksi <em>Cashflow Gap</em> nasabah H-30 hingga H-7 sebelum jatuh tempo. RM segera menawarkan <strong>KAD (Plafon 90%)</strong> sebagai bridge financing, sehingga deposito tidak perlu dicairkan sama sekali!
            </p>
          </div>
        </div>

        {/* Card: Zero-Risk Lending & NPL 0% */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">2. Mengapa KAD Adalah Zero-Risk Lending?</h3>
              <p className="text-xs text-slate-500">Jaminan likuid 100% bilyet deposito yang diblokir sistem</p>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            Kredit Agunan Deposito (KAD) memiliki risiko <em>Non-Performing Loan (NPL)</em> yang nyaris nol:
          </p>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Eksekusi Agunan Otomatis:</strong> Jika nasabah gagal bayar, bank cukup melikuidasi bilyet deposito yang dijaminkan tanpa proses lelang yang rumit.</span>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Nasabah Menang (Win-Win):</strong> Deposito tetap berjalan menghasilkan bunga, nasabah tidak kena denda pinalti pencairan dini, dan likuiditas modal kerja terpenuhi.</span>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>AUM Deposito Terkunci:</strong> Menghindari risiko deposan kakap ditarik oleh bank kompetitor yang menawarkan special rate.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Portofolio Cross-Selling Nasabah Prioritas Bank Mandiri */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900">Matriks Cross-Selling Nasabah Prioritas</h3>
          <p className="text-xs text-slate-500">Peluang optimalisasi AUM & fasilitas kredit lanjutan berdasarkan profil nasabah DAMS</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">KAD (Agunan Deposito)</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                {countKadTarget} Target
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Target nasabah yang mengalami penurunan saldo CASA untuk modal kerja instan.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900">Investasi (SBN / Reksa Dana)</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                {countInvestasi} Target
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Target nasabah berlikuiditas surplus untuk diversifikasi yield dan penguncian AUM.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">Perpanjangan ARO Bundling</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                {countRetensi} Target
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Special rate & cashback loyalty untuk menjaga deposan kakap tidak lari ke bank lain.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">Lending (KSM / KKB / KPR)</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold">
                {countLending} Target
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Penawaran pre-approved pinjaman konsumtif & pembelian aset dengan proses cepat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
