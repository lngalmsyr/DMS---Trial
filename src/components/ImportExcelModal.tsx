import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  Download, 
  Check, 
  AlertCircle, 
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Deposan } from '../types';
import { parseExcelFile, downloadSampleExcelTemplate } from '../utils/excelHelper';
import { formatRupiahShort } from '../utils/cashflowEngine';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (newDeposans: Deposan[]) => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Deposan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await parseExcelFile(selectedFile);
      setParsedData(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal membaca format file Excel. Pastikan file berisi tabel kolom yang benar.');
      setParsedData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleApplyImport = () => {
    if (parsedData.length > 0) {
      onImportSuccess(parsedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold">Import Data Deposan (Excel / CSV)</h3>
              <p className="text-xs text-emerald-100">
                Unggah data portofolio deposito cabang & jalankan sistem rekomendasi DAMS
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* Template Download Banner */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-900">Belum punya format Excel DAMS?</p>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Unduh template standar berisi kolom Deposito, CASA 3 Bulan, CIF, dan Nomor Telepon.
                </p>
              </div>
            </div>
            <button
              onClick={downloadSampleExcelTemplate}
              className="px-3 py-1.5 rounded-lg bg-white border border-blue-300 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Template Excel</span>
            </button>
          </div>

          {/* Upload Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">
                {file ? file.name : 'Tarik & Letakkan file Excel di sini, atau klik untuk memilih file'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Mendukung format .XLSX, .XLS, atau .CSV</p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="text-center py-6 text-xs text-slate-500">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              Memproses & menganalisis Cashflow Gap data nasabah...
            </div>
          )}

          {/* Preview Table of Parsed Data */}
          {parsedData.length > 0 && !isLoading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-slate-800">
                    Berhasil Membaca {parsedData.length} Nasabah Deposan
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">Rekomendasi KAD terpasang otomatis</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="min-w-full text-[11px] divide-y divide-slate-200">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left font-bold text-slate-600">Nama Nasabah</th>
                      <th className="px-3 py-2 text-left font-bold text-slate-600">Deposito</th>
                      <th className="px-3 py-2 text-left font-bold text-slate-600">Jatuh Tempo</th>
                      <th className="px-3 py-2 text-left font-bold text-slate-600">Tren CASA</th>
                      <th className="px-3 py-2 text-left font-bold text-slate-600">Rekomendasi DAMS</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {parsedData.slice(0, 5).map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-medium text-slate-900">{d.name}</td>
                        <td className="px-3 py-2 font-semibold text-slate-800">{formatRupiahShort(d.depositoNominal)}</td>
                        <td className="px-3 py-2 text-slate-600">{d.jatuhTempoDate}</td>
                        <td className="px-3 py-2">
                          <span className={`font-bold ${d.casaTrendPercent < -20 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {d.casaTrendPercent}%
                          </span>
                        </td>
                        <td className="px-3 py-2 text-blue-700 font-semibold truncate max-w-[160px]">{d.recommendedAction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          
          <button
            onClick={handleApplyImport}
            disabled={parsedData.length === 0}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              parsedData.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Terapkan {parsedData.length > 0 ? `(${parsedData.length} Nasabah)` : ''} ke Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
