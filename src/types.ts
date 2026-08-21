export interface Deposan {
  id: string;
  cif: string;
  name: string;
  phone: string;
  type: 'Perorangan' | 'Badan Usaha';
  tier: 'Prioritas Platinum' | 'Prioritas Gold' | 'Prioritas Reguler' | 'Korporasi';
  bilyetNo: string;
  depositoNominal: number;
  rateDeposito: number; // e.g. 4.25
  tenorMonths: number; // 1, 3, 6, 12, 24
  jatuhTempoDate: string; // YYYY-MM-DD
  daysRemaining: number;
  
  // CASA Flow Analysis (Giro/Tabungan 3 bulan terakhir)
  casaBalanceCurrent: number;
  casaBalancePrevMonth: number;
  casaBalance3MonthsAgo: number;
  casaTrendPercent: number;
  cashflowGapStatus: 'Kritis (Defisit Parah)' | 'Waspada (Menurun)' | 'Stabil' | 'Surplus';
  cashflowGapEstimated: number; // Estimasi kebutuhan dana darurat
  
  // Rekomendasi Sistem DAMS
  recommendedAction: 'Penawaran KAD (Solusi Likuiditas)' | 'Perpanjangan Deposito + Special Rate' | 'Cross-Sell Investasi (Obligasi/Reksadana)' | 'Cross-Sell Lending (KSM/KKB/KPR)';
  recommendationReason: string;
  maxKADLimit: number; // 90% dari deposito
  
  // Status Retensi RM
  status: 'pending' | 'dihubungi' | 'deal_perpanjang' | 'deal_kad' | 'cross_sell_lain' | 'cairkan';
  rmName: string;
  rmPhone: string;
  notes?: string;
  lastContactDate?: string;
}

export interface BranchMetrics {
  totalDPK: number;
  totalDeposito: number;
  totalKredit: number;
  currentLDR: number;
  potentialKAD: number;
  projectedLDR: number;
  deposanCount: number;
  dueWithin7Days: number;
  dueWithin30Days: number;
  pendingActionCount: number;
  kadConversionCount: number;
  retentionSuccessCount: number;
}

export interface WhatsAppTemplate {
  id: string;
  category: 'kad_offer' | 'deposito_retensi' | 'investasi_cross' | 'prioritas_lending';
  title: string;
  template: string;
}

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  priority: 'Rendah' | 'Sedang' | 'Tinggi';
  completed: boolean;
  dueDate: string;
}

export interface TransactionItem {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category?: string;
  price: number;
  stock: number;
  rating?: number;
  status?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category?: string;
  updatedAt: string;
  tags?: string[];
}

export interface AppTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  badge?: string;
  demoComponentKey: string;
  features?: string[];
  samplePrompt?: string;
}

