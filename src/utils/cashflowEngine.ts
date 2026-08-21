import { Deposan } from '../types';

/**
 * Logika Analisis Cashflow Gap & Rekomendasi DAMS (Deposit Management System)
 * 
 * Prinsip:
 * 1. Jika CASA (Giro/Tabungan) mengalami penurunan signifikan (> 25-30%), nasabah terdeteksi 
 *    mengalami short-term cashflow gap (kebutuhan likuiditas operasional / modal kerja).
 * 2. Daripada nasabah mencairkan deposito (DPK cabang turun & maturity mismatch), 
 *    RM segera menawarkan KAD (Kredit Agunan Deposito).
 * 3. KAD = Zero-Risk Lending (NPL 0% karena dijamin 100% bilyet deposito), 
 *    meningkatkan pembilang kredit tanpa mengurangi penyebut DPK -> LDR cabang naik sehat.
 * 4. Jika CASA stabil / surplus tinggi -> Tawarkan Perpanjangan Deposito Special Rate + Cross-Sell Investasi (Obligasi/Reksadana).
 */

export function analyzeCashflowAndRecommend(
  depositoNominal: number,
  casaCurrent: number,
  casaPrevMonth: number,
  casa3MonthsAgo: number,
  tier: string
): {
  casaTrendPercent: number;
  cashflowGapStatus: 'Kritis (Defisit Parah)' | 'Waspada (Menurun)' | 'Stabil' | 'Surplus';
  cashflowGapEstimated: number;
  recommendedAction: 'Penawaran KAD (Solusi Likuiditas)' | 'Perpanjangan Deposito + Special Rate' | 'Cross-Sell Investasi (Obligasi/Reksadana)' | 'Cross-Sell Lending (KSM/KKB/KPR)';
  recommendationReason: string;
  maxKADLimit: number;
} {
  // Hitung tren perubahan saldo CASA 3 bulan terakhir
  const avgPastCASA = (casaPrevMonth + casa3MonthsAgo) / 2;
  const diff = casaCurrent - avgPastCASA;
  const casaTrendPercent = avgPastCASA > 0 ? Math.round((diff / avgPastCASA) * 100) : 0;
  
  const maxKADLimit = Math.round(depositoNominal * 0.9); // Maksimal 90% plafon KAD

  let cashflowGapStatus: 'Kritis (Defisit Parah)' | 'Waspada (Menurun)' | 'Stabil' | 'Surplus' = 'Stabil';
  let cashflowGapEstimated = 0;
  let recommendedAction: 'Penawaran KAD (Solusi Likuiditas)' | 'Perpanjangan Deposito + Special Rate' | 'Cross-Sell Investasi (Obligasi/Reksadana)' | 'Cross-Sell Lending (KSM/KKB/KPR)' = 'Perpanjangan Deposito + Special Rate';
  let recommendationReason = '';

  if (casaTrendPercent <= -35) {
    cashflowGapStatus = 'Kritis (Defisit Parah)';
    cashflowGapEstimated = Math.min(Math.abs(diff) * 1.5, maxKADLimit);
    recommendedAction = 'Penawaran KAD (Solusi Likuiditas)';
    recommendationReason = `Saldo CASA anjlok ${Math.abs(casaTrendPercent)}% dalam 3 bulan. Nasabah terindikasi butuh modal kerja mendesak dan berisiko tinggi mencairkan deposito. Tawarkan KAD hingga ${formatRupiahShort(maxKADLimit)} agar deposito tetap utuh dan bunga tetap mengalir.`;
  } else if (casaTrendPercent < -15) {
    cashflowGapStatus = 'Waspada (Menurun)';
    cashflowGapEstimated = Math.min(Math.abs(diff), maxKADLimit);
    recommendedAction = 'Penawaran KAD (Solusi Likuiditas)';
    recommendationReason = `Tren CASA menurun (${casaTrendPercent}%). Tawarkan fasilitas standby pinjaman KAD sebagai proteksi likuiditas tanpa pinalti pencairan deposito.`;
  } else if (casaTrendPercent >= 20 || casaCurrent > depositoNominal * 0.5) {
    cashflowGapStatus = 'Surplus';
    recommendedAction = 'Cross-Sell Investasi (Obligasi/Reksadana)';
    recommendationReason = `Likuiditas CASA sangat sehat (+${casaTrendPercent}%). Nasabah memiliki kelebihan dana mengendap (idle cash). Sangat prospektif ditawarkan diversifikasi AUM: Obligasi Negara (SBN) atau Reksa Dana Pendapatan Tetap.`;
  } else {
    cashflowGapStatus = 'Stabil';
    if (tier.includes('Platinum') || tier.includes('Private')) {
      recommendedAction = 'Perpanjangan Deposito + Special Rate';
      recommendationReason = `Arus kas nasabah stabil. Pertahankan loyalitas AUM dengan program Perpanjangan ARO (Automatic Roll Over) dengan bundling Special Rate bunga kompetitif + Reward Prioritas.`;
    } else {
      recommendedAction = 'Cross-Sell Lending (KSM/KKB/KPR)';
      recommendationReason = `Profil nasabah sangat baik dengan arus kas stabil. Prospek untuk cross-selling fasilitas pinjaman konsumtif (KSM Mandiri, KKB Kendaraan, atau KPR Take Over).`;
    }
  }

  return {
    casaTrendPercent,
    cashflowGapStatus,
    cashflowGapEstimated,
    recommendedAction,
    recommendationReason,
    maxKADLimit
  };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRupiahShort(amount: number): string {
  if (amount >= 1000000000000) {
    return `Rp ${(amount / 1000000000000).toFixed(1).replace('.0', '')} T`;
  }
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1).replace('.0', '')} M`;
  }
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1).replace('.0', '')} Jt`;
  }
  return formatRupiah(amount);
}

