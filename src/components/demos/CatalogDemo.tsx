import React, { useState } from 'react';
import { ShoppingBag, Search, Plus, Check, ExternalLink, MessageCircle } from 'lucide-react';
import { ProductItem } from '../../types';
import { INITIAL_PRODUCTS } from '../../data/templates';

export const CatalogDemo: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  const categories = ['Semua', 'Minuman', 'Aksesoris', 'Pakaian', 'Fashion'];

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'Semua' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const addToCart = (id: string) => {
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const cartTotalCount = Object.keys(cart).reduce((total, id) => total + (cart[id] || 0), 0);
  const cartTotalPrice = Object.keys(cart).reduce((sum, id) => {
    const prod = products.find(p => p.id === id);
    const qty = cart[id] || 0;
    return sum + (prod ? prod.price * qty : 0);
  }, 0);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Katalog Produk & Toko Online</h3>
          <p className="text-sm text-slate-500">Etalase barang, status ketersediaan, dan simulasi keranjang belanja</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-blue-800 text-xs font-semibold">
          <ShoppingBag className="w-4 h-4 text-blue-600" />
          <span>{cartTotalCount} Item di Keranjang ({formatRupiah(cartTotalPrice)})</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari produk atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {product.category}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    product.status === 'Tersedia'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {product.status} (Stok: {product.stock})
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{product.name}</h4>
              <p className="text-base font-extrabold text-blue-600 mt-2">{formatRupiah(product.price)}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {cart[product.id] ? `Ditambahkan: ${cart[product.id]}x` : 'Belum di keranjang'}
              </span>
              <button
                onClick={() => addToCart(product.id)}
                disabled={product.stock === 0}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  product.stock > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Beli</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
