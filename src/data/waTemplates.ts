import { WhatsAppTemplate, Deposan } from '../types';
import { formatRupiah, formatRupiahShort } from '../utils/cashflowEngine';

export const WA_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'kad_offer',
    category: 'kad_offer',
    title: 'Penawaran KAD (Kredit Agunan Deposito) - Solusi Cashflow',
    template: `Yth. Bapak/Ibu {NAMA_NASABAH},

Perkenalkan saya {NAMA_RM} dari Bank Mandiri Cabang Utama.

Berdasarkan catatan kami, bilyet deposito Anda sebesar *{NOMINAL_DEPOSITO}* akan jatuh tempo pada *{TANGGAL_JATUH_TEMPO}* ({SISA_HARI} hari lagi).

💡 *Solusi Likuiditas Bisnis Tanpa Mencairkan Deposito:*
Jika Bapak/Ibu saat ini sedang membutuhkan dana likuiditas cepat atau perputaran modal kerja, Bapak/Ibu *TIDAK PERLU mencairkan deposito* dan tidak kehilangan bunga berjalan.

Kami siap memfasilitasi *Kredit Agunan Deposito (KAD)*:
✅ Plafon pinjaman hingga 90% ({PLAFON_KAD})
✅ Proses persetujuan instan & bebas penalti
✅ Deposito tetap aktif & bunga tetap diterima utuh setiap bulan
✅ Suku bunga pinjaman sangat kompetitif (Special Rate)

Apakah Bapak/Ibu berkenan jika saya buatkan simulasi fasilitas KAD ini sekarang?

Salam hangat,
*{NAMA_RM}*
Bank Mandiri`,
  },
  {
    id: 'deposito_retensi',
    category: 'deposito_retensi',
    title: 'Perpanjangan Deposito (Special Rate & Bundling Program)',
    template: `Yth. Bapak/Ibu {NAMA_NASABAH},

Semoga Bapak/Ibu senantiasa dalam keadaan sehat dan sukses.

Saya {NAMA_RM}, Relationship Manager Anda di Bank Mandiri. Kami menginformasikan bahwa Deposito Anda sebesar *{NOMINAL_DEPOSITO}* akan jatuh tempo pada *{TANGGAL_JATUH_TEMPO}*.

Sebagai nasabah setia {TIER_NASABAH}, kami telah menyiapkan penawaran istimewa untuk perpanjangan (Roll Over) bilyet Anda:
✨ *Special Rate Deposito* di atas bunga konter reguler
✨ Program Cashback / Reward Bundling Loyalty
✨ Opsi Automatic Roll Over (ARO) tanpa repot datang ke cabang

Boleh kami bantu proses perpanjangan otomatisnya hari ini agar imbal hasil Bapak/Ibu tetap maksimal?

Terima kasih atas kepercayaan Bapak/Ibu kepada Bank Mandiri.

Salam hormat,
*{NAMA_RM}*`,
  },
  {
    id: 'investasi_cross',
    category: 'investasi_cross',
    title: 'Cross-Selling Investasi Prioritas (Obligasi SBN & Reksa Dana)',
    template: `Yth. Bapak/Ibu {NAMA_NASABAH},

Salam dari {NAMA_RM} - Priority Banking Bank Mandiri.

Menjelang jatuh tempo Deposito Anda sebesar *{NOMINAL_DEPOSITO}* pada *{TANGGAL_JATUH_TEMPO}*, kami ingin menawarkan peluang diversifikasi portofolio wealth management untuk mengoptimalkan yield:

📈 *Pilihan Diversifikasi AUM Prioritas:*
1. *Obligasi Negara / SBN Ritel:* Kupon tetap (Fixed Rate) lebih tinggi dari bunga deposito, pajak lebih rendah (hanya 10%), dijamin 100% oleh Negara.
2. *Reksa Dana Pasar Uang & Pendapatan Tetap:* Fleksibel, likuid, dan bebas pajak.

Apakah Bapak/Ibu ada waktu luang hari ini untuk berdiskusi singkat atau menerima lembar komparasi yield investasi dari kami?

Hormat kami,
*{NAMA_RM}*`,
  },
  {
    id: 'prioritas_lending',
    category: 'prioritas_lending',
    title: 'Cross-Selling Lending Prioritas (KSM / KKB / KPR)',
    template: `Yth. Bapak/Ibu {NAMA_NASABAH},

Perkenalkan saya {NAMA_RM} dari Bank Mandiri.

Terima kasih atas loyalitas Bapak/Ibu menempatkan dana Deposito *{NOMINAL_DEPOSITO}* di bank kami. Menjelang jatuh tempo pada *{TANGGAL_JATUH_TEMPO}*, Bapak/Ibu telah masuk dalam daftar nasabah prioritas pre-approved untuk fasilitas pembiayaan istimewa:

🏠 *Mandiri KPR / Top-up Properti* (Bunga Super Promo)
🚗 *Mandiri KKB Kendaraan Mewah* (DP Ringan & Proses Cepat)
💳 *Mandiri Kartu Kredit Prioritas & KSM Serbaguna*

Jika Bapak/Ibu memiliki rencana pembelian aset atau ekspansi usaha dalam waktu dekat, saya siap melayani prosesnya secara prioritas dan efisien.

Salam sukses,
*{NAMA_RM}*`,
  }
];

export function generateWhatsAppMessage(template: string, deposan: Deposan): string {
  return template
    .replace(/{NAMA_NASABAH}/g, deposan.name)
    .replace(/{NAMA_RM}/g, deposan.rmName || 'Relationship Manager')
    .replace(/{NOMINAL_DEPOSITO}/g, formatRupiah(deposan.depositoNominal))
    .replace(/{TANGGAL_JATUH_TEMPO}/g, deposan.jatuhTempoDate)
    .replace(/{SISA_HARI}/g, deposan.daysRemaining.toString())
    .replace(/{PLAFON_KAD}/g, formatRupiah(deposan.maxKADLimit))
    .replace(/{TIER_NASABAH}/g, deposan.tier);
}