/**
 * Contoh implementasi script Python untuk analitik DAMS
 */
export const PYTHON_DAMS_SCRIPT = `"""
DAMS (Deposit Management System) - Cashflow Gap & KAD Recommendation Engine
Author: Tim DAMS Cabang
Deskripsi: Memetakan potensi pencairan deposito berbasis penurunan CASA dan merekomendasikan KAD
"""

import pandas as pd
import numpy as np

def dams_recommendation_engine(df_nasabah):
    """
    df_nasabah memiliki kolom:
    - cif, nama, nominal_deposito, saldo_casa_now, saldo_casa_m1, saldo_casa_m3, tier
    """
    
    # 1. Hitung Tren Penurunan CASA (Cashflow Gap Indicator)
    avg_past_casa = (df_nasabah['saldo_casa_m1'] + df_nasabah['saldo_casa_m3']) / 2
    df_nasabah['casa_trend_pct'] = ((df_nasabah['saldo_casa_now'] - avg_past_casa) / avg_past_casa) * 100
    
    # 2. Hitung Plafon Maksimal KAD (Kredit Agunan Deposito) 90%
    df_nasabah['max_kad_limit'] = df_nasabah['nominal_deposito'] * 0.90
    
    # 3. Logika Rekomendasi Cross-Selling
    def tentukan_rekomendasi(row):
        trend = row['casa_trend_pct']
        if trend <= -25:
            return {
                'status_gap': 'Kritis (Defisit Parah)',
                'action': 'Penawaran KAD (Solusi Likuiditas)',
                'urgensi': 'Tinggi (Risiko Pencairan Deposito)',
                'alasan': f'CASA anjlok {abs(trend):.1f}%. Tawarkan KAD tanpa cairkan deposito.'
            }
        elif trend < -10:
            return {
                'status_gap': 'Waspada (Menurun)',
                'action': 'Penawaran KAD (Solusi Likuiditas)',
                'urgensi': 'Sedang',
                'alasan': 'CASA menurun. Siapkan standby line KAD.'
            }
        elif trend >= 20:
            return {
                'status_gap': 'Surplus',
                'action': 'Cross-Sell Investasi (Obligasi/Reksadana)',
                'urgensi': 'Peluang AUM',
                'alasan': 'Likuiditas berlebih. Tawarkan SBN / Reksadana.'
            }
        else:
            return {
                'status_gap': 'Stabil',
                'action': 'Perpanjangan Deposito + Special Rate',
                'urgensi': 'Normal',
                'alasan': 'Pertahankan AUM Deposito dengan Bundling Rate.'
            }
            
    rekomendasi_results = df_nasabah.apply(tentukan_rekomendasi, axis=1)
    df_nasabah['rekomendasi'] = [r['action'] for r in rekomendasi_results]
    df_nasabah['gap_status'] = [r['status_gap'] for r in rekomendasi_results]
    df_nasabah['alasan'] = [r['alasan'] for r in rekomendasi_results]
    
    return df_nasabah

# Eksekusi Analisis
# df_hasil = dams_recommendation_engine(df_import_excel)
# print(df_hasil[['nama', 'nominal_deposito', 'casa_trend_pct', 'rekomendasi']])
`;
