import React, { useState } from 'react';
import { 
  Sparkles, 
  Database, 
  ShieldCheck, 
  Bot, 
  BarChart3, 
  FileDown, 
  Moon, 
  Smartphone, 
  Copy, 
  Check, 
  Send,
  CheckCircle2,
  HelpCircle,
  Laptop
} from 'lucide-react';

export const IdeaGenerator: React.FC<{ onSelectTemplate: (templateId: string) => void }> = ({ onSelectTemplate }) => {
  const [appType, setAppType] = useState('Produktivitas & Tugas');
  const [targetAudience, setTargetAudience] = useState('Pribadi & Profesional');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Antarmuka Responsif (Mobile & Desktop)',
    'Penyimpanan Data Lokal / Cloud',
    'Filter & Pencarian Pintar'
  ]);
  const [customGoal, setCustomGoal] = useState('');
  const [copied, setCopied] = useState(false);

  const appTypes = [
    { label: 'Produktivitas & Tugas', desc: 'Kanban, to-do list, time tracker, kalender kerja' },
    { label: 'Pencatatan Finansial & Kas', desc: 'Laporan pemasukan/pengeluaran, budget tracker, invoice' },
    { label: 'Katalog & Toko Online (E-Commerce)', desc: 'Etalase produk, keranjang, order WhatsApp, stok' },
    { label: 'AI Assistant & Generator', desc: 'Chatbot pintar, auto writer, pembuat gambar & ringkasan' },
    { label: 'Edukasi & Quiz Pembelajaran', desc: 'Kuis interaktif, flashcard, progress belajar siswa' },
    { label: 'Sistem Reservasi & Booking', desc: 'Jadwal janji temu, konsultasi, booking lapangan/layanan' },
  ];

  const availableFeatures = [
    { id: 'responsive', label: 'Antarmuka Responsif (Mobile & Desktop)', icon: Smartphone },
    { id: 'storage', label: 'Penyimpanan Data Lokal / Cloud', icon: Database },
    { id: 'auth', label: 'Sistem Autentikasi / Login Pengguna', icon: ShieldCheck },
    { id: 'ai', label: 'Integrasi AI (Gemini / Smart Tools)', icon: Bot },
    { id: 'charts', label: 'Grafik & Analitik Visual (Charts)', icon: BarChart3 },
    { id: 'export', label: 'Ekspor Data (PDF / Excel / CSV)', icon: FileDown },
    { id: 'darkmode', label: 'Mode Gelap (Dark Mode)', icon: Moon },
  ];

  const toggleFeature = (label: string) => {
    if (selectedFeatures.includes(label)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== label));
    } else {
      setSelectedFeatures([...selectedFeatures, label]);
    }
  };

  const generatedPrompt = `Halo! Tolong bangun aplikasi web "${appType}" untuk keperluan "${targetAudience}".
${customGoal ? `Tujuan khusus: ${customGoal}\n` : ''}Fitur utama yang dibutuhkan:
${selectedFeatures.map(f => `- ${f}`).join('\n')}

Mohon buatkan aplikasi dengan antarmuka yang bersih, modern, dan fungsional penuh!`;

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-7 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Perancang Spesifikasi Aplikasi</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Rancang Konsep Web App Impianmu</h2>
          <p className="text-sm text-slate-500 mt-1">
            Pilih jenis aplikasi, target pengguna, dan kumpulan fitur yang ingin kamu miliki. Kami siap mengimplementasikannya!
          </p>
        </div>

        {/* 1. Kategori Aplikasi */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
            1. Pilih Jenis Aplikasi
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {appTypes.map((type) => (
              <button
                key={type.label}
                onClick={() => setAppType(type.label)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  appType === type.label
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${appType === type.label ? 'text-blue-900' : 'text-slate-900'}`}>
                    {type.label}
                  </span>
                  {appType === type.label && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{type.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Fitur yang Diinginkan */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
            2. Fitur & Modul Utama
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {availableFeatures.map((feat) => {
              const Icon = feat.icon;
              const isSelected = selectedFeatures.includes(feat.label);
              return (
                <button
                  key={feat.id}
                  onClick={() => toggleFeature(feat.label)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-300 text-blue-950 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold flex-1">{feat.label}</span>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Catatan Tambahan */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
            3. Ide atau Kebutuhan Khusus (Opsional)
          </label>
          <input
            type="text"
            placeholder="Contoh: Menggunakan warna tema emerald, ada tombol print struk, bisa ekspor PDF..."
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Generated Specification Prompt Box */}
        <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50/80 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700">Rangkuman Kebutuhan Siap Kirim</span>
            <button
              onClick={copyPrompt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin ke Clipboard' : 'Salin Instruksi'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono text-slate-800 bg-white p-3.5 rounded-lg border border-slate-200 whitespace-pre-wrap leading-relaxed">
            {generatedPrompt}
          </pre>
          <p className="text-[11px] text-slate-500 mt-2">
            💡 Kamu bisa langsung menyalin teks di atas atau mengetikkan ide spesifikmu di kolom chat untuk langsung dibuatkan!
          </p>
        </div>
      </div>
    </div>
  );
};
