import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  FileText,
  Package,
  HardHat,
  CalendarCheck,
  Wrench,
  BarChart3,
  MoreHorizontal,
  Crown,
  User,
  ShieldCheck,
  Smile,
  BellRing,
  Users,
  Video,
  CheckCircle2,
  LayoutGrid,
  Smartphone,
  Monitor,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  onAuthStateChanged,
  collection,
  query,
  where,
  onSnapshot,
  createErpItemInFirestore,
  updateErpItemInFirestore,
  OperationType,
  handleFirestoreError,
  User as FirebaseUser,
} from './firebase';
import { AdminModuleId, ErpItem, OcrInvoiceData } from './types';
import { INITIAL_ERP_ITEMS } from './initialData';
import { VarahLogo } from './components/VarahLogo';
import {
  PhoneFrame,
  ScreenProps,
  Screen1Splash,
  Screen2Login,
  Screen3RoleSelection,
  Screen4AdminDashboard,
  Screen5AdminMenu,
  Screen6PurchaseOcr,
  Screen7PurchaseDetails,
  Screen8SalesInvoice,
  Screen9CustomerManagement,
  Screen10StaffManagement,
} from './components/MobileScreensPart1';
import {
  Screen11Attendance,
  Screen12InstallationJob,
  Screen13ServiceCall,
  Screen14JobDetails,
  Screen15PaymentReceipt,
  Screen16CashBank,
  Screen17StockManagement,
  Screen18Reports,
  Screen19Settings,
} from './components/MobileScreensPart2';
import { InvoiceOcrModal } from './components/InvoiceOcrModal';
import {
  CustomerProfileModal,
  DocumentPreviewModal,
  JobExecutionModal,
} from './components/FieldModals';
import { AdminModulesView } from './components/AdminModulesView';
import { StaffModeView } from './components/StaffModeView';

