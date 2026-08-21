import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  MessageCircle, 
  Sparkles, 
  CreditCard, 
  ShieldAlert, 
  ExternalLink,
  Award,
  Zap
} from 'lucide-react';
import { Deposan, WhatsAppTemplate } from '../types';
import { WA_TEMPLATES, generateWhatsAppMessage } from '../data/waTemplates';
import { formatRupiah } from '../utils/cashflowEngine';

interface WhatsAppModalProps {
  deposan: Deposan | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: Deposan['status'], note?: string) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  deposan,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('kad_offer');
  const [messageContent, setMessageContent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (deposan) {
      // Auto select appropriate template based on recommended action
      if (deposan.recommendedAction.includes('KAD')) {
        setSelectedTemplateId('kad_offer');
      } else if (deposan.recommendedAction.includes('Perpanjangan')) {
        setSelectedTemplateId('deposito_retensi');
      } else if (deposan.recommendedAction.includes('Investasi')) {
        setSelectedTemplateId('investasi_cross');
      } else {
        setSelectedTemplateId('prioritas_lending');
      }
    }
  }, [deposan]);

  useEffect(() => {
    if (deposan) {
      const currentTemplate = WA_TEMPLATES.find(t => t.id === selectedTemplateId) || WA_TEMPLATES[0];
      const generated = generateWhatsAppMessage(currentTemplate.template, deposan);
      setMessageContent(generated);
    }
  }, [selectedTemplateId, deposan]);

  if (!isOpen || !deposan) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    // Format phone to international (remove leading 0 or +)
    let cleanPhone = deposan.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('62')) {
      cleanPhone = '62' + cleanPhone;
    }

    const encodedText = encodeURIComponent(messageContent);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    window.open(waUrl, '_blank');

    // Automatically update status to 'dihubungi'
    onUpdateStatus(deposan.id, 'dihubungi', `Menghubungi via WhatsApp (${selectedTemplateId})`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Otomasi WhatsApp Retention & KAD</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 text-[10px] font-bold">
                  RM Proactive
                </span>
              </div>
              <p className="text-xs text-emerald-100/80">
                Nasabah: <strong className="text-white">{deposan.name}</strong> • {deposan.phone}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          {/* Quick Context Summary */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-slate-500">Nominal Deposito:</span>
              <p className="font-bold text-slate-900 text-sm">{formatRupiah(deposan.depositoNominal)}</p>
            </div>
            <div>
              <span className="text-slate-500">Jatuh Tempo:</span>
              <p className="font-bold text-rose-600 text-sm">{deposan.jatuhTempoDate} ({deposan.daysRemaining} Hari)</p>
            </div>
            <div>
              <span className="text-slate-500">Kebutuhan Gap CASA:</span>
              <p className="font-bold text-amber-600 text-sm">{deposan.casaTrendPercent}% (Trend 3 Bln)</p>
            </div>
            <div>
              <span className="text-slate-500">Plafon KAD Maksimal (90%):</span>
              <p className="font-bold text-emerald-600 text-sm">{formatRupiah(deposan.maxKADLimit)}</p>
            </div>
          </div>

          {/* Template Selection Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Pilih Pendekatan Pesan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {WA_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${
                    selectedTemplateId === tpl.id
                      ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600 text-slate-900 font-bold shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600 font-medium'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                    selectedTemplateId === tpl.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tpl.id === 'kad_offer' ? <Zap className="w-3.5 h-3.5" /> :
                     tpl.id === 'deposito_retensi' ? <Award className="w-3.5 h-3.5" /> :
                     <Sparkles className="w-3.5 h-3.5" />}
                  </div>
                  <span className="leading-snug">{tpl.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Editable WhatsApp Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pratinjau Pesan WhatsApp:
              </label>
              <button
                onClick={handleCopy}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Pesan'}</span>
              </button>
            </div>
            
            <div className="bg-[#e5ddd5] p-3.5 rounded-xl border border-slate-300 shadow-inner">
              <div className="bg-white p-3.5 rounded-xl rounded-tl-none shadow-xs text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto border border-slate-200">
                {messageContent}
              </div>
            </div>
          </div>

          {/* Status Quick Update Section */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Ubah Status Retensi Langsung:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  onUpdateStatus(deposan.id, 'dihubungi', 'Sudah dikirim pesan WhatsApp');
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-800 text-xs font-bold border border-yellow-300 transition-colors"
              >
                ✓ Sudah Dihubungi
              </button>

              <button
                onClick={() => {
                  onUpdateStatus(deposan.id, 'deal_kad', 'Nasabah menyetujui fasilitas KAD');
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold border border-blue-300 transition-colors"
              >
                🎉 Deal KAD (Kredit Masuk)
              </button>

              <button
                onClick={() => {
                  onUpdateStatus(deposan.id, 'deal_perpanjang', 'Nasabah memperpanjang ARO deposito');
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 transition-colors"
              >
                ✓ Deal Perpanjang Deposito
              </button>
            </div>
          </div>
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
            onClick={handleOpenWhatsApp}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Kirim via WhatsApp Web</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
};
