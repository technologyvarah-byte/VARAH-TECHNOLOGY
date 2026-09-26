import React, { useState } from 'react';
import {
  Smartphone,
  Lock,
  Crown,
  HardHat,
  Users,
  Package,
  AlertCircle,
  ShoppingCart,
  FileText,
  MoreHorizontal,
  Home,
  Menu,
  Bell,
  User,
  ChevronRight,
  ArrowLeft,
  Camera,
  Search,
  Plus,
  Wrench,
  Wallet,
  Receipt,
  Truck,
  Calendar,
  Maximize2,
} from 'lucide-react';
import { VarahLogo, SplashCctvIllustration } from './VarahLogo';
import { ErpItem } from '../types';

export interface ScreenProps {
  onSelectScreen: (screenNum: number) => void;
  appMode: 'admin' | 'staff';
  onSetAppMode: (mode: 'admin' | 'staff') => void;
  items: ErpItem[];
  onOpenOcrScanner: () => void;
  onSelectCustomer360: (cust: ErpItem) => void;
  onPreviewDoc: (item: ErpItem) => void;
  onOpenJobModal: (job: ErpItem) => void;
  onShowToast: (msg: string) => void;
  onGoogleLogin: () => void;
}

export const PhoneFrame: React.FC<{
  screenNumber: number;
  title: string;
  isFocused?: boolean;
  onFocusScreen?: (n: number) => void;
  darkBg?: boolean;
  children: React.ReactNode;
}> = ({ screenNumber, title, isFocused = false, onFocusScreen, darkBg = false, children }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Realistic Mobile Bezel */}
      <div
        className={`relative rounded-[34px] p-2.5 bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950 shadow-xl border border-slate-600/80 transition-all ${
          isFocused ? 'w-full max-w-[360px]' : 'w-full max-w-[295px] hover:scale-[1.01]'
        }`}
      >
        {/* Expand to Focus Button when in Grid Mode */}
        {!isFocused && onFocusScreen && (
          <button
            onClick={() => onFocusScreen(screenNumber)}
            title={`Expand ${screenNumber}. ${title}`}
            className="absolute -top-2 -right-2 z-20 w-7 h-7 rounded-full bg-[#1368CE] hover:bg-blue-500 text-white shadow-md flex items-center justify-center border border-white"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Inner Screen Viewport */}
        <div
          className={`rounded-[26px] overflow-hidden flex flex-col ${
            isFocused ? 'h-[650px]' : 'h-[535px]'
          } ${darkBg ? 'bg-[#091E3A] text-white' : 'bg-[#F5F8FC] text-slate-800'}`}
        >
          {/* iOS / Android Top Status Bar + Notch */}
          <div
            className={`px-4 pt-1.5 pb-1 flex items-center justify-between text-[10px] font-semibold shrink-0 ${
              darkBg ? 'bg-[#081A33] text-white' : 'bg-[#0B2548] text-white'
            }`}
          >
            <span>9:41</span>
            <div className="w-16 h-3 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1">
              <span>5G</span>
              <div className="w-3.5 h-2 border border-white/80 rounded-[2px] p-[1px]">
                <div className="w-full h-full bg-white" />
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 flex flex-col overflow-y-auto">{children}</div>

          {/* Home Indicator Bar */}
          <div
            className={`py-1.5 flex justify-center shrink-0 ${
              darkBg ? 'bg-[#081A33]' : 'bg-white'
            }`}
          >
            <div
              className={`w-24 h-1 rounded-full ${
                darkBg ? 'bg-white/30' : 'bg-slate-300'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Label Below Phone Frame (1. Splash Screen ... 19. Settings) */}
      <button
        onClick={() => onFocusScreen && onFocusScreen(screenNumber)}
        className="mt-2.5 text-xs sm:text-sm font-extrabold text-[#091E3A] hover:text-[#1368CE] tracking-tight text-center transition"
      >
        {screenNumber}. {title}
      </button>
    </div>
  );
};

export const ScreenHeader: React.FC<{
  title: string;
  onBack: () => void;
  rightSlot?: React.ReactNode;
}> = ({ title, onBack, rightSlot }) => (
  <div className="bg-[#0B2548] text-white px-3.5 py-2.5 flex items-center justify-between shrink-0 shadow-xs">
    <div className="flex items-center gap-2">
      <button
        onClick={onBack}
        className="p-1 rounded-lg hover:bg-white/10 text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <span className="font-bold text-xs sm:text-sm tracking-tight">{title}</span>
    </div>
    {rightSlot}
  </div>
);

// ================= 1. SPLASH SCREEN =================
export const Screen1Splash: React.FC<ScreenProps> = ({ onSelectScreen }) => (
  <div
    onClick={() => onSelectScreen(2)}
    className="flex-1 bg-gradient-to-b from-[#071936] via-[#0B2854] to-[#081C3A] flex flex-col items-center justify-between p-5 cursor-pointer relative overflow-hidden"
  >
    <div className="w-48 h-48 rounded-full bg-blue-500/10 blur-2xl absolute top-16" />
    <div className="mt-14 z-10 flex flex-col items-center">
      <VarahLogo size="lg" />
      <p className="text-xs text-blue-100 font-medium text-center mt-4 px-4 leading-relaxed">
        Smart Management
        <br />
        for a Safer Tomorrow
      </p>
    </div>

    <div className="w-full flex flex-col items-end z-10 mt-auto">
      <SplashCctvIllustration />
      <div className="w-full text-center mt-2">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-semibold text-cyan-300">
          Tap to Open App →
        </span>
      </div>
    </div>
  </div>
);

// ================= 2. LOGIN SCREEN =================
export const Screen2Login: React.FC<ScreenProps> = ({
  onSelectScreen,
  onSetAppMode,
  onGoogleLogin,
  onShowToast,
}) => {
  const [mobile, setMobile] = useState('9876543210');
  const [password, setPassword] = useState('••••••••');
  const [remember, setRemember] = useState(true);

  return (
    <div className="flex-1 bg-white p-4 flex flex-col justify-between">
      <div className="pt-3 flex flex-col items-center">
        <VarahLogo size="md" darkText />
      </div>

      <div className="space-y-2.5 my-auto">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F2F6FC] border border-slate-200">
          <Smartphone className="w-4 h-4 text-[#1368CE] shrink-0" />
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile Number"
            className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F2F6FC] border border-slate-200">
          <Lock className="w-4 h-4 text-[#1368CE] shrink-0" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
          />
        </div>

        <button
          onClick={() => onSelectScreen(3)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0F5ec2] to-[#1A75E8] hover:opacity-95 text-white font-bold text-xs shadow-md transition"
        >
          Login
        </button>

        <div className="flex items-center justify-between text-[10px] pt-1">
          <label className="flex items-center gap-1.5 text-slate-600 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded text-[#1368CE]"
            />
            Remember Me
          </label>
          <button
            type="button"
            onClick={() => onShowToast('Password reset OTP sent to registered mobile')}
            className="text-[#1368CE] font-semibold hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              onSetAppMode('admin');
              onSelectScreen(4);
            }}
            className="py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#1368CE] font-bold text-[11px]"
          >
            Admin Login
          </button>
          <button
            onClick={() => {
              onSetAppMode('staff');
              onSelectScreen(11);
            }}
            className="py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#1368CE] font-bold text-[11px]"
          >
            Staff Login
          </button>
        </div>
        <button
          onClick={onGoogleLogin}
          className="w-full py-1 text-[10px] text-slate-400 hover:text-[#1368CE] font-medium text-center"
        >
          Version 1.0.0 • Tap for Cloud Sync
        </button>
      </div>
    </div>
  );
};

// ================= 3. ROLE SELECTION =================
export const Screen3RoleSelection: React.FC<ScreenProps> = ({
  onSelectScreen,
  onSetAppMode,
}) => (
  <div className="flex-1 bg-[#F5F8FC] p-4 flex flex-col justify-between">
    <div className="text-center pt-2">
      <h3 className="text-sm font-extrabold text-[#091E3A]">Select Your Role</h3>
    </div>

    <div className="space-y-3 my-auto">
      {/* Admin Card */}
      <button
        onClick={() => {
          onSetAppMode('admin');
          onSelectScreen(4);
        }}
        className="w-full rounded-2xl bg-gradient-to-b from-[#1A73E8] to-[#0D53B8] text-white p-4 shadow-md hover:opacity-95 transition flex flex-col items-center text-center"
      >
        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mb-1.5">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <div className="text-sm font-extrabold">Admin</div>
        <div className="text-[11px] font-semibold text-blue-100 mt-0.5">Full Access</div>
        <div className="text-[10px] text-blue-200">(Complete Management)</div>
      </button>

      {/* Staff Card */}
      <button
        onClick={() => {
          onSetAppMode('staff');
          onSelectScreen(11);
        }}
        className="w-full rounded-2xl bg-gradient-to-b from-[#1A73E8] to-[#0D53B8] text-white p-4 shadow-md hover:opacity-95 transition flex flex-col items-center text-center"
      >
        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mb-1.5">
          <HardHat className="w-5 h-5 text-white" />
        </div>
        <div className="text-sm font-extrabold">Staff</div>
        <div className="text-[11px] font-semibold text-blue-100 mt-0.5">Assigned Work Only</div>
        <div className="text-[10px] text-blue-200">(Installation / Service / Attendance)</div>
      </button>
    </div>

    <button
      onClick={() => onSelectScreen(2)}
      className="w-full py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs shadow-2xs"
    >
      Back
    </button>
  </div>
);

// ================= 4. ADMIN DASHBOARD =================
export const Screen4AdminDashboard: React.FC<ScreenProps> = ({ onSelectScreen }) => (
  <div className="flex-1 bg-[#F4F7FB] flex flex-col justify-between">
    {/* Navy Header */}
    <div className="bg-[#0B2548] text-white px-3.5 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center text-cyan-300 font-extrabold text-xs">
          V
        </div>
        <div className="leading-none">
          <div className="text-xs font-extrabold tracking-wide">VARAH</div>
          <div className="text-[8px] text-cyan-300 font-bold tracking-widest">MANAGEMENT</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right leading-tight">
          <div className="text-[10px] font-bold">Admin</div>
          <div className="text-[8px] text-slate-300">Super Admin</div>
        </div>
        <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
          A
        </div>
      </div>
    </div>

    {/* Body */}
    <div className="p-3 space-y-2.5 flex-1">
      {/* Today's Sales Blue Hero Card */}
      <div
        onClick={() => onSelectScreen(8)}
        className="rounded-2xl bg-gradient-to-r from-[#1261C4] to-[#1D7BF0] text-white p-3.5 shadow-md cursor-pointer"
      >
        <div className="text-[10px] text-blue-100 font-medium">Today&apos;s Sales</div>
        <div className="flex items-center justify-between mt-1">
          <div className="text-xl font-extrabold font-mono">₹ 85,500</div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-300/40 text-emerald-200 text-[10px] font-bold">
            ↑ 12%
          </span>
        </div>
      </div>

      {/* 2x2 KPI Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div
          onClick={() => onSelectScreen(9)}
          className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs cursor-pointer hover:border-blue-400"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
            <Users className="w-3.5 h-3.5 text-[#1368CE]" /> Customers
          </div>
          <div className="text-sm font-extrabold font-mono text-slate-900 mt-1">248</div>
        </div>

        <div
          onClick={() => onSelectScreen(17)}
          className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs cursor-pointer hover:border-blue-400"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
            <Package className="w-3.5 h-3.5 text-[#1368CE]" /> Stock Items
          </div>
          <div className="text-sm font-extrabold font-mono text-slate-900 mt-1">1,284</div>
        </div>

        <div
          onClick={() => onSelectScreen(10)}
          className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs cursor-pointer hover:border-blue-400"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
            <HardHat className="w-3.5 h-3.5 text-[#1368CE]" /> Staff
          </div>
          <div className="text-sm font-extrabold font-mono text-slate-900 mt-1">12</div>
        </div>

        <div
          onClick={() => onSelectScreen(15)}
          className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs cursor-pointer hover:border-blue-400"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Pending Payment
          </div>
          <div className="text-xs font-extrabold font-mono text-slate-900 mt-1">₹ 4,25,000</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="text-[11px] font-extrabold text-slate-800 mb-1.5">Quick Actions</div>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: 'Purchase', icon: ShoppingCart, target: 6 },
            { label: 'Sales', icon: FileText, target: 8 },
            { label: 'Stock', icon: Package, target: 17 },
            { label: 'More', icon: MoreHorizontal, target: 5 },
          ].map((qa) => {
            const Icon = qa.icon;
            return (
              <button
                key={qa.label}
                onClick={() => onSelectScreen(qa.target)}
                className="bg-white border border-slate-200 rounded-xl p-2 flex flex-col items-center gap-1 hover:border-blue-500 shadow-2xs"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1368CE] flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] font-bold text-slate-700">{qa.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>

    {/* Bottom Navigation: Home | Menu | Notifications | Profile */}
    <div className="bg-white border-t border-slate-200 px-3 py-1.5 flex items-center justify-between text-[9px] font-semibold text-slate-500">
      <button
        onClick={() => onSelectScreen(4)}
        className="flex flex-col items-center text-[#1368CE] font-bold"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>
      <button onClick={() => onSelectScreen(5)} className="flex flex-col items-center">
        <Menu className="w-3.5 h-3.5" />
        <span>Menu</span>
      </button>
      <button onClick={() => onSelectScreen(13)} className="flex flex-col items-center relative">
        <Bell className="w-3.5 h-3.5" />
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-0 right-2" />
        <span>Notifications</span>
      </button>
      <button onClick={() => onSelectScreen(19)} className="flex flex-col items-center">
        <User className="w-3.5 h-3.5" />
        <span>Profile</span>
      </button>
    </div>
  </div>
);

// ================= 5. ADMIN MENU =================
export const Screen5AdminMenu: React.FC<ScreenProps> = ({ onSelectScreen }) => {
  const menuItems = [
    { label: 'Dashboard', icon: Home, target: 4, active: true },
    { label: 'Purchase', icon: ShoppingCart, target: 6 },
    { label: 'Sales', icon: FileText, target: 8 },
    { label: 'Customer', icon: Users, target: 9 },
    { label: 'Supplier', icon: Truck, target: 7 },
    { label: 'Stock', icon: Package, target: 17 },
    { label: 'Staff', icon: HardHat, target: 10 },
    { label: 'Attendance', icon: Calendar, target: 11 },
    { label: 'Payment / Receipt', icon: Receipt, target: 15 },
    { label: 'Cash / Bank', icon: Wallet, target: 16 },
    { label: 'Expenses', icon: Receipt, target: 16 },
    { label: 'Quotation', icon: FileText, target: 8 },
    { label: 'Installation', icon: Wrench, target: 12 },
    { label: 'Service / Call', icon: Wrench, target: 13 },
  ];

  return (
    <div className="flex-1 bg-gradient-to-b from-[#0B2548] to-[#071832] text-white flex flex-col">
      <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-300 font-extrabold text-xs flex items-center justify-center">
            V
          </div>
          <span className="font-extrabold text-xs tracking-wide">
            VARAH <span className="text-cyan-300 font-semibold text-[10px]">MANAGEMENT</span>
          </span>
        </div>
        <Menu className="w-4 h-4 text-slate-300" />
      </div>

      <div className="p-2 space-y-0.5 flex-1 overflow-y-auto">
        {menuItems.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.label}
              onClick={() => onSelectScreen(m.target)}
              className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] font-medium transition ${
                m.active
                  ? 'bg-blue-500/25 text-cyan-300 font-bold'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{m.label}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ================= 6. PURCHASE INVOICE (OCR) =================
export const Screen6PurchaseOcr: React.FC<ScreenProps> = ({
  onSelectScreen,
  onOpenOcrScanner,
}) => {
  const [tab, setTab] = useState<'scan' | 'manual'>('scan');

  return (
    <div className="flex-1 bg-white flex flex-col justify-between">
      <ScreenHeader title="Purchase Invoice" onBack={() => onSelectScreen(4)} />

      <div className="p-3 space-y-3 flex-1 flex flex-col justify-between">
        {/* Tabs: Scan Invoice | Manual Entry */}
        <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
          <button
            onClick={() => setTab('scan')}
            className={`py-1.5 rounded-lg transition ${
              tab === 'scan' ? 'bg-white text-[#1368CE] shadow-2xs' : 'text-slate-500'
            }`}
          >
            Scan Invoice
          </button>
          <button
            onClick={() => {
              setTab('manual');
              onSelectScreen(7);
            }}
            className={`py-1.5 rounded-lg transition ${
              tab === 'manual' ? 'bg-white text-[#1368CE] shadow-2xs' : 'text-slate-500'
            }`}
          >
            Manual Entry
          </button>
        </div>

        {/* Simulated Invoice Camera Viewfinder with Yellow Corner Guides */}
        <div
          onClick={onOpenOcrScanner}
          className="relative rounded-2xl bg-slate-800 p-3.5 aspect-[4/3] flex items-center justify-center cursor-pointer overflow-hidden border border-slate-300 shadow-inner"
        >
          {/* Yellow OCR Corner Brackets */}
          <div className="absolute top-2.5 left-2.5 w-5 h-5 border-t-2 border-l-2 border-amber-400" />
          <div className="absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 border-amber-400" />
          <div className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b-2 border-l-2 border-amber-400" />
          <div className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 border-amber-400" />

          {/* Paper Tax Invoice Preview Inside Viewfinder */}
          <div className="bg-[#FBF9F5] text-slate-800 w-full h-full rounded-lg p-2.5 text-[8px] font-mono shadow-md flex flex-col justify-between">
            <div className="flex justify-between border-b border-slate-300 pb-1">
              <span className="font-bold text-[9px]">TAX INVOICE • Tech Solutions</span>
              <span>INV-4587</span>
            </div>
            <div className="space-y-0.5 text-[7px] text-slate-600">
              <div className="flex justify-between">
                <span>1. CCTV Camera (10 Qty)</span>
                <span>25,000</span>
              </div>
              <div className="flex justify-between">
                <span>2. DVR 8Ch (2 Qty)</span>
                <span>14,000</span>
              </div>
              <div className="flex justify-between">
                <span>3. Surveillance HDD (2 Qty)</span>
                <span>11,000</span>
              </div>
            </div>
            <div className="border-t border-slate-300 pt-1 flex justify-between font-bold text-blue-800">
              <span>GSTIN: 07AABCT1234F1Z5</span>
              <span>Total: ₹59,000</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => {
              onOpenOcrScanner();
              onSelectScreen(7);
            }}
            className="w-full py-2.5 rounded-xl bg-[#1368CE] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
          >
            <Camera className="w-3.5 h-3.5" /> Capture Invoice
          </button>
          <p className="text-[10px] text-slate-500 text-center leading-tight">
            Scan invoice using camera.
            <br />
            Details will be extracted automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

// ================= 7. PURCHASE INVOICE DETAILS =================
export const Screen7PurchaseDetails: React.FC<ScreenProps> = ({
  onSelectScreen,
  onShowToast,
}) => (
  <div className="flex-1 bg-white flex flex-col justify-between">
    <ScreenHeader title="Purchase Invoice Details" onBack={() => onSelectScreen(6)} />

    <div className="p-3 space-y-2 text-[11px] flex-1">
      <div className="border-b border-slate-100 pb-1.5">
        <div className="text-[9px] text-slate-400">Supplier</div>
        <div className="font-bold text-slate-900">Tech Solutions Pvt. Ltd.</div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-1.5">
        <div>
          <div className="text-[9px] text-slate-400">Invoice No.</div>
          <div className="font-bold font-mono text-slate-800">INV-4587</div>
        </div>
        <div>
          <div className="text-[9px] text-slate-400">Invoice Date</div>
          <div className="font-bold font-mono text-slate-800">12-05-2025</div>
        </div>
      </div>

      <div className="border-b border-slate-100 pb-1.5">
        <div className="text-[9px] text-slate-400">GSTIN</div>
        <div className="font-bold font-mono text-slate-800">07AABCT1234F1Z5</div>
      </div>

      {/* Product Table */}
      <table className="w-full text-left text-[10px] border-collapse">
        <thead>
          <tr className="bg-slate-100 text-slate-600 font-bold">
            <th className="py-1 px-1.5">Product</th>
            <th className="py-1 px-1 text-center">Qty</th>
            <th className="py-1 px-1 text-right">Rate</th>
            <th className="py-1 px-1.5 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          <tr>
            <td className="py-1.5 px-1.5 font-semibold">CCTV Camera</td>
            <td className="py-1.5 px-1 text-center font-mono">10</td>
            <td className="py-1.5 px-1 text-right font-mono">2,500</td>
            <td className="py-1.5 px-1.5 text-right font-mono font-bold">25,000</td>
          </tr>
          <tr>
            <td className="py-1.5 px-1.5 font-semibold">DVR</td>
            <td className="py-1.5 px-1 text-center font-mono">2</td>
            <td className="py-1.5 px-1 text-right font-mono">7,000</td>
            <td className="py-1.5 px-1.5 text-right font-mono font-bold">14,000</td>
          </tr>
          <tr>
            <td className="py-1.5 px-1.5 font-semibold">HDD</td>
            <td className="py-1.5 px-1 text-center font-mono">2</td>
            <td className="py-1.5 px-1 text-right font-mono">5,500</td>
            <td className="py-1.5 px-1.5 text-right font-mono font-bold">11,000</td>
          </tr>
        </tbody>
      </table>

      <div className="space-y-1 pt-1 border-t border-slate-200 text-[10px]">
        <div className="flex justify-between">
          <span className="text-slate-500 font-semibold">Sub Total</span>
          <span className="font-mono font-bold">50,000</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">GST (18%)</span>
          <span className="font-mono font-semibold">9,000</span>
        </div>
        <div className="flex justify-between text-xs font-extrabold text-slate-900 pt-1 border-t border-slate-100">
          <span>Total</span>
          <span className="font-mono">59,000</span>
        </div>
      </div>
    </div>

    <div className="p-3 grid grid-cols-2 gap-2">
      <button
        onClick={() => {
          onShowToast('Purchase Invoice INV-4587 Saved! Stock automatically increased (+14 units).');
          onSelectScreen(17);
        }}
        className="py-2 rounded-xl bg-[#1368CE] text-white font-bold text-xs shadow-sm"
      >
        Save
      </button>
      <button
        onClick={() => onSelectScreen(6)}
        className="py-2 rounded-xl bg-blue-50 text-[#1368CE] border border-blue-200 font-bold text-xs"
      >
        Edit
      </button>
    </div>
  </div>
);

// ================= 8. SALES INVOICE =================
export const Screen8SalesInvoice: React.FC<ScreenProps> = ({
  onSelectScreen,
  items,
  onPreviewDoc,
  onShowToast,
}) => (
  <div className="flex-1 bg-white flex flex-col justify-between">
    <ScreenHeader title="Sales Invoice" onBack={() => onSelectScreen(4)} />

    <div className="p-3 space-y-2.5 text-[11px] flex-1">
      <div className="flex justify-between border-b border-slate-100 pb-2">
        <div>
          <div className="text-[9px] text-slate-400">Customer</div>
          <div className="font-bold text-slate-900">Sharma Traders</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-slate-400">Date</div>
          <div className="font-bold font-mono text-slate-800">15-05-2025</div>
        </div>
      </div>

      <table className="w-full text-left text-[10px] border-collapse">
        <thead>
          <tr className="bg-slate-100 text-slate-600 font-bold">
            <th className="py-1.5 px-1.5">Product</th>
            <th className="py-1.5 px-1 text-center">Qty</th>
            <th className="py-1.5 px-1 text-right">Rate</th>
            <th className="py-1.5 px-1.5 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <tr>
            <td className="py-1.5 px-1.5 font-semibold">CCTV Camera</td>
            <td className="py-1.5 px-1 text-center font-mono">8</td>
            <td className="py-1.5 px-1 text-right font-mono">2,800</td>
            <td className="py-1.5 px-1.5 text-right font-mono font-bold">22,400</td>
          </tr>
          <tr>
            <td className="py-1.5 px-1.5 font-semibold">DVR</td>
            <td className="py-1.5 px-1 text-center font-mono">1</td>
            <td className="py-1.5 px-1 text-right font-mono">8,500</td>
            <td className="py-1.5 px-1.5 text-right font-mono font-bold">8,500</td>
          </tr>
          <tr>
            <td className="py-1.5 px-1.5 font-semibold">HDD</td>
            <td className="py-1.5 px-1 text-center font-mono">1</td>
            <td className="py-1.5 px-1 text-right font-mono">5,800</td>
            <td className="py-1.5 px-1.5 text-right font-mono font-bold">5,800</td>
          </tr>
          <tr>
            <td className="py-1.5 px-1.5 font-semibold">Installation</td>
            <td className="py-1.5 px-1 text-center font-mono">1</td>
            <td className="py-1.5 px-1 text-right font-mono">3,000</td>
            <td className="py-1.5 px-1.5 text-right font-mono font-bold">3,000</td>
          </tr>
        </tbody>
      </table>

      <div className="space-y-1 pt-2 border-t border-slate-200 text-[10px]">
        <div className="flex justify-between">
          <span className="text-slate-600 font-semibold">Subtotal</span>
          <span className="font-mono font-bold">39,700</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">GST (18%)</span>
          <span className="font-mono font-semibold">7,146</span>
        </div>
        <div className="flex justify-between text-xs font-extrabold text-slate-900 pt-1 border-t border-slate-100">
          <span>Total</span>
          <span className="font-mono">46,846</span>
        </div>
      </div>
    </div>

    <div className="p-3 grid grid-cols-3 gap-2">
      <button
        onClick={() => {
          const saleDoc = items.find((i) => i.category === 'sale') || items[0];
          onPreviewDoc(saleDoc);
        }}
        className="col-span-2 py-2 rounded-xl bg-[#1368CE] text-white font-bold text-xs shadow-sm"
      >
        Generate Invoice
      </button>
      <button
        onClick={() => onShowToast('Sales Invoice Saved & Stock Updated!')}
        className="py-2 rounded-xl bg-blue-50 text-[#1368CE] border border-blue-200 font-bold text-xs"
      >
        Save
      </button>
    </div>
  </div>
);

// ================= 9. CUSTOMER MANAGEMENT =================
export const Screen9CustomerManagement: React.FC<ScreenProps> = ({
  onSelectScreen,
  items,
  onSelectCustomer360,
}) => {
  const [q, setQ] = useState('');
  const custList = [
    { name: 'Sharma Traders', phone: '+91 98765 43210', city: 'Delhi', color: 'bg-amber-100 text-amber-600' },
    { name: 'Agarwal Enterprises', phone: '+91 98711 22334', city: 'Noida', color: 'bg-blue-100 text-blue-600' },
    { name: 'Sunrise Hospital', phone: '+91 98123 45678', city: 'Gurgaon', color: 'bg-sky-100 text-sky-600' },
    { name: 'Verma Electronics', phone: '+91 94567 89012', city: 'Ghaziabad', color: 'bg-amber-100 text-amber-600' },
    { name: 'RK Builders', phone: '+91 98765 11223', city: 'Faridabad', color: 'bg-blue-100 text-blue-600' },
  ].filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex-1 bg-[#F5F8FC] flex flex-col justify-between relative">
      <ScreenHeader title="Customer Management" onBack={() => onSelectScreen(4)} />

      <div className="p-2.5 space-y-2 flex-1">
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Customer..."
            className="w-full text-[11px] bg-transparent focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          {custList.map((c) => (
            <div
              key={c.name}
              onClick={() => {
                const found =
                  items.find((i) => i.category === 'customer' && i.title.includes(c.name.split(' ')[0])) ||
                  items.find((i) => i.category === 'customer');
                if (found) onSelectCustomer360(found);
              }}
              className="bg-white rounded-xl p-2.5 border border-slate-200/80 flex items-center gap-2.5 cursor-pointer hover:border-blue-400 shadow-2xs"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${c.color}`}>
                <User className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="text-[11px] font-bold text-slate-900">{c.name}</div>
                <div className="text-[10px] font-mono text-slate-500">{c.phone}</div>
                <div className="text-[9px] text-slate-400">{c.city}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating + Button */}
      <button
        onClick={() => {
          const first = items.find((i) => i.category === 'customer');
          if (first) onSelectCustomer360(first);
        }}
        className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#1368CE] text-white shadow-lg flex items-center justify-center"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