const SCREEN_DEFINITIONS: {
  num: number;
  title: string;
  darkBg?: boolean;
  Component: React.FC<ScreenProps>;
}[] = [
  { num: 1, title: 'Splash Screen', darkBg: true, Component: Screen1Splash },
  { num: 2, title: 'Login Screen', Component: Screen2Login },
  { num: 3, title: 'Role Selection', Component: Screen3RoleSelection },
  { num: 4, title: 'Admin Dashboard', Component: Screen4AdminDashboard },
  { num: 5, title: 'Admin Menu', darkBg: true, Component: Screen5AdminMenu },
  { num: 6, title: 'Purchase Invoice (OCR)', Component: Screen6PurchaseOcr },
  { num: 7, title: 'Purchase Invoice Details', Component: Screen7PurchaseDetails },
  { num: 8, title: 'Sales Invoice', Component: Screen8SalesInvoice },
  { num: 9, title: 'Customer Management', Component: Screen9CustomerManagement },
  { num: 10, title: 'Staff Management', Component: Screen10StaffManagement },
  { num: 11, title: 'Attendance (GPS + Photo)', Component: Screen11Attendance },
  { num: 12, title: 'Installation Job', Component: Screen12InstallationJob },
  { num: 13, title: 'Service Call', Component: Screen13ServiceCall },
  { num: 14, title: 'Job Details (Service)', Component: Screen14JobDetails },
  { num: 15, title: 'Payment / Receipt', Component: Screen15PaymentReceipt },
  { num: 16, title: 'Cash / Bank Management', Component: Screen16CashBank },
  { num: 17, title: 'Stock Management', Component: Screen17StockManagement },
  { num: 18, title: 'Reports', Component: Screen18Reports },
  { num: 19, title: 'Settings', Component: Screen19Settings },
];

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appMode, setAppMode] = useState<'admin' | 'staff'>('admin');
  // 'board' = All 19 Screens Grid (like the reference image), 'mobile' = Focused Single Phone App, 'desktop' = Full ERP tables
  const [layoutMode, setLayoutMode] = useState<'board' | 'mobile' | 'desktop'>('board');
  const [activeScreenNum, setActiveScreenNum] = useState<number>(4);
  const [activeDesktopModule, setActiveDesktopModule] = useState<AdminModuleId>('purchase');
  const [selectedStaffName, setSelectedStaffName] = useState('Ravi Kumar');

  // ERP Data State
  const [items, setItems] = useState<ErpItem[]>(INITIAL_ERP_ITEMS);

  // Interactive Modals
  const [isOcrOpen, setIsOcrOpen] = useState(false);
  const [selectedCustomer360, setSelectedCustomer360] = useState<ErpItem | null>(null);
  const [previewDocItem, setPreviewDocItem] = useState<ErpItem | null>(null);
  const [executingJob, setExecutingJob] = useState<ErpItem | null>(null);
  const [toastBanner, setToastBanner] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastBanner(msg);
    setTimeout(() => setToastBanner(null), 3500);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;
    const q = query(collection(db, 'erp_items'), where('ownerId', '==', firebaseUser.uid));
    const unsubSnap = onSnapshot(
      q,
      async (snapshot) => {
        if (snapshot.empty) {
          for (const seedItem of INITIAL_ERP_ITEMS.slice(0, 15)) {
            await createErpItemInFirestore({ ...seedItem, ownerId: firebaseUser.uid });
          }
        } else {
          const loaded: ErpItem[] = [];
          snapshot.forEach((docSnap) => loaded.push(docSnap.data() as ErpItem));
          const loadedIds = new Set(loaded.map((l) => l.id));
          setItems([...loaded, ...INITIAL_ERP_ITEMS.filter((init) => !loadedIds.has(init.id))]);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'erp_items');
      }
    );
    return () => unsubSnap();
  }, [firebaseUser]);

  const handleCreateItem = async (newItem: ErpItem) => {
    setItems((prev) => [newItem, ...prev]);
    if (firebaseUser) {
      await createErpItemInFirestore({ ...newItem, ownerId: firebaseUser.uid });
    }
    showToast(`Saved: ${newItem.code} — ${newItem.title}`);
  };

  const handleUpdateItem = async (updated: ErpItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    if (firebaseUser) {
      await updateErpItemInFirestore({ ...updated, ownerId: firebaseUser.uid });
    }
  };

  const handleConfirmPurchaseOcr = async (ocrData: OcrInvoiceData) => {
    const purchaseRecord: ErpItem = {
      id: `pur_${Date.now()}`,
      ownerId: firebaseUser?.uid || 'demo_owner',
      category: 'purchase',
      code: ocrData.invoiceNumber || 'INV-4587',
      title: ocrData.supplier,
      subtitle: ocrData.items.map((i) => `${i.quantity}x ${i.brand} ${i.model}`).join(' + '),
      partyName: ocrData.supplier,
      mobile: '',
      location: 'Central Godown',
      gstin: ocrData.gstin,
      status: 'Stock Updated',
      priority: 'Normal',
      quantity: ocrData.items.reduce((s, i) => s + i.quantity, 0),
      minQuantity: 0,
      rate: ocrData.grandTotal,
      amount: ocrData.grandTotal,
      paidAmount: ocrData.grandTotal,
      taxAmount: Math.round(ocrData.grandTotal * 0.1525),
      discountAmount: 0,
      dateStr: ocrData.date || '2026-09-25',
      endDateStr: '',
      assignedTo: 'Suresh Yadav',
      notes: 'Verified via Mobile Camera AI OCR. Stock automatically increased.',
      tags: ['OCR Verified', ocrData.invoiceNumber],
    };
    await handleCreateItem(purchaseRecord);
    setActiveScreenNum(7);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('Connected to Firebase Cloud Firestore!');
    } catch {
      showToast('Continuing in instant local + demo mode');
    }
  };

  const sharedScreenProps: ScreenProps = {
    onSelectScreen: (num: number) => {
      setActiveScreenNum(num);
    },
    appMode,
    onSetAppMode: (mode) => {
      setAppMode(mode);
      showToast(`Switched to ${mode === 'admin' ? 'Admin Mode (Full Access)' : 'Staff Mode (Assigned Work Only)'}`);
    },
    items,
    onOpenOcrScanner: () => setIsOcrOpen(true),
    onSelectCustomer360: (cust) => setSelectedCustomer360(cust),
    onPreviewDoc: (item) => setPreviewDocItem(item),
    onOpenJobModal: (job) => setExecutingJob(job),
    onShowToast: showToast,
    onGoogleLogin: handleGoogleLogin,
  };

  const activeScreenObj =
    SCREEN_DEFINITIONS.find((s) => s.num === activeScreenNum) || SCREEN_DEFINITIONS[3];
  const ActiveFocusedComponent = activeScreenObj.Component;

  return (
    <div className="min-h-screen bg-[#E9EFF6] text-slate-900 flex flex-col justify-between">
      {/* Toast Notification */}
      {toastBanner && (
        <div className="fixed bottom-16 right-4 z-50 bg-[#091E3A] text-white px-4 py-3 rounded-xl shadow-2xl border border-cyan-400/40 flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastBanner}</span>
        </div>
      )}

      {/* ================= TOP HERO BANNER (EXACT MATCH TO UPLOADED DESIGN) ================= */}
      <header className="bg-gradient-to-r from-[#07172E] via-[#0B2345] to-[#0D2B54] text-white border-b border-blue-900/60 shadow-lg">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-3.5 flex flex-col xl:flex-row items-center justify-between gap-4">
          {/* Left: Brand Logo Box + Title */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => {
                setLayoutMode('board');
                setActiveScreenNum(4);
              }}
              className="p-2.5 rounded-2xl bg-[#07152B] border border-blue-800/80 shadow-md cursor-pointer hover:border-cyan-400 transition"
            >
              <VarahLogo size="sm" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  VARAH
                </h1>
                <span className="text-xl sm:text-2xl font-bold tracking-wide text-[#29A8DF]">
                  MANAGEMENT
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                CCTV Business Management - All in One
              </p>
            </div>
          </div>

          {/* Center: "Manage Your Business Anywhere, Anytime" + 8 Quick Module Icons */}
          <div className="flex flex-col items-center xl:items-start gap-2.5 border-y xl:border-y-0 xl:border-x border-white/10 py-3 xl:py-0 xl:px-8 w-full xl:w-auto">
            <div className="text-sm sm:text-base font-bold text-white tracking-tight text-center xl:text-left">
              Manage Your Business Anywhere, Anytime
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {[
                { label: 'Purchase', icon: ShoppingCart, screen: 6, mod: 'purchase' as AdminModuleId },
                { label: 'Sales', icon: FileText, screen: 8, mod: 'sales' as AdminModuleId },
                { label: 'Stock', icon: Package, screen: 17, mod: 'stock' as AdminModuleId },
                { label: 'Staff', icon: HardHat, screen: 10, mod: 'staff' as AdminModuleId },
                { label: 'Attendance', icon: CalendarCheck, screen: 11, mod: 'attendance' as AdminModuleId },
                { label: 'Service', icon: Wrench, screen: 13, mod: 'service' as AdminModuleId },
                { label: 'Reports', icon: BarChart3, screen: 18, mod: 'reports' as AdminModuleId },
                { label: 'More...', icon: MoreHorizontal, screen: 5, mod: 'settings' as AdminModuleId },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = activeScreenNum === m.screen;
                return (
                  <button
                    key={m.label}
                    onClick={() => {
                      setActiveScreenNum(m.screen);
                      setActiveDesktopModule(m.mod);
                      if (layoutMode === 'board') {
                        setLayoutMode('mobile');
                      }
                    }}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${
                        isSelected
                          ? 'bg-[#1368CE] border-cyan-300 text-white shadow-md scale-105'
                          : 'bg-[#102E57] border-blue-400/30 text-cyan-300 group-hover:bg-[#1368CE] group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-200 group-hover:text-cyan-300">
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Admin Mode & Staff Mode Buttons + View Switcher */}
          <div className="flex flex-col sm:flex-row xl:flex-col items-center gap-2 shrink-0">
            <div className="flex sm:flex-row xl:flex-col gap-2">
              <button
                onClick={() => {
                  setAppMode('admin');
                  setActiveScreenNum(4);
                  showToast('Admin Mode Active — Full Access to all 19 Screens');
                }}
                className={`px-5 py-2 rounded-full border flex items-center gap-2.5 text-xs sm:text-sm font-bold transition ${
                  appMode === 'admin'
                    ? 'bg-gradient-to-r from-[#123A6F] to-[#1A569E] border-cyan-300/70 text-white shadow-md'
                    : 'bg-[#0B2140] border-slate-600 text-slate-300 hover:border-blue-400'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>Admin Mode</span>
              </button>

              <button
                onClick={() => {
                  setAppMode('staff');
                  setActiveScreenNum(11);
                  showToast('Staff Mode Active — Assigned Installation, Service & GPS Attendance');
                }}
                className={`px-5 py-2 rounded-full border flex items-center gap-2.5 text-xs sm:text-sm font-bold transition ${
                  appMode === 'staff'
                    ? 'bg-gradient-to-r from-[#1368CE] to-[#1E88E5] border-cyan-300 text-white shadow-md'
                    : 'bg-[#0E315E] border-blue-500/40 text-slate-200 hover:border-cyan-400'
                }`}
              >
                <User className="w-4 h-4 text-cyan-300" />
                <span>Staff Mode</span>
              </button>
            </div>
            <span className="text-[10px] text-slate-300">(Different Access)</span>
          </div>
        </div>

        {/* Sub-Bar: Switch Between "All 19 Screens Showcase", "Single Phone Focus", and "Full Desktop ERP" */}
        <div className="bg-[#061224] border-t border-white/10 px-4 py-2">
          <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setLayoutMode('board')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                  layoutMode === 'board'
                    ? 'bg-[#1368CE] text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> All 19 Screens Board
              </button>
              <button
                onClick={() => setLayoutMode('mobile')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                  layoutMode === 'mobile'
                    ? 'bg-[#1368CE] text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Single Mobile Screen ({activeScreenObj.num}. {activeScreenObj.title})
              </button>
              <button
                onClick={() => setLayoutMode('desktop')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                  layoutMode === 'desktop'
                    ? 'bg-[#1368CE] text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Full-Screen Tables & OCR Builder
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span>Quick Actions:</span>
              <button
                onClick={() => setIsOcrOpen(true)}
                className="px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold hover:bg-cyan-500/30"
              >
                📷 Live OCR Invoice Scanner
              </button>
              <button
                onClick={() => {
                  const sharma = items.find((i) => i.category === 'customer');
                  if (sharma) setSelectedCustomer360(sharma);
                }}
                className="px-2.5 py-1 rounded bg-blue-500/20 border border-blue-400/40 text-blue-200 font-bold hover:bg-blue-500/30"
              >
                👤 Sharma Traders 360°
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN WORKSPACE AREA ================= */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-3 sm:px-6 py-5">
        {/* VIEW 1: ALL 19 SCREENS INTERACTIVE SHOWCASE (EXACT LAYOUT OF UPLOADED IMAGE) */}
        {layoutMode === 'board' && (
          <div className="space-y-7">
            {/* Row 1: Screens 1 to 6 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 justify-items-center">
              {SCREEN_DEFINITIONS.slice(0, 6).map((scr) => {
                const Comp = scr.Component;
                return (
                  <PhoneFrame
                    key={scr.num}
                    screenNumber={scr.num}
                    title={scr.title}
                    darkBg={scr.darkBg}
                    onFocusScreen={(n) => {
                      setActiveScreenNum(n);
                      setLayoutMode('mobile');
                    }}
                  >
                    <Comp {...sharedScreenProps} />
                  </PhoneFrame>
                );
              })}
            </div>

            {/* Row 2: Screens 7 to 12 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 justify-items-center">
              {SCREEN_DEFINITIONS.slice(6, 12).map((scr) => {
                const Comp = scr.Component;
                return (
                  <PhoneFrame
                    key={scr.num}
                    screenNumber={scr.num}
                    title={scr.title}
                    darkBg={scr.darkBg}
                    onFocusScreen={(n) => {
                      setActiveScreenNum(n);
                      setLayoutMode('mobile');
                    }}
                  >
                    <Comp {...sharedScreenProps} />
                  </PhoneFrame>
                );
              })}
            </div>

            {/* Row 3: Screens 13 to 19 (7 Screens) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 justify-items-center">
              {SCREEN_DEFINITIONS.slice(12, 19).map((scr) => {
                const Comp = scr.Component;
                return (
                  <PhoneFrame
                    key={scr.num}
                    screenNumber={scr.num}
                    title={scr.title}
                    darkBg={scr.darkBg}
                    onFocusScreen={(n) => {
                      setActiveScreenNum(n);
                      setLayoutMode('mobile');
                    }}
                  >
                    <Comp {...sharedScreenProps} />
                  </PhoneFrame>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: SINGLE INTERACTIVE MOBILE APP FOCUS MODE */}
        {layoutMode === 'mobile' && (
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 py-2">
            {/* Left Sidebar: All 19 Screens Quick Selector */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm w-full lg:w-72 shrink-0">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#091E3A] mb-2.5">
                Jump to Any Screen (1 – 19)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5 max-h-[560px] overflow-y-auto pr-1">
                {SCREEN_DEFINITIONS.map((scr) => (
                  <button
                    key={scr.num}
                    onClick={() => setActiveScreenNum(scr.num)}
                    className={`px-3 py-2 rounded-xl text-left text-xs font-bold flex items-center justify-between transition ${
                      activeScreenNum === scr.num
                        ? 'bg-[#1368CE] text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate">
                      {scr.num}. {scr.title}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  </button>
                ))}
              </div>
            </div>

            {/* Center: Interactive Focused Mobile Device */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setActiveScreenNum((prev) => (prev > 1 ? prev - 1 : 19))
                  }
                  className="p-2.5 rounded-full bg-white border border-slate-200 hover:border-blue-500 shadow-xs"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-700" />
                </button>
                <span className="text-sm font-extrabold text-[#091E3A]">
                  Screen {activeScreenObj.num} of 19 — {activeScreenObj.title}
                </span>
                <button
                  onClick={() =>
                    setActiveScreenNum((prev) => (prev < 19 ? prev + 1 : 1))
                  }
                  className="p-2.5 rounded-full bg-white border border-slate-200 hover:border-blue-500 shadow-xs"
                >
                  <ChevronRight className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              <PhoneFrame
                screenNumber={activeScreenObj.num}
                title={activeScreenObj.title}
                darkBg={activeScreenObj.darkBg}
                isFocused
              >
                <ActiveFocusedComponent {...sharedScreenProps} />
              </PhoneFrame>
            </div>
          </div>
        )}

        {/* VIEW 3: FULL DESKTOP ERP TABLES & STAFF PORTAL */}
        {layoutMode === 'desktop' && (
          <div>
            {appMode === 'staff' ? (
              <StaffModeView
                items={items}
                selectedStaffName={selectedStaffName}
                onSelectStaffName={setSelectedStaffName}
                onCheckInOut={async (staffName, action, locationStr) => {
                  showToast(`${staffName} ${action} recorded at ${locationStr}`);
                }}
                onOpenJobExecution={(job) => setExecutingJob(job)}
                onCollectPayment={async (cust, inv, amt, mode) => {
                  showToast(`Collected ₹${amt} via ${mode} for ${cust} (${inv})`);
                }}
                onSubmitWorkReport={async (staffName) => {
                  showToast(`Daily Work Report saved for ${staffName}`);
                }}
              />
            ) : (
              <AdminModulesView
                activeModule={activeDesktopModule}
                items={items}
                onNavigateModule={(mod) => setActiveDesktopModule(mod)}
                onOpenOcrScanner={() => setIsOcrOpen(true)}
                onSelectCustomer360={(cust) => setSelectedCustomer360(cust)}
                onPreviewDocument={(docItem) => setPreviewDocItem(docItem)}
                onOpenJobExecution={(job) => setExecutingJob(job)}
                onCreateErpItem={handleCreateItem}
                onUpdateErpItem={handleUpdateItem}
              />
            )}
          </div>
        )}
      </main>

      {/* ================= BOTTOM FOOTER BANNER (EXACT MATCH TO UPLOADED DESIGN) ================= */}
      <footer className="bg-gradient-to-r from-[#07172E] via-[#0B2345] to-[#081A35] text-white border-t border-blue-900/60 py-3.5 px-4 sm:px-8">
        <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Left Brand & Tagline */}
          <div className="flex items-center gap-3">
            <div className="font-extrabold tracking-wider text-sm">
              VARAH <span className="text-[#29A8DF] font-bold">MANAGEMENT</span>
            </div>
            <span className="text-slate-500">|</span>
            <span className="text-slate-200 font-medium">
              Smart Management for a Safer Tomorrow
            </span>
          </div>

          {/* Center Feature Badges */}
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-cyan-300">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight text-[11px]">
                <div className="font-bold">Secure</div>
                <div className="text-slate-300">&amp; Reliable</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-cyan-300">
                <Smile className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight text-[11px]">
                <div className="font-bold">Easy to Use</div>
                <div className="text-slate-300">Interface</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-cyan-300">
                <BellRing className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight text-[11px]">
                <div className="font-bold">Real-time</div>
                <div className="text-slate-300">Updates</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-cyan-300">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight text-[11px]">
                <div className="font-bold">Multi-Role</div>
                <div className="text-slate-300">Access</div>
              </div>
            </div>
          </div>

          {/* Right CCTV Business Management App Badge */}
          <div className="flex items-center gap-2 text-right">
            <Video className="w-5 h-5 text-cyan-300" />
            <div className="leading-tight text-[11px]">
              <div className="font-bold text-white">CCTV Business</div>
              <div className="text-cyan-300 font-semibold">Management App</div>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Interactive Modals */}
      <InvoiceOcrModal
        isOpen={isOcrOpen}
        onClose={() => setIsOcrOpen(false)}
        onConfirmPurchase={handleConfirmPurchaseOcr}
      />

      <CustomerProfileModal
        customer={selectedCustomer360}
        allItems={items}
        onClose={() => setSelectedCustomer360(null)}
        onQuickCreateService={() => {
          setSelectedCustomer360(null);
          setActiveScreenNum(13);
        }}
        onQuickCreateSale={() => {
          setSelectedCustomer360(null);
          setActiveScreenNum(8);
        }}
      />

      <DocumentPreviewModal
        item={previewDocItem}
        onClose={() => setPreviewDocItem(null)}
      />

      <JobExecutionModal
        job={executingJob}
        onClose={() => setExecutingJob(null)}
        onCompleteJob={async (job, details) => {
          await handleUpdateItem({ ...job, status: details.status });
          showToast(`Job ${job.code} marked ${details.status}!`);
        }}
      />
    </div>
  );
}
