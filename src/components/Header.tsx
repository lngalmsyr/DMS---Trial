import React from 'react';
import { Layers, Sparkles, Code2, Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Web App Studio</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Siap Dikembangkan
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Pilih template, rancang fitur, atau beritahu aplikasi yang ingin kamu buat</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="tab-templates"
            onClick={() => setActiveTab('templates')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'templates'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Contoh Aplikasi</span>
            </span>
          </button>

          <button
            id="tab-builder"
            onClick={() => setActiveTab('builder')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'builder'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Code2 className="w-4 h-4" />
              <span>Perancang Ide</span>
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