// ================= 10. STAFF MANAGEMENT =================
export const Screen10StaffManagement: React.FC<ScreenProps> = ({
  onSelectScreen,
  onShowToast,
}) => {
  const [q, setQ] = useState('');
  const staffRows = [
    { name: 'Ravi Kumar', role: 'Technician', phone: '+91 98765 12345', initials: 'RK', bg: 'bg-blue-700' },
    { name: 'Sandeep Singh', role: 'Installer', phone: '+91 98765 54321', initials: 'SS', bg: 'bg-emerald-700' },
    { name: 'Pooja Sharma', role: 'Accountant', phone: '+91 91234 56789', initials: 'PS', bg: 'bg-purple-700' },
    { name: 'Amit Yadav', role: 'Helper', phone: '+91 99887 77665', initials: 'AY', bg: 'bg-amber-700' },
  ].filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex-1 bg-[#F5F8FC] flex flex-col justify-between">
      <ScreenHeader title="Staff Management" onBack={() => onSelectScreen(4)} />

      <div className="p-2.5 space-y-2 flex-1">
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Staff..."
            className="w-full text-[11px] bg-transparent focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          {staffRows.map((s) => (
            <div
              key={s.name}
              onClick={() => onSelectScreen(11)}
              className="bg-white rounded-xl p-2.5 border border-slate-200/80 flex items-center justify-between cursor-pointer hover:border-blue-400 shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full ${s.bg} text-white font-bold text-[11px] flex items-center justify-center shrink-0`}>
                  {s.initials}
                </div>
                <div className="leading-tight">
                  <div className="text-[11px] font-bold text-slate-900">{s.name}</div>
                  <div className="text-[10px] text-slate-500">{s.role}</div>
                  <div className="text-[9px] font-mono text-slate-400">{s.phone}</div>
                </div>
              </div>
              <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1">
                ● Active
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2.5">
        <button
          onClick={() => onShowToast('Staff member added to VARAH directory')}
          className="w-full py-2 rounded-xl bg-[#1368CE] text-white font-bold text-xs shadow-sm"
        >
          + Add Staff
        </button>
      </div>
    </div>
  );
};
