import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Plus, Trash2, DollarSign, PieChart, TrendingUp } from 'lucide-react';
import { TransactionItem } from '../../types';
import { INITIAL_TRANSACTIONS } from '../../data/templates';

export const FinanceDemo: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Operasional');

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!desc.trim() || isNaN(numAmount) || numAmount <= 0) return;

    const newTx: TransactionItem = {
      id: Date.now().toString(),
      description: desc.trim(),
      amount: numAmount,
      type,
      category,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions([newTx, ...transactions]);
    setDesc('');
    setAmount('');
  };

  const deleteTx = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Pencatatan Keuangan & Arus Kas</h3>
          <p className="text-sm text-slate-500">Monitor pemasukan, pengeluaran, dan saldo riil secara terstruktur</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Total Saldo Bersih</span>
          <p className={`text-xl font-bold mt-1 ${balance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
            {formatRupiah(balance)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800">Total Pemasukan</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-emerald-700 mt-1">{formatRupiah(totalIncome)}</p>
        </div>
        <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800">Total Pengeluaran</span>
            <ArrowDownRight className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-bold text-rose-700 mt-1">{formatRupiah(totalExpense)}</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={addTransaction} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="sm:col-span-5">
          <input
            type="text"
            placeholder="Keterangan transaksi..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="sm:col-span-3">
          <input
            type="number"
            placeholder="Nominal (Rp)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="sm:col-span-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="expense">Pengeluaran</option>
            <option value="income">Pemasukan</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full h-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Simpan</span>
          </button>
        </div>
      </form>

      {/* Transaction List */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Riwayat Transaksi</h4>
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tx.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{tx.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{tx.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'income' ? '+' : '-'} {formatRupiah(tx.amount)}
                </span>
                <button
                  onClick={() => deleteTx(tx.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
