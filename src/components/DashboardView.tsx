import React, { useState } from 'react';
import { 
  Building2, 
  Calendar as CalendarIcon, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MessageCircle, 
  Calculator, 
  Info, 
  Filter, 
  DollarSign, 
  Zap, 
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { Deposan } from '../types';
import { formatRupiah, formatRupiahShort } from '../utils/cashflowEngine';

interface DashboardViewProps {
  deposans: Deposan[];
  onOpenWhatsApp: (deposan: Deposan) => void;
  onOpenKADSim: (depositAmount: number, depositRate: number) => void;
  onOpenNasabahDetail: (deposan: Deposan) => void;
  onUpdateStatus: (id: string, newStatus: Deposan['status'], note?: string) => void;
  onUpdateTenor: (id: string, tenorMonths: number) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  deposans,
  onOpenWhatsApp,
  onOpenKADSim,
  onOpenNasabahDetail,
  onUpdateStatus,
  onUpdateTenor,
  searchQuery,
  setSearchQuery,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gapFilter, setGapFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  
  // Calendar State
  const [calMonth, setCalMonth] = useState<number>(7); // August (0-indexed = 7)
  const [calYear, setCalYear] = useState<number>(2026);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Computed Metrics
  const totalDeposito = deposans.reduce((sum, d) => sum + d.depositoNominal, 0);
  const totalPotentialKAD = deposans.reduce((sum, d) => sum + d.maxKADLimit, 0);
  const countDue7Days = deposans.filter(d => d.daysRemaining <= 7).length;
  const countDue30Days = deposans.filter(d => d.daysRemaining <= 30).length;
  const countPending = deposans.filter(d => d.status === 'pending').length;
  const countKadDeal = deposans.filter(d => d.status === 'deal_kad').length;
  const countRetensiDeal = deposans.filter(d => d.status === 'deal_perpanjang').length;

  // Filtered List
  const filteredDeposans = deposans.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cif.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery) ||
      item.bilyetNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesGap = gapFilter === 'all' || 
      (gapFilter === 'kad' && item.recommendedAction.includes('KAD')) ||
      (gapFilter === 'kritis' && item.cashflowGapStatus.includes('Kritis')) ||
      (gapFilter === 'surplus' && item.cashflowGapStatus === 'Surplus');
    const matchesTier = tierFilter === 'all' || item.tier === tierFilter;
    const matchesCal = selectedDay === null || item.daysRemaining === selectedDay;

    return matchesSearch && matchesStatus && matchesGap && matchesTier && matchesCal;
  });

  // Calendar Helpers
  const monthsName = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
  const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const urgentRecommendations = deposans
    .filter(d => (d.status === 'pending' || d.status === 'dihubungi') && (d.daysRemaining <= 7 || d.recommendedAction.includes('KAD')))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. Top KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Card 1: Total Deposito */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total DPK Deposito</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-900 mt-2">{formatRupiahShort(totalDeposito)}</p>
          <span className="text-[10px] text-slate-500 font-medium">{deposans.length} Rekening Aktif</span>
        </div>

        {/* Card 2: Potensi KAD */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Potensi KAD (90%)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-emerald-700 mt-2">{formatRupiahShort(totalPotentialKAD)}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">Peluang Kredit Zero Risk</span>
        </div>

        {/* Card 3: Jatuh Tempo < 7 Hari */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Jatuh Tempo &lt; 7 Hari</span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-rose-600 mt-2">{countDue7Days}</p>
          <span className="text-[10px] text-rose-500 font-medium">Perlu Kontak Mendesak</span>
        </div>

        {/* Card 4: Jatuh Tempo < 30 Hari */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Jatuh Tempo &lt; 30 Hari</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-amber-600 mt-2">{countDue30Days}</p>
          <span className="text-[10px] text-slate-500 font-medium">Pipeline Retensi Bulanan</span>
        </div>

        {/* Card 5: Belum Dikonfirmasi */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Belum Dihubungi</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-800 mt-2">{countPending}</p>
          <span className="text-[10px] text-slate-500 font-medium">Antrean RM Cabang</span>
        </div>

        {/* Card 6: Deal KAD & Retensi */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Realisasi Deal</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-blue-600 mt-2">{countKadDeal + countRetensiDeal}</p>
          <span className="text-[10px] text-slate-500 font-medium">KAD: {countKadDeal} | ARO: {countRetensiDeal}</span>
        </div>
      </div>

      {/* 2. Middle Section: Chart / Highlights + Interactive Calendar + Urgent Priority Contact List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Trend Saldo Deposito & Grab KAD (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Performa Retensi Deposito & Konversi KAD Cabang</h3>
              <p className="text-xs text-slate-500">Mencegah Outflow DPK sekaligus meningkatkan Portofolio Kredit</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-blue-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Saldo Deposito
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Konversi KAD
              </span>
            </div>
          </div>

          {/* Mini Graphical Representation */}
          <div className="space-y-3 pt-2">
            {[
              { month: 'Jan', depo: 20.5, kad: 0.8 },
              { month: 'Feb', depo: 21.0, kad: 1.4 },
              { month: 'Mar', depo: 21.8, kad: 0.6 },
              { month: 'Apr', depo: 21.5, kad: 2.2 },
              { month: 'Mei', depo: 22.2, kad: 1.1 },
              { month: 'Jun', depo: 22.0, kad: 1.9 },
              { month: 'Jul', depo: 22.5, kad: 0.7 },
              { month: 'Agu (Est)', depo: 22.7, kad: 2.5 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <span className="w-14 font-semibold text-slate-600 shrink-0">{item.month} 2026</span>
                <div className="flex-1 bg-slate-100 h-4 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-600 h-full rounded-l-full transition-all duration-300"
                    style={{ width: `${(item.depo / 25) * 80}%` }}
                    title={`Deposito: Rp ${item.depo} M`}
                  ></div>
                  <div
                    className="bg-emerald-500 h-full rounded-r-full transition-all duration-300"
                    style={{ width: `${(item.kad / 3) * 20}%` }}
                    title={`KAD: Rp ${item.kad} M`}
                  ></div>
                </div>
                <div className="w-24 text-right font-mono font-bold text-slate-800 text-[11px] shrink-0">
                  Rp {item.depo}M <span className="text-emerald-600 font-normal">({item.kad}M)</span>
                </div>
              </div>
            ))}
          </div>

          {/* DAMS Strategy Callout */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5 mt-2">
            <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Kunci Keberhasilan Cabang:</strong> Setiap bilyet deposito yang mengalami <em>Cashflow Gap</em> segera ditawarkan <strong>KAD (Plafon 90%)</strong>. Nasabah mendapatkan modal kerja cepat, deposito tetap utuh (DPK terjaga), dan LDR cabang melonjak aman dengan NPL 0%.
            </p>
          </div>
        </div>

        {/* Right: Interactive Due Date Calendar & Priority Quick Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Calendar Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900">
                  Kalender Jatuh Tempo ({monthsName[calMonth]} {calYear})
                </h4>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
                    else { setCalMonth(calMonth - 1); }
                  }}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
                    else { setCalMonth(calMonth + 1); }
                  }}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
              <div>Sn</div><div>Sl</div><div>Rb</div><div>Km</div><div>Jm</div><div>Sb</div><div>Mg</div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="py-1.5"></div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const matchDeposans = deposans.filter(d => d.daysRemaining === day);
                const hasMatch = matchDeposans.length > 0;
                const isSelected = selectedDay === day;

                let colorStyle = "bg-slate-50 text-slate-700 hover:bg-slate-100";
                if (hasMatch) {
                  if (day <= 7) {
                    colorStyle = "bg-rose-100 text-rose-800 font-bold border border-rose-300";
                  } else if (day <= 30) {
                    colorStyle = "bg-amber-100 text-amber-800 font-bold border border-amber-300";
                  } else {
                    colorStyle = "bg-emerald-100 text-emerald-800 font-bold border border-emerald-300";
                  }
                }

                if (isSelected) {
                  colorStyle += " ring-2 ring-blue-600 ring-offset-1";
                }

                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`py-1.5 rounded-lg text-xs font-semibold relative transition-all cursor-pointer ${colorStyle}`}
                    title={hasMatch ? `${matchDeposans.length} Nasabah Jatuh Tempo` : `Tanggal ${day}`}
                  >
                    {day}
                    {hasMatch && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-slate-900"></span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>&lt;7 Hari</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span>&lt;30 Hari</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Aman</span>
              {selectedDay !== null && (
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Reset Filter ({selectedDay} Agt)
                </button>
              )}
            </div>
          </div>

          {/* Urgent Priority Quick Contacts */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Rekomendasi Kontak Prioritas Hari Ini</span>
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                Urgent
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {urgentRecommendations.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between gap-2 text-xs transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 truncate">{item.name}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-semibold text-blue-700">{formatRupiahShort(item.depositoNominal)}</span>
                      <span>•</span>
                      <span className="text-rose-600 font-bold">Sisa {item.daysRemaining} Hari</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onOpenWhatsApp(item)}
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                      title="Hubungi via WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenNasabahDetail(item)}
                      className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Data Table: Daftar Nasabah & Sisa Hari Jatuh Tempo */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-0">
        {/* Table Header & Advanced Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Daftar Nasabah Deposito & Analisis Cashflow DAMS</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau penurunan saldo CASA, rekomendasi penawaran KAD, dan kelola status perpanjangan bilyet
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Semua Status Retensi</option>
              <option value="pending">⏳ Pending (Belum Dihubungi)</option>
              <option value="dihubungi">📞 Sudah Dihubungi</option>
              <option value="deal_kad">🎉 Deal KAD (Kredit Masuk)</option>
              <option value="deal_perpanjang">✓ Deal Perpanjang ARO</option>
              <option value="cairkan">⚠️ Permintaan Cair</option>
            </select>

            {/* Filter Rekomendasi & Cashflow Gap */}
            <select
              value={gapFilter}
              onChange={(e) => setGapFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Semua Profil Cashflow</option>
              <option value="kad">⚡ Target KAD (Solusi Likuiditas)</option>
              <option value="kritis">🚨 CASA Defisit Parah (&lt; -25%)</option>
              <option value="surplus">💎 CASA Surplus (Target Investasi SBN)</option>
            </select>

            {/* Filter Tier */}
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Semua Tier Nasabah</option>
              <option value="Korporasi">Korporasi & Badan Usaha</option>
              <option value="Prioritas Platinum">Prioritas Platinum</option>
              <option value="Prioritas Gold">Prioritas Gold</option>
              <option value="Prioritas Reguler">Prioritas Reguler</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto max-h-[650px] overflow-y-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 sticky top-0 z-10 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
              <tr>
                <th scope="col" className="px-4 py-3 text-left">Nasabah & CIF</th>
                <th scope="col" className="px-3 py-3 text-left">Tenor</th>
                <th scope="col" className="px-4 py-3 text-left">Nominal Deposito</th>
                <th scope="col" className="px-3 py-3 text-left">Jatuh Tempo</th>
                <th scope="col" className="px-3 py-3 text-left">Tren CASA (3 Bln)</th>
                <th scope="col" className="px-4 py-3 text-left">Rekomendasi DAMS</th>
                <th scope="col" className="px-3 py-3 text-left">Status Retensi</th>
                <th scope="col" className="px-4 py-3 text-center">Aksi Cepat</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-slate-100">
              {filteredDeposans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    Tidak ada data nasabah yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredDeposans.map((item) => {
                  const isCritical = item.daysRemaining <= 7;
                  const isKADTarget = item.recommendedAction.includes('KAD');

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Nasabah & CIF */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            item.tier.includes('Korporasi') ? 'bg-blue-100 text-blue-800' :
                            item.tier.includes('Platinum') ? 'bg-purple-100 text-purple-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {item.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer" onClick={() => onOpenNasabahDetail(item)}>
                              {item.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                              {item.cif} • {item.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tenor */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <select
                          value={item.tenorMonths}
                          onChange={(e) => onUpdateTenor(item.id, Number(e.target.value))}
                          className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
                        >
                          <option value={1}>1 Bln</option>
                          <option value={3}>3 Bln</option>
                          <option value={6}>6 Bln</option>
                          <option value={12}>12 Bln</option>
                          <option value={24}>24 Bln</option>
                        </select>
                      </td>

                      {/* Nominal Deposito */}
                      <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-900">
                        {formatRupiah(item.depositoNominal)}
                        <span className="block text-[10px] text-blue-600 font-semibold">{item.rateDeposito}% p.a.</span>
                      </td>

                      {/* Jatuh Tempo & Sisa Hari */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                          item.daysRemaining <= 3 ? 'bg-rose-100 text-rose-800' :
                          item.daysRemaining <= 7 ? 'bg-rose-50 text-rose-700' :
                          item.daysRemaining <= 30 ? 'bg-amber-50 text-amber-700' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{item.daysRemaining} Hari ({item.jatuhTempoDate})</span>
                        </span>
                      </td>

                      {/* Tren CASA 3 Bulan */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {item.casaTrendPercent < 0 ? (
                            <TrendingDown className={`w-4 h-4 shrink-0 ${item.casaTrendPercent < -25 ? 'text-rose-600' : 'text-amber-500'}`} />
                          ) : (
                            <TrendingUp className="w-4 h-4 shrink-0 text-emerald-600" />
                          )}
                          <div>
                            <span className={`font-bold ${
                              item.casaTrendPercent < -25 ? 'text-rose-700' :
                              item.casaTrendPercent < 0 ? 'text-amber-700' :
                              'text-emerald-700'
                            }`}>
                              {item.casaTrendPercent > 0 ? `+${item.casaTrendPercent}%` : `${item.casaTrendPercent}%`}
                            </span>
                            <span className="block text-[10px] text-slate-400">{formatRupiahShort(item.casaBalanceCurrent)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Rekomendasi DAMS */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="max-w-[200px]">
                          <span className={`px-2 py-1 rounded-lg text-[11px] font-bold block truncate ${
                            isKADTarget ? 'bg-blue-100 text-blue-900 border border-blue-300 shadow-2xs' :
                            item.recommendedAction.includes('Investasi') ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {item.recommendedAction}
                          </span>
                          {isKADTarget && (
                            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                              Plafon: {formatRupiahShort(item.maxKADLimit)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Retensi */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <select
                          value={item.status}
                          onChange={(e) => onUpdateStatus(item.id, e.target.value as any)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border-0 ring-1 ring-inset outline-none cursor-pointer ${
                            item.status === 'pending' ? 'bg-rose-50 text-rose-700 ring-rose-300' :
                            item.status === 'dihubungi' ? 'bg-yellow-50 text-yellow-800 ring-yellow-300' :
                            item.status === 'deal_kad' ? 'bg-blue-50 text-blue-800 ring-blue-300' :
                            item.status === 'deal_perpanjang' ? 'bg-emerald-50 text-emerald-800 ring-emerald-300' :
                            'bg-slate-100 text-slate-700 ring-slate-300'
                          }`}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="dihubungi">📞 Dihubungi</option>
                          <option value="deal_kad">🎉 Deal KAD</option>
                          <option value="deal_perpanjang">✓ Deal ARO</option>
                          <option value="cross_sell_lain">💼 Cross-Sell</option>
                          <option value="cairkan">⚠️ Cairkan</option>
                        </select>
                      </td>

                      {/* Aksi Cepat */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* WhatsApp Action */}
                          <button
                            onClick={() => onOpenWhatsApp(item)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                            title="Kirim Pesan WhatsApp RM"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          {/* KAD Simulator */}
                          <button
                            onClick={() => onOpenKADSim(item.depositoNominal, item.rateDeposito)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                            title="Hitung Simulasi KAD"
                          >
                            <Calculator className="w-4 h-4" />
                          </button>

                          {/* Detail Info */}
                          <button
                            onClick={() => onOpenNasabahDetail(item)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            title="Detail Lengkap & Catatan CRM"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
