import React, { useState } from 'react';
import {
  Camera,
  MapPin,
  CheckCircle2,
  Wrench,
  Phone,
  Navigation,
  IndianRupee,
  ClipboardList,
  Bell,
  UserCheck,
  Home,
  Briefcase,
  ShieldCheck,
  Clock,
  PlusCircle,
} from 'lucide-react';
import { ErpItem, StaffTabId } from '../types';

interface StaffModeViewProps {
  items: ErpItem[];
  selectedStaffName: string;
  onSelectStaffName: (name: string) => void;
  onCheckInOut: (staffName: string, action: 'Check In' | 'Check Out', locationStr: string) => Promise<void>;
  onOpenJobExecution: (job: ErpItem) => void;
  onCollectPayment: (customerName: string, invoiceCode: string, amount: number, mode: string) => Promise<void>;
  onSubmitWorkReport: (staffName: string, summary: string, expenseAmt: number) => Promise<void>;
}

export const StaffModeView: React.FC<StaffModeViewProps> = ({
  items,
  selectedStaffName,
  onSelectStaffName,
  onCheckInOut,
  onOpenJobExecution,
  onCollectPayment,
  onSubmitWorkReport,
}) => {
  const [activeTab, setActiveTab] = useState<StaffTabId>('my_dashboard');
  const [gpsLocation, setGpsLocation] = useState('Sharma Traders Site, Okhla Phase-II (28.5355° N, 77.2711° E)');
  const [selfieCaptured, setSelfieCaptured] = useState(true);
  const [payCustomer, setPayCustomer] = useState('Sharma Traders');
  const [payInvoice, setPayInvoice] = useState('INV-2026-104');
  const [payAmount, setPayAmount] = useState(12500);
  const [payMode, setPayMode] = useState('UPI');
  const [reportSummary, setReportSummary] = useState(
    'Completed 8-Camera IP termination at Sharma Traders & resolved Channel 4 PoE issue.'
  );
  const [reportExpense, setReportExpense] = useState(350);

  const staffList = items.filter((i) => i.category === 'staff');
  const myInstallations = items.filter(
    (i) =>
      i.category === 'installation' &&
      (i.assignedTo.toLowerCase().includes(selectedStaffName.toLowerCase()) ||
        selectedStaffName === 'All Staff')
  );
  const myServices = items.filter(
    (i) =>
      i.category === 'service' &&
      (i.assignedTo.toLowerCase().includes(selectedStaffName.toLowerCase()) ||
        selectedStaffName === 'All Staff')
  );
  const myAttendance = items.filter(
    (i) =>
      i.category === 'attendance' &&
      i.partyName.toLowerCase().includes(selectedStaffName.toLowerCase())
  );
  const notifications = items.filter((i) => i.category === 'notification');

  const refreshGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation(
            `Live Site GPS (${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E)`
          );
        },
        () => {
          setGpsLocation('Okhla Industrial Area Phase-II (28.5355° N, 77.2711° E)');
        }
      );
    }
  };

  return (
    <div className="pb-24 space-y-5">
      {/* Staff Mode Identity Banner */}
      <div className="bg-[#0A1128] text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-lg">
            👷
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                STAFF FIELD MODE
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                ● GPS Active
              </span>
            </div>
            <h2 className="text-lg font-bold mt-0.5">{selectedStaffName} — Field Portal</h2>
            <p className="text-xs text-slate-300">
              Showing only your assigned installations, service calls, GPS attendance & site tools
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-300 font-semibold">Staff View:</label>
          <select
            value={selectedStaffName}
            onChange={(e) => onSelectStaffName(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white text-xs font-bold rounded-xl px-3 py-2"
          >
            {staffList.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title} ({s.subtitle})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Pill Sub-Nav for Staff */}
      <div className="flex overflow-x-auto gap-2 pb-1">
        {[
          { id: 'my_dashboard', label: 'My Dashboard' },
          { id: 'attendance', label: 'GPS + Selfie Attendance' },
          { id: 'installations', label: `Assigned Installations (${myInstallations.length})` },
          { id: 'service_calls', label: `Assigned Service (${myServices.length})` },
          { id: 'payments', label: 'Payment Collection' },
          { id: 'work_report', label: 'Daily Work Report' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as StaffTabId)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === t.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. MY DASHBOARD */}
      {activeTab === 'my_dashboard' && (
        <div className="space-y-5">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <div className="text-xs font-bold uppercase text-slate-400">Attendance</div>
              <div className="text-base font-extrabold text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Checked In
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-0.5">09:32 AM • GPS Verified</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <div className="text-xs font-bold uppercase text-slate-400">Assigned Installations</div>
              <div className="text-2xl font-extrabold font-mono text-blue-600 mt-1">
                {myInstallations.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Site camera setups</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <div className="text-xs font-bold uppercase text-slate-400">Service Calls</div>
              <div className="text-2xl font-extrabold font-mono text-amber-600 mt-1">
                {myServices.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">High priority complaints</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <div className="text-xs font-bold uppercase text-slate-400">Field Collection</div>
              <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">₹30,000</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Collected Today</div>
            </div>
          </div>

          {/* Priority Technician Service Card (Section 14) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" /> Assigned Service & Installation Queue
              </h3>
              <span className="text-xs font-mono text-slate-500">Tap any job to Start & Sign</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...myServices, ...myInstallations].map((job) => (
                <div
                  key={job.id}
                  className="border border-slate-200 rounded-xl p-4 hover:border-blue-500 transition bg-slate-50/50 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {job.code}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded uppercase ${
                          job.priority === 'High'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        PRIORITY: {job.priority}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <div className="text-[11px] font-bold uppercase text-slate-400">CUSTOMER</div>
                      <div className="text-base font-extrabold text-slate-900">{job.partyName}</div>
                    </div>
                    <div className="mt-2">
                      <div className="text-[11px] font-bold uppercase text-slate-400">
                        {job.category === 'service' ? 'PROBLEM' : 'INSTALLATION SCOPE'}
                      </div>
                      <div className="text-sm font-bold text-rose-600">{job.title}</div>
                      <div className="text-xs text-slate-600 mt-0.5">{job.subtitle}</div>
                    </div>
                    <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      {job.location}
                    </div>
                  </div>

                  {/* Section 14 Action Buttons: [ CALL CUSTOMER ] [ NAVIGATION ] [ START JOB ] */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200">
                    <a
                      href={`tel:${job.mobile || '9810456789'}`}
                      className="py-2 px-2 rounded-lg bg-white border border-slate-300 hover:border-blue-600 text-[11px] font-bold text-slate-800 flex items-center justify-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" /> CALL
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        job.location
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 px-2 rounded-lg bg-white border border-slate-300 hover:border-blue-600 text-[11px] font-bold text-slate-800 flex items-center justify-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5 text-emerald-600" /> MAP
                    </a>
                    <button
                      onClick={() => onOpenJobExecution(job)}
                      className="py-2 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-[11px] font-bold text-white flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Wrench className="w-3.5 h-3.5" /> START JOB
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. GPS + SELFIE ATTENDANCE (Section 10) */}
      {activeTab === 'attendance' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Staff Mobile GPS + Selfie Attendance
              </h3>
              <p className="text-xs text-slate-500">
                Captures Selfie Photo, Live GPS Location, Date & Time for Field Verification
              </p>
            </div>
            <button
              onClick={refreshGps}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 self-start"
            >
              Refresh GPS Coordinates
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {selfieCaptured ? '✓ Live Field Selfie Ready' : 'Capture Staff Selfie'}
                  </div>
                  <div className="text-xs text-slate-500">
                    Staff: <span className="font-semibold text-slate-800">{selectedStaffName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelfieCaptured(true)}
                    className="text-xs font-bold text-blue-600 mt-1"
                  >
                    Retake Selfie Photo
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Detected GPS Site Location
                </label>
                <input
                  type="text"
                  value={gpsLocation}
                  onChange={(e) => setGpsLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => onCheckInOut(selectedStaffName, 'Check In', gpsLocation)}
                  className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" /> CHECK IN
                </button>
                <button
                  onClick={() => onCheckInOut(selectedStaffName, 'Check Out', gpsLocation)}
                  className="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
                >
                  <Clock className="w-4 h-4 text-cyan-400" /> CHECK OUT
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase text-slate-500">
                Recent Attendance Logs ({selectedStaffName})
              </div>
              {myAttendance.map((att) => (
                <div
                  key={att.id}
                  className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between bg-white"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {att.title} → <span className="font-mono text-blue-600">{att.dateStr}</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {att.location}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
                    {att.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. ASSIGNED INSTALLATIONS */}
      {activeTab === 'installations' && (
        <div className="space-y-3">
          {myInstallations.map((inst) => (
            <div
              key={inst.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600">{inst.code}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs font-bold">
                    {inst.status}
                  </span>
                </div>
                <div className="text-base font-bold text-slate-900 mt-1">
                  {inst.partyName} — {inst.title}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">{inst.subtitle}</div>
                <div className="text-xs text-slate-500 mt-1">{inst.location}</div>
              </div>
              <button
                onClick={() => onOpenJobExecution(inst)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0"
              >
                Open Installation Checklist & Sign →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. ASSIGNED SERVICE CALLS */}
      {activeTab === 'service_calls' && (
        <div className="space-y-3">
          {myServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-rose-600">{srv.code}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-xs font-bold">
                    Priority: {srv.priority}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-bold">
                    {srv.status}
                  </span>
                </div>
                <div className="text-base font-bold text-slate-900 mt-1">
                  {srv.partyName} — {srv.title}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">{srv.subtitle}</div>
                <div className="text-xs text-slate-500 mt-1">{srv.location}</div>
              </div>
              <button
                onClick={() => onOpenJobExecution(srv)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0"
              >
                Start Service & Upload Before/After →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 5. FIELD PAYMENT COLLECTION */}
      {activeTab === 'payments' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 max-w-xl space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-emerald-600" /> Field Payment Collection & Receipt
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={payCustomer}
                onChange={(e) => setPayCustomer(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Invoice / Job Reference
              </label>
              <input
                type="text"
                value={payInvoice}
                onChange={(e) => setPayInvoice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Collected Amount (₹)
              </label>
              <input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Payment Mode
              </label>
              <select
                value={payMode}
                onChange={(e) => setPayMode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold bg-white"
              >
                {['UPI', 'Cash', 'Bank', 'Cheque'].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={() => onCollectPayment(payCustomer, payInvoice, payAmount, payMode)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm"
          >
            Record Payment & Generate Receipt
          </button>
        </div>
      )}

      {/* 6. DAILY WORK REPORT */}
      {activeTab === 'work_report' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 max-w-xl space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" /> Submit Daily Work Report & Field Petrol Expense
          </h3>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Today&apos;s Work Summary (Sites Visited, Cameras Installed, Complaints Closed)
            </label>
            <textarea
              rows={3}
              value={reportSummary}
              onChange={(e) => setReportSummary(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Petrol / Travel Expense Claim (₹)
            </label>
            <input
              type="number"
              value={reportExpense}
              onChange={(e) => setReportExpense(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono font-bold"
            />
          </div>
          <button
            onClick={() => onSubmitWorkReport(selectedStaffName, reportSummary, reportExpense)}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Submit Daily Report to Admin
          </button>
        </div>
      )}

      {/* 7. NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div key={n.id} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="font-bold text-sm text-slate-900">{n.title}</div>
              <div className="text-xs text-slate-600 mt-0.5">{n.subtitle}</div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">{n.dateStr}</div>
            </div>
          ))}
        </div>
      )}

      {/* 8. PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 max-w-md space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
              {selectedStaffName.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-base text-slate-900">{selectedStaffName}</div>
              <div className="text-xs text-slate-500">Verified Field Staff • VARAH MANAGEMENT</div>
            </div>
          </div>
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Assigned Role Permissions:
            </div>
            <div>✔ Attendance (GPS + Selfie)</div>
            <div>✔ Assigned Installations & Service Calls</div>
            <div>✔ Before/After Site Photos & Customer Signature</div>
            <div>✔ On-Site Payment Collection</div>
            <div className="text-rose-600">❌ Admin Accounts, Profit Reports & Settings Restricted</div>
          </div>
        </div>
      )}

      {/* Staff Bottom Navigation Bar (Section 25: Home | Jobs | Attendance | Notifications | Profile) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg px-4 py-2 flex items-center justify-around max-w-md mx-auto sm:max-w-2xl rounded-t-2xl">
        {[
          { id: 'my_dashboard', label: 'Home', icon: Home },
          { id: 'installations', label: 'Jobs', icon: Briefcase },
          { id: 'attendance', label: 'Attendance', icon: UserCheck },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'profile', label: 'Profile', icon: ShieldCheck },
        ].map((nav) => {
          const Icon = nav.icon;
          const isActive = activeTab === nav.id;
          return (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id as StaffTabId)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px]">{nav.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
