import React, { useState } from 'react';
import {
  Camera,
  Clock,
  MapPin,
  User,
  HardHat,
  Package,
  CheckCircle2,
  CircleDot,
  Circle,
  AlertTriangle,
  Wrench,
  Search,
  BarChart3,
  ShoppingCart,
  Users,
  Wallet,
  Building2,
  Shield,
  Bell,
  CloudUpload,
  KeyRound,
  Info,
  ChevronRight,
  Video,
  Server,
  HardDrive,
  Cpu,
  Cable,
} from 'lucide-react';
import { ScreenProps, ScreenHeader } from './MobileScreensPart1';

// ================= 11. ATTENDANCE (GPS + PHOTO) =================
export const Screen11Attendance: React.FC<ScreenProps> = ({
  onSelectScreen,
  onShowToast,
}) => {
  const [checkedInTime, setCheckedInTime] = useState('15 May 2025  10:24 AM');

  return (
    <div className="flex-1 bg-white flex flex-col justify-between">
      <ScreenHeader title="Attendance" onBack={() => onSelectScreen(4)} />

      <div className="p-3 space-y-3 flex-1">
        <button
          onClick={() => {
            setCheckedInTime('Just Now • GPS Verified');
            onShowToast('Staff Check-In Recorded with Live Selfie & GPS!');
          }}
          className="w-full py-2.5 rounded-xl bg-[#0D9464] hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Camera className="w-3.5 h-3.5" /> Check In
        </button>

        <div className="space-y-1.5 text-[11px] text-slate-700 px-1">
          <div className="flex items-center gap-2 font-semibold">
            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{checkedInTime}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <div className="font-bold text-slate-800">Sector 62, Noida</div>
              <div className="text-[10px] font-mono text-slate-500">28.6139, 77.3793</div>
            </div>
          </div>
        </div>

        {/* Selfie + Map Side-by-Side Card */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Technician Selfie Box */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square relative flex flex-col items-center justify-end p-2">
            <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0">
              <rect width="100" height="100" fill="#DBEAFE" />
              <circle cx="50" cy="38" r="18" fill="#B45309" />
              <circle cx="50" cy="36" r="16" fill="#FBBF24" />
              {/* Hair & Beard */}
              <path d="M34 32 Q50 16 66 32" fill="#1E293B" />
              <circle cx="44" cy="36" r="2" fill="#0F172A" />
              <circle cx="56" cy="36" r="2" fill="#0F172A" />
              <path d="M43 44 Q50 49 57 44" stroke="#0F172A" strokeWidth="2" fill="none" />
              {/* Blue Field Polo Shirt */}
              <path d="M22 96 Q50 64 78 96 Z" fill="#1368CE" />
            </svg>
            <span className="relative z-10 px-2 py-0.5 rounded bg-slate-900/70 text-white text-[9px] font-bold">
              Selfie
            </span>
          </div>

          {/* GPS Map Pin Box */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-[#EBF3FA] aspect-square relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0">
              <rect width="100" height="100" fill="#E2E8F0" />
              <path d="M0 25 L100 45 M20 0 L40 100 M0 75 L100 60 M75 0 L65 100" stroke="#FFFFFF" strokeWidth="5" />
              <path d="M0 50 L100 50" stroke="#FCD34D" strokeWidth="4" />
              <rect x="12" y="12" width="24" height="18" rx="3" fill="#BBF7D0" />
              <rect x="65" y="65" width="25" height="20" rx="3" fill="#BAE6FD" />
            </svg>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-rose-500/20 flex items-center justify-center animate-pulse">
                <MapPin className="w-5 h-5 text-rose-600 fill-rose-500" />
              </div>
              <span className="text-[8px] font-bold bg-white/90 px-1.5 py-0.5 rounded shadow-2xs text-slate-800 mt-0.5">
                Noida Sec-62
              </span>
            </div>
          </div>
        </div>
        <div className="text-center text-[10px] font-semibold text-slate-500">Selfie</div>
      </div>

      <div className="p-3">
        <button
          onClick={() => onShowToast('Staff Checked Out with Location & Timestamp!')}
          className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1368CE] border border-blue-200 font-bold text-xs"
        >
          Check Out
        </button>
      </div>
    </div>
  );
};

// ================= 12. INSTALLATION JOB =================
export const Screen12InstallationJob: React.FC<ScreenProps> = ({
  onSelectScreen,
  items,
  onOpenJobModal,
}) => (
  <div className="flex-1 bg-white flex flex-col justify-between">
    <ScreenHeader title="Installation Job" onBack={() => onSelectScreen(4)} />

    <div className="p-3 space-y-2.5 text-[11px] flex-1">
      <div className="space-y-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-start gap-2">
          <User className="w-3.5 h-3.5 text-[#1368CE] mt-0.5 shrink-0" />
          <div className="leading-tight">
            <div className="text-[9px] text-slate-400">Customer</div>
            <div className="font-bold text-slate-900">Sharma Traders</div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#1368CE] mt-0.5 shrink-0" />
          <div className="leading-tight">
            <div className="text-[9px] text-slate-400">Address</div>
            <div className="font-bold text-slate-800">Sector 62, Noida</div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <HardHat className="w-3.5 h-3.5 text-[#1368CE] mt-0.5 shrink-0" />
          <div className="leading-tight">
            <div className="text-[9px] text-slate-400">Assigned Staff</div>
            <div className="font-bold text-slate-800">Ravi Kumar</div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Package className="w-3.5 h-3.5 text-[#1368CE] mt-0.5 shrink-0" />
          <div className="leading-tight">
            <div className="text-[9px] text-slate-400">Items</div>
            <div className="font-bold text-slate-800">8 Cameras + DVR + HDD</div>
          </div>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="space-y-2.5 pl-1 pt-1">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <div className="font-bold text-slate-800">Job Assigned</div>
            <div className="text-[9px] font-mono text-slate-400">15-05-2025 09:00 AM</div>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <div className="font-bold text-slate-800">On Site</div>
            <div className="text-[9px] font-mono text-slate-400">15-05-2025 10:30 AM</div>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <CircleDot className="w-4 h-4 text-[#1368CE] shrink-0 mt-0.5" />
          <div className="leading-tight">
            <div className="font-bold text-[#1368CE]">Installation In Progress</div>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Circle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <div className="font-semibold text-slate-400">Completed</div>
          </div>
        </div>
      </div>
    </div>

    <div className="p-3">
      <button
        onClick={() => {
          const inst = items.find((i) => i.category === 'installation') || items[0];
          onOpenJobModal(inst);
        }}
        className="w-full py-2 rounded-xl bg-[#1368CE] text-white font-bold text-xs shadow-sm"
      >
        Complete Installation & Sign
      </button>
    </div>
  </div>
);

// ================= 13. SERVICE CALL =================
export const Screen13ServiceCall: React.FC<ScreenProps> = ({ onSelectScreen }) => (
  <div className="flex-1 bg-white flex flex-col justify-between">
    <ScreenHeader title="Service Call" onBack={() => onSelectScreen(4)} />

    <div className="p-3.5 space-y-3 text-[11px] flex-1">
      <div className="flex items-start gap-2.5 border-b border-slate-100 pb-2">
        <User className="w-4 h-4 text-[#1368CE] mt-0.5 shrink-0" />
        <div>
          <div className="text-[9px] text-slate-400">Customer</div>
          <div className="font-bold text-slate-900 text-xs">Agarwal Enterprises</div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 border-b border-slate-100 pb-2">
        <Wrench className="w-4 h-4 text-[#1368CE] mt-0.5 shrink-0" />
        <div>
          <div className="text-[9px] text-slate-400">Problem</div>
          <div className="font-bold text-slate-900 text-xs">Camera not working</div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 border-b border-slate-100 pb-2">
        <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
        <div>
          <div className="text-[9px] text-slate-400 mb-0.5">Priority</div>
          <span className="px-2.5 py-0.5 rounded-md bg-rose-500 text-white font-bold text-[10px]">
            High
          </span>
        </div>
      </div>

      <div className="flex items-start gap-2.5 border-b border-slate-100 pb-2">
        <HardHat className="w-4 h-4 text-[#1368CE] mt-0.5 shrink-0" />
        <div>
          <div className="text-[9px] text-slate-400">Assigned To</div>
          <div className="font-bold text-slate-900 text-xs">Sandeep Singh</div>
        </div>
      </div>

      <div className="flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-[#1368CE] mt-0.5 shrink-0" />
        <div>
          <div className="text-[9px] text-slate-400 mb-0.5">Status</div>
          <span className="px-2.5 py-0.5 rounded-md bg-[#1368CE] text-white font-bold text-[10px]">
            Assigned
          </span>
        </div>
      </div>
    </div>

    <div className="p-3">
      <button
        onClick={() => onSelectScreen(14)}
        className="w-full py-2.5 rounded-xl bg-[#1368CE] text-white font-bold text-xs shadow-sm"
      >
        Update Status
      </button>
    </div>
  </div>
);

// ================= 14. JOB DETAILS (SERVICE) =================
export const Screen14JobDetails: React.FC<ScreenProps> = ({
  onSelectScreen,
  items,
  onOpenJobModal,
  onShowToast,
}) => (
  <div className="flex-1 bg-white flex flex-col justify-between">
    <ScreenHeader title="Job Details" onBack={() => onSelectScreen(13)} />

    <div className="p-3 space-y-2.5 text-[11px] flex-1">
      {/* Before / After Header */}
      <div className="grid grid-cols-2 text-center text-[10px] font-bold text-slate-700 border-b border-slate-200 pb-1">
        <span className="text-[#1368CE] border-b-2 border-[#1368CE] pb-1">Before</span>
        <span>After</span>
      </div>

      {/* Side-by-Side CCTV Before & After Photos */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-slate-200 p-2 aspect-[4/3] flex flex-col items-center justify-center border border-slate-300 relative overflow-hidden">
          <svg viewBox="0 0 120 80" className="w-full h-full">
            <rect width="120" height="80" fill="#CBD5E1" />
            <rect x="25" y="24" width="65" height="28" rx="8" fill="#F8FAFC" stroke="#475569" strokeWidth="2" />
            <circle cx="32" cy="38" r="9" fill="#0F172A" />
            <path d="M90 38 L110 52" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="3 2" />
          </svg>
          <span className="text-[8px] font-bold text-rose-700 bg-white/90 px-1.5 rounded">
            Cable Cut
          </span>
        </div>

        <div className="rounded-xl bg-slate-200 p-2 aspect-[4/3] flex flex-col items-center justify-center border border-emerald-300 relative overflow-hidden">
          <svg viewBox="0 0 120 80" className="w-full h-full">
            <rect width="120" height="80" fill="#DCFCE7" />
            <rect x="25" y="24" width="65" height="28" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
            <circle cx="32" cy="38" r="9" fill="#0284C7" />
            <path d="M90 38 L112 38" stroke="#16A34A" strokeWidth="3" />
          </svg>
          <span className="text-[8px] font-bold text-emerald-700 bg-white/90 px-1.5 rounded">
            Fixed & Online
          </span>
        </div>
      </div>

      <div className="border-b border-slate-100 pb-1.5">
        <div className="text-[9px] text-slate-400">Parts Used</div>
        <div className="font-bold text-slate-800">Camera (1), Cable (10m)</div>
      </div>

      <div className="border-b border-slate-100 pb-1.5">
        <div className="text-[9px] text-slate-400">Remarks</div>
        <div className="font-bold text-slate-800">Camera replaced and working fine.</div>
      </div>

      <div>
        <div className="text-[9px] text-slate-400 mb-1">Customer Signature</div>
        <div
          onClick={() => {
            const srv = items.find((i) => i.category === 'service') || items[0];
            onOpenJobModal(srv);
          }}
          className="h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer"
        >
          <svg viewBox="0 0 180 45" className="w-36 h-9">
            <path
              d="M20 32 C35 10, 50 38, 68 20 C82 8, 95 34, 125 18 C140 12, 155 25, 165 22"
              stroke="#0B2548"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>

    <div className="p-3">
      <button
        onClick={() => {
          onShowToast('Service Job Completed & Signed by Customer!');
          onSelectScreen(15);
        }}
        className="w-full py-2 rounded-xl bg-[#1368CE] text-white font-bold text-xs shadow-sm"
      >
        Save & Complete
      </button>
    </div>
  </div>
);

// ================= 15. PAYMENT / RECEIPT =================
export const Screen15PaymentReceipt: React.FC<ScreenProps> = ({
  onSelectScreen,
  items,
  onPreviewDoc,
  onShowToast,
}) => (
  <div className="flex-1 bg-white flex flex-col justify-between">
    <ScreenHeader title="Payment / Receipt" onBack={() => onSelectScreen(4)} />

    <div className="p-3.5 space-y-2.5 text-[11px] flex-1">
      <div className="border-b border-slate-100 pb-1.5">
        <div className="text-[9px] text-slate-400">Customer</div>
        <div className="font-bold text-slate-900">Sharma Traders</div>
      </div>

      <div className="border-b border-slate-100 pb-1.5">
        <div className="text-[9px] text-slate-400">Invoice No.</div>
        <div className="font-bold font-mono text-slate-900">INV-00123</div>
      </div>

      <div className="border-b border-slate-100 pb-1.5">
        <div className="text-[9px] text-slate-400">Amount</div>
        <div className="font-extrabold font-mono text-sm text-slate-900">₹ 46,846</div>
      </div>

      <div className="border-b border-slate-100 pb-1.5">
        <div className="text-[9px] text-slate-400">Payment Mode</div>
        <div className="font-bold text-slate-900">UPI</div>
      </div>

      <div className="border-b border-slate-100 pb-1.5">
        <div className="text-[9px] text-slate-400">Transaction ID</div>
        <div className="font-bold font-mono text-slate-800">UPI123456789</div>
      </div>

      <div>
        <div className="text-[9px] text-slate-400">Date</div>
        <div className="font-bold font-mono text-slate-800">15-05-2025</div>
      </div>
    </div>

    <div className="p-3 grid grid-cols-3 gap-2">
      <button
        onClick={() => {
          const payDoc = items.find((i) => i.category === 'payment') || items[0];
          onPreviewDoc(payDoc);
        }}
        className="col-span-2 py-2 rounded-xl bg-[#1368CE] text-white font-bold text-xs shadow-sm"
      >
        Generate Receipt
      </button>
      <button
        onClick={() => onShowToast('Payment Receipt Saved & Customer Ledger Updated!')}
        className="py-2 rounded-xl bg-blue-50 text-[#1368CE] border border-blue-200 font-bold text-xs"
      >
        Save
      </button>
    </div>
  </div>
);

// ================= 16. CASH / BANK MANAGEMENT =================
export const Screen16CashBank: React.FC<ScreenProps> = ({
  onSelectScreen,
  onShowToast,
}) => {
  const [tab, setTab] = useState<'cash' | 'bank'>('cash');

  return (
    <div className="flex-1 bg-white flex flex-col justify-between">
      <ScreenHeader title="Cash / Bank Management" onBack={() => onSelectScreen(4)} />

      <div className="p-3 space-y-2.5 flex-1">
        <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
          <button
            onClick={() => setTab('cash')}
            className={`py-1 rounded-lg ${
              tab === 'cash' ? 'bg-white text-[#1368CE] shadow-2xs' : 'text-slate-500'
            }`}
          >
            Cash
          </button>
          <button
            onClick={() => setTab('bank')}
            className={`py-1 rounded-lg ${
              tab === 'bank' ? 'bg-white text-[#1368CE] shadow-2xs' : 'text-slate-500'
            }`}
          >
            Bank
          </button>
        </div>

        <div className="space-y-2 text-[11px] pt-1">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <Wallet className="w-4 h-4 text-[#1368CE]" />
            <div>
              <div className="text-[9px] text-slate-400">Opening Balance</div>
              <div className="font-extrabold font-mono text-slate-800">
                {tab === 'cash' ? '₹ 50,000' : '₹ 3,85,000'}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <div>
              <div className="text-[9px] text-slate-400">
                {tab === 'cash' ? 'Cash Received' : 'Bank Deposit / UPI'}
              </div>
              <div className="font-extrabold font-mono text-emerald-600">
                {tab === 'cash' ? '₹ 25,000' : '₹ 62,000'}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <Wallet className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-[9px] text-slate-400">
                {tab === 'cash' ? 'Cash Paid' : 'Bank Withdrawal'}
              </div>
              <div className="font-extrabold font-mono text-slate-800">
                {tab === 'cash' ? '₹ 12,000' : '₹ 31,500'}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center gap-2.5">
            <Wallet className="w-4 h-4 text-[#1368CE]" />
            <div>
              <div className="text-[9px] text-blue-700 font-semibold">Closing Balance</div>
              <div className="font-extrabold font-mono text-sm text-[#1368CE]">
                {tab === 'cash' ? '₹ 63,000' : '₹ 4,15,500'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-1.5">
        <button
          onClick={() => onShowToast('Transaction recorded in Daily Cash/Bank Book!')}
          className="w-full py-2 rounded-xl bg-[#1368CE] text-white font-bold text-xs shadow-sm"
        >
          Add Transaction
        </button>
        <button
          onClick={() => onSelectScreen(18)}
          className="w-full py-1.5 rounded-xl bg-blue-50 text-[#1368CE] border border-blue-200 font-bold text-[11px]"
        >
          View Statement
        </button>
      </div>
    </div>
  );
};

// ================= 17. STOCK MANAGEMENT =================
export const Screen17StockManagement: React.FC<ScreenProps> = ({
  onSelectScreen,
  onShowToast,
}) => {
  const [q, setQ] = useState('');
  const stockRows = [
    { name: 'CCTV Camera', qty: 120, icon: Video, color: 'text-emerald-600' },
    { name: 'DVR', qty: 45, icon: Server, color: 'text-slate-800' },
    { name: 'NVR', qty: 20, icon: Server, color: 'text-slate-800' },
    { name: 'HDD', qty: 35, icon: HardDrive, color: 'text-slate-800' },
    { name: 'SMPS', qty: 60, icon: Cpu, color: 'text-slate-800' },
    { name: 'Cable', qty: 200, icon: Cable, color: 'text-slate-800' },
    { name: 'BNC Connector', qty: 150, icon: Cable, color: 'text-slate-800' },
  ].filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex-1 bg-[#F5F8FC] flex flex-col justify-between">
      <ScreenHeader title="Stock Management" onBack={() => onSelectScreen(4)} />

      <div className="p-2.5 space-y-2 flex-1">
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Product..."
            className="w-full text-[11px] bg-transparent focus:outline-none"
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 divide-y divide-slate-100">
          {stockRows.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.name}
                className="px-3 py-2 flex items-center justify-between text-[11px]"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-[#1368CE]" />
                  <span className="font-semibold text-slate-800">{r.name}</span>
                </div>
                <span className={`font-mono font-extrabold ${r.color}`}>{r.qty}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-2.5">
        <button
          onClick={() => onShowToast('Product SKU added to Stock Inventory!')}
          className="w-full py-2 rounded-xl bg-[#1368CE] text-white font-bold text-xs shadow-sm"
        >
          + Add Product
        </button>
      </div>
    </div>
  );
};

// ================= 18. REPORTS =================
export const Screen18Reports: React.FC<ScreenProps> = ({
  onSelectScreen,
  onShowToast,
}) => {
  const reportCards = [
    { label: 'Sales\nReport', icon: BarChart3 },
    { label: 'Purchase\nReport', icon: ShoppingCart },
    { label: 'Stock\nReport', icon: Package },
    { label: 'Staff\nReport', icon: Users },
    { label: 'Service\nReport', icon: Wrench },
    { label: 'Accounts\nReport', icon: Wallet },
  ];

  return (
    <div className="flex-1 bg-[#F5F8FC] flex flex-col justify-between">
      <ScreenHeader title="Reports" onBack={() => onSelectScreen(4)} />

      <div className="p-3 space-y-3 flex-1">
        <div className="grid grid-cols-3 gap-2">
          {reportCards.map((rc) => {
            const Icon = rc.icon;
            return (
              <button
                key={rc.label}
                onClick={() => onShowToast(`Loaded ${rc.label.replace('\n', ' ')}`)}
                className="bg-white border border-slate-200 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1.5 hover:border-blue-500 shadow-2xs text-center"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1368CE] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold text-slate-700 whitespace-pre-line leading-tight">
                  {rc.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-[10px] font-mono font-bold text-slate-700">
          <span>01-05-2025</span>
          <span className="text-slate-400">→</span>
          <span>15-05-2025</span>
        </div>
      </div>

      <div className="p-3">
        <button
          onClick={() => onShowToast('Report PDF & CSV Generated for 01-05-2025 to 15-05-2025!')}
          className="w-full py-2.5 rounded-xl bg-[#1368CE] text-white font-bold text-xs shadow-sm"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

// ================= 19. SETTINGS =================
export const Screen19Settings: React.FC<ScreenProps> = ({
  onSelectScreen,
  onShowToast,
}) => {
  const settingsItems = [
    { label: 'Company Profile', icon: Building2 },
    { label: 'User Management', icon: Users },
    { label: 'Roles & Permissions', icon: Shield },
    { label: 'Notification Settings', icon: Bell },
    { label: 'Backup & Restore', icon: CloudUpload },
    { label: 'Change Password', icon: KeyRound },
    { label: 'About App', icon: Info },
  ];

  return (
    <div className="flex-1 bg-[#F5F8FC] flex flex-col justify-between">
      <ScreenHeader title="Settings" onBack={() => onSelectScreen(4)} />

      <div className="p-2.5 flex-1">
        <div className="bg-white rounded-xl border border-slate-200/80 divide-y divide-slate-100">
          {settingsItems.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => onShowToast(`Opened ${s.label}`)}
                className="w-full px-3 py-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-800 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-[#1368CE]" />
                  <span>{s.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-2.5">
        <button
          onClick={() => onSelectScreen(2)}
          className="w-full py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
