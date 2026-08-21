import { AppTemplate, TaskItem, TransactionItem, ProductItem, NoteItem } from '../types';

export const APP_TEMPLATES: AppTemplate[] = [
  {
    id: 'task-manager',
    title: 'Manajemen Tugas & Proyek',
    category: 'Produktivitas',
    description: 'Aplikasi pelacak tugas harian, kanban board, prioritas kerja, dan pengingat deadline terorganisir.',
    iconName: 'CheckSquare',
    badge: 'Populer',
    features: ['Filter Prioritas', 'Kategori Pekerjaan', 'Progress Tracker', 'Penyimpanan Lokal'],
    samplePrompt: 'Buatkan aplikasi manajemen tugas dan proyek dengan kanban board, filter prioritas (Tinggi/Sedang/Rendah), tanggal jatuh tempo, dan statistik progres.',
    demoComponentKey: 'tasks',
  },
  {
    id: 'finance-tracker',
    title: 'Pencatat Keuangan & Arus Kas',
    category: 'Finansial',
    description: 'Aplikasi pembukuan pemasukan dan pengeluaran harian atau UMKM dengan visualisasi ringkasan saldo.',
    iconName: 'Wallet',
    badge: 'Bisnis & Pribadi',
    features: ['Ringkasan Saldo', 'Kategori Pengeluaran', 'Riwayat Transaksi', 'Grafik Arus Kas'],
    samplePrompt: 'Buatkan aplikasi pencatatan keuangan pribadi dan bisnis dengan filter pemasukan/pengeluaran, kategori, ringkasan saldo total, dan ekspor data.',
    demoComponentKey: 'finance',
  },
  {
    id: 'product-catalog',
    title: 'Katalog Produk & Toko Online',
    category: 'Bisnis & UMKM',
    description: 'Aplikasi etalase produk, inventaris stok, keranjang belanja, dan simulasi checkout pesanan WhatsApp.',
    iconName: 'ShoppingBag',
    badge: 'E-Commerce',
    features: ['Pencarian Produk', 'Manajemen Stok', 'Kalkulator Harga', 'Integrasi WhatsApp Order'],
    samplePrompt: 'Buatkan aplikasi katalog produk toko online dengan pencarian, filter kategori barang, keranjang belanja, dan tombol order otomatis ke WhatsApp.',
    demoComponentKey: 'catalog',
  },
  {
    id: 'smart-notes',
    title: 'Catatan Pintar & Jurnal Ide',
    category: 'AI & Tools',
    description: 'Aplikasi editor catatan fleksibel dengan tag pencarian, format markdown, dan bantuan asisten AI.',
    iconName: 'FileText',
    badge: 'Kreatif',
    features: ['Pencarian Cepat', 'Pengelompokan Tag', 'Editor Bersih', 'Fitur Ringkasan AI'],
    samplePrompt: 'Buatkan aplikasi catatan pintar dan dokumentasi ide dengan tag pencarian, pengelompokan folder, dan fitur ringkasan otomatis.',
    demoComponentKey: 'notes',
  },
];

export const INITIAL_TASKS: TaskItem[] = [
  { id: '1', title: 'Menyiapkan konsep desain antarmuka web', category: 'Desain', priority: 'Tinggi', completed: true, dueDate: 'Hari ini' },
  { id: '2', title: 'Menyusun struktur data & state management', category: 'Dev', priority: 'Tinggi', completed: false, dueDate: 'Besok' },
  { id: '3', title: 'Integrasi fitur interaktif dan animasi', category: 'Fitur', priority: 'Sedang', completed: false, dueDate: '3 Hari' },
  { id: '4', title: 'Uji coba responsivitas mobile & desktop', category: 'QA', priority: 'Rendah', completed: false, dueDate: 'Minggu ini' },
];

export const INITIAL_TRANSACTIONS: TransactionItem[] = [
  { id: '1', description: 'Gaji Bulanan / Pendapatan Proyek', amount: 8500000, type: 'income', category: 'Pendapatan', date: '2026-08-18' },
  { id: '2', description: 'Langganan Hosting & Domain Cloud', amount: 250000, type: 'expense', category: 'Operasional', date: '2026-08-19' },
  { id: '3', description: 'Belanja Kebutuhan & Konsumsi', amount: 480000, type: 'expense', category: 'Kebutuhan', date: '2026-08-20' },
  { id: '4', description: 'Pembayaran Jasa Desain Web', amount: 1500000, type: 'income', category: 'Freelance', date: '2026-08-20' },
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  { id: '1', name: 'Kopi Arabika Single Origin 250g', category: 'Minuman', price: 75000, stock: 24, status: 'Tersedia' },
  { id: '2', name: 'Tumbler Stainless Termal 500ml', category: 'Aksesoris', price: 120000, stock: 15, status: 'Tersedia' },
  { id: '3', name: 'Kaos Polos Cotton Combed 30s', category: 'Pakaian', price: 85000, stock: 40, status: 'Tersedia' },
  { id: '4', name: 'Tas Ransel Laptop Canvas Premium', category: 'Fashion', price: 285000, stock: 0, status: 'Habis' },
];

export const INITIAL_NOTES: NoteItem[] = [
  { id: '1', title: 'Ide Fitur Web App Baru', content: '1. Sistem autentikasi pengguna yang aman.\n2. Dashboard statistik dengan grafik interaktif.\n3. Mode gelap dan tema kustom.', tags: ['Ide', 'Proyek'], updatedAt: '10 menit lalu' },
  { id: '2', title: 'Panduan Praktis UI/UX Modern', content: 'Gunakan kontras warna yang nyaman, tipografi yang jelas, spasi bernapas, dan navigasi yang intuitif.', tags: ['Desain', 'Tips'], updatedAt: '1 jam lalu' },
];
