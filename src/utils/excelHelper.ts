import * as XLSX from 'xlsx';
import { Deposan } from '../types';
import { analyzeCashflowAndRecommend } from './cashflowEngine';

export function exportDeposansToExcel(deposans: Deposan[], filename: string = 'DAMS_Data_Nasabah_Deposito.xlsx') {
  const exportData = deposans.map((d, index) => ({
    'No': index + 1,
    'CIF': d.cif,
    'Nama Nasabah': d.name,
    'No. Telepon / WA': d.phone,
    'Tipe Nasabah': d.type,
    'Tier Nasabah': d.tier,
    'No Bilyet': d.bilyetNo,
    'Nominal Deposito (Rp)': d.depositoNominal,
    'Suku Bunga Deposito (%)': d.rateDeposito,
    'Tenor (Bulan)': d.tenorMonths,
    'Tanggal Jatuh Tempo': d.jatuhTempoDate,
    'Sisa Hari (DPD)': d.daysRemaining,
    'Saldo CASA Saat Ini (Rp)': d.casaBalanceCurrent,
    'Saldo CASA M-1 (Rp)': d.casaBalancePrevMonth,
    'Saldo CASA M-3 (Rp)': d.casaBalance3MonthsAgo,
    'Tren CASA (%)': `${d.casaTrendPercent}%`,
    'Status Cashflow Gap': d.cashflowGapStatus,
    'Rekomendasi DAMS': d.recommendedAction,
    'Plafon Maks KAD 90% (Rp)': d.maxKADLimit,
    'Status Retensi': d.status,
    'Nama RM': d.rmName,
    'Catatan RM': d.notes || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Deposan DAMS');
  XLSX.writeFile(workbook, filename);
}

export function downloadSampleExcelTemplate() {
  const sampleTemplate = [
    {
      'CIF': 'CIF-990123',
      'Nama Nasabah': 'PT. Surya Graha Mandiri',
      'No. Telepon / WA': '081298765432',
      'Tipe Nasabah': 'Badan Usaha',
      'Tier Nasabah': 'Korporasi',
      'No Bilyet': 'DEP-JKT-10029',
      'Nominal Deposito (Rp)': 3500000000,
      'Suku Bunga Deposito (%)': 4.5,
      'Tenor (Bulan)': 12,
      'Tanggal Jatuh Tempo': '2026-08-27',
      'Saldo CASA Saat Ini (Rp)': 120000000,
      'Saldo CASA M-1 (Rp)': 450000000,
      'Saldo CASA M-3 (Rp)': 800000000,
      'Nama RM': 'Anita Wijaya',
      'Catatan': 'Kontraktor properti butuh dana modal kerja cepat',
    },
    {
      'CIF': 'CIF-990124',
      'Nama Nasabah': 'Bambang Soediro',
      'No. Telepon / WA': '085711223344',
      'Tipe Nasabah': 'Perorangan',
      'Tier Nasabah': 'Prioritas Platinum',
      'No Bilyet': 'DEP-JKT-10030',
      'Nominal Deposito (Rp)': 1800000000,
      'Suku Bunga Deposito (%)': 4.25,
      'Tenor (Bulan)': 6,
      'Tanggal Jatuh Tempo': '2026-08-30',
      'Saldo CASA Saat Ini (Rp)': 650000000,
      'Saldo CASA M-1 (Rp)': 600000000,
      'Saldo CASA M-3 (Rp)': 550000000,
      'Nama RM': 'Dimas Prasetyo',
      'Catatan': 'Investor loyal, likuiditas berlebih',
    },
    {
      'CIF': 'CIF-990125',
      'Nama Nasabah': 'Ratna Kartika',
      'No. Telepon / WA': '081399887766',
      'Tipe Nasabah': 'Perorangan',
      'Tier Nasabah': 'Prioritas Gold',
      'No Bilyet': 'DEP-JKT-10031',
      'Nominal Deposito (Rp)': 750000000,
      'Suku Bunga Deposito (%)': 4.0,
      'Tenor (Bulan)': 3,
      'Tanggal Jatuh Tempo': '2026-09-05',
      'Saldo CASA Saat Ini (Rp)': 85000000,
      'Saldo CASA M-1 (Rp)': 90000000,
      'Saldo CASA M-3 (Rp)': 95000000,
      'Nama RM': 'Budi Santoso',
      'Catatan': 'Pemberitahuan jatuh tempo H-15',
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleTemplate);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Import DAMS');
  XLSX.writeFile(workbook, 'Template_Import_DAMS_Deposito.xlsx');
}

export function parseExcelFile(file: File): Promise<Deposan[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (!jsonData || jsonData.length === 0) {
          reject(new Error('File Excel kosong atau format tidak sesuai.'));
          return;
        }

        const parsedDeposans: Deposan[] = jsonData.map((row, idx) => {
          // Flexible column mapping
          const name = row['Nama Nasabah'] || row['Nama'] || row['Name'] || `Nasabah ${idx + 1}`;
          const cif = row['CIF'] || row['No CIF'] || `CIF-${Math.floor(100000 + Math.random() * 900000)}`;
          const phone = String(row['No. Telepon / WA'] || row['Telepon'] || row['Phone'] || row['No HP'] || '08123456789');
          const type = (row['Tipe Nasabah'] || row['Tipe'] || (name.startsWith('PT') || name.startsWith('CV') ? 'Badan Usaha' : 'Perorangan')) as 'Perorangan' | 'Badan Usaha';
          const tier = (row['Tier Nasabah'] || row['Tier'] || (type === 'Badan Usaha' ? 'Korporasi' : 'Prioritas Gold')) as any;
          const bilyetNo = row['No Bilyet'] || row['Bilyet'] || `DEP-${Math.floor(10000 + Math.random() * 90000)}`;
          
          const depositoNominal = Number(row['Nominal Deposito (Rp)'] || row['Nominal Deposito'] || row['Nominal'] || row['Saldo Deposito'] || 1000000000);
          const rateDeposito = Number(row['Suku Bunga Deposito (%)'] || row['Bunga (%)'] || row['Rate'] || 4.25);
          const tenorMonths = Number(row['Tenor (Bulan)'] || row['Tenor'] || 1);
          
          let jatuhTempoDate = row['Tanggal Jatuh Tempo'] || row['Jatuh Tempo'] || '2026-09-01';
          if (typeof jatuhTempoDate === 'number') {
            // Excel serial date conversion
            const dateObj = new Date(Math.round((jatuhTempoDate - 25569) * 86400 * 1000));
            jatuhTempoDate = dateObj.toISOString().split('T')[0];
          }

          // Calculate days remaining
          const today = new Date('2026-08-20');
          const due = new Date(jatuhTempoDate);
          const diffTime = due.getTime() - today.getTime();
          const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

          const casaBalanceCurrent = Number(row['Saldo CASA Saat Ini (Rp)'] || row['Saldo CASA'] || row['CASA Now'] || depositoNominal * 0.1);
          const casaBalancePrevMonth = Number(row['Saldo CASA M-1 (Rp)'] || row['CASA M-1'] || casaBalanceCurrent * 1.5);
          const casaBalance3MonthsAgo = Number(row['Saldo CASA M-3 (Rp)'] || row['CASA M-3'] || casaBalanceCurrent * 2);

          const rmName = row['Nama RM'] || row['RM'] || 'Relationship Manager';
          const notes = row['Catatan'] || row['Notes'] || '';

          const analysis = analyzeCashflowAndRecommend(
            depositoNominal,
            casaBalanceCurrent,
            casaBalancePrevMonth,
            casaBalance3MonthsAgo,
            tier
          );

          return {
            id: `imp-${Date.now()}-${idx}`,
            cif,
            name,
            phone,
            type,
            tier,
            bilyetNo,
            depositoNominal,
            rateDeposito,
            tenorMonths,
            jatuhTempoDate,
            daysRemaining,
            casaBalanceCurrent,
            casaBalancePrevMonth,
            casaBalance3MonthsAgo,
            status: 'pending',
            rmName,
            rmPhone: '081234567890',
            notes,
            ...analysis,
          };
        });

        resolve(parsedDeposans);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file'));
    };

    reader.readAsArrayBuffer(file);
  });
}
