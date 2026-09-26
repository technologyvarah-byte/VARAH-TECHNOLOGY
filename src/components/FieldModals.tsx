import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Phone,
  MapPin,
  Printer,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Wrench,
  Camera,
  Navigation,
  FileCheck,
  Cpu,
  IndianRupee,
  ArrowRight,
  Eraser,
} from 'lucide-react';
import { ErpItem } from '../types';

// ================= 1. CUSTOMER 360° PROFILE MODAL =================
interface CustomerProfileModalProps {
  customer: ErpItem | null;
  allItems: ErpItem[];
  onClose: () => void;
  onQuickCreateService: (customerName: string, mobile: string, location: string) => void;
  onQuickCreateSale: (customerName: string) => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  customer,
  allItems,
  onClose,
  onQuickCreateService,
  onQuickCreateSale,
}) => {
  const [activeTab, setActiveTab] = useState<
    'equipment' | 'sales' | 'payments' | 'jobs' | 'amc'
  >('equipment');

  if (!customer) return null;

  const matchParty = (i: ErpItem) =>
    i.partyName.toLowerCase() === customer.title.toLowerCase() ||
    i.title.toLowerCase().includes(customer.title.toLowerCase());

  const equipmentList = allItems.filter((i) => i.category === 'equipment' && matchParty(i));
  const salesList = allItems.filter(
    (i) => (i.category === 'sale' || i.category === 'quotation') && matchParty(i)
  );
  const paymentList = allItems.filter((i) => i.category === 'payment' && matchParty(i));
  const jobsList = allItems.filter(
    (i) => (i.category === 'installation' || i.category === 'service') && matchParty(i)
  );
  const amcList = allItems.filter((i) => i.category === 'amc' && matchParty(i));

  const outstanding = Math.max(0, customer.amount - customer.paidAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-[#0A1128] text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-mono text-xs font-bold">
                {customer.code}
              </span>
              <h2 className="text-xl font-bold">{customer.title}</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3">
              <span>Contact: {customer.partyName}</span>
              <span>•</span>
              <span className="font-mono">Mobile: {customer.mobile}</span>
              <span>•</span>
              <span className="font-mono">GSTIN: {customer.gstin || 'Unregistered'}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              {customer.location}
            </p>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => {
                onClose();
                onQuickCreateSale(customer.title);
              }}
              className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white"
            >
              + Sales Invoice
            </button>
            <button
              onClick={() => {
                onClose();
                onQuickCreateService(customer.title, customer.mobile, customer.location);
              }}
              className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950"
            >
              + Service Call
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-slate-50 divide-x divide-slate-200">
          <div className="p-3.5">
            <div className="text-[11px] font-bold uppercase text-slate-500">Total Billed</div>
            <div className="text-lg font-extrabold font-mono text-slate-900">
              ₹{customer.amount.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="p-3.5">
            <div className="text-[11px] font-bold uppercase text-slate-500">Total Paid</div>
            <div className="text-lg font-extrabold font-mono text-emerald-600">
              ₹{customer.paidAmount.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="p-3.5">
            <div className="text-[11px] font-bold uppercase text-slate-500">Outstanding</div>
            <div className="text-lg font-extrabold font-mono text-rose-600">
              ₹{outstanding.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="p-3.5">
            <div className="text-[11px] font-bold uppercase text-slate-500">Installed Assets</div>
            <div className="text-lg font-extrabold font-mono text-blue-600">
              {equipmentList.length} Units
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-4">
          {[
            { id: 'equipment', label: `CCTV Equipment (${equipmentList.length})` },
            { id: 'sales', label: `Sales & Quotations (${salesList.length})` },
            { id: 'payments', label: `Payments (${paymentList.length})` },
            { id: 'jobs', label: `Installations & Service (${jobsList.length})` },
            { id: 'amc', label: `AMC & Warranty (${amcList.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
                activeTab === t.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-5 max-h-[58vh] overflow-y-auto space-y-3">
          {activeTab === 'equipment' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <span className="font-bold text-blue-900">Site CCTV Asset Registry:</span> Exact
                camera locations, NVR/HDD serial numbers, and warranty dates installed at{' '}
                <span className="font-semibold">{customer.title}</span>.
              </div>
              {equipmentList.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-400">
                  No site equipment registered yet for this customer.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {equipmentList.map((eq) => (
                    <div
                      key={eq.id}
                      className="border border-slate-200 rounded-xl p-3.5 bg-white hover:border-blue-400 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                            <Cpu className="w-4 h-4 text-blue-600" />
                            {eq.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{eq.subtitle}</div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            eq.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          Warranty: {eq.status}
                        </span>
                      </div>
                      <div className="mt-2.5 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400">Serial: </span>
                          <span className="font-mono font-bold text-slate-800">{eq.code}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Location: </span>
                          <span className="font-semibold text-slate-800">{eq.location}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Installed: </span>
                          <span className="font-mono text-slate-700">{eq.dateStr}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Warranty End: </span>
                          <span className="font-mono text-slate-700">{eq.endDateStr}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sales' && (
            <div className="space-y-2.5">
              {salesList.map((s) => (
                <div
                  key={s.id}
                  className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600">{s.code}</span>
                      <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {s.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{s.dateStr}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 mt-1">{s.subtitle}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-base text-slate-900">
                      ₹{s.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-emerald-600 font-mono">
                      Paid: ₹{s.paidAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-2.5">
              {paymentList.map((p) => (
                <div
                  key={p.id}
                  className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between"
                >
                  <div>
                    <div className="font-mono text-xs font-bold text-emerald-700">{p.code}</div>
                    <div className="text-sm font-semibold text-slate-900">{p.subtitle}</div>
                    <div className="text-xs text-slate-500">{p.notes}</div>
                  </div>
                  <div className="text-right font-mono font-bold text-emerald-600 text-base">
                    +₹{p.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-2.5">
              {jobsList.map((j) => (
                <div
                  key={j.id}
                  className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600">{j.code}</span>
                      <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {j.category}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                        {j.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1">{j.title}</div>
                    <div className="text-xs text-slate-500">
                      Assigned Technician: <span className="font-semibold">{j.assignedTo}</span> •{' '}
                      {j.dateStr}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'amc' && (
            <div className="space-y-2.5">
              {amcList.map((a) => (
                <div key={a.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900">{a.title}</div>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-bold">
                      {a.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{a.subtitle}</div>
                  <div className="text-xs font-mono text-slate-500 mt-2">
                    Period: {a.dateStr} to {a.endDateStr} | Visits: {a.minQuantity}/{a.quantity}{' '}
                    Completed | AMC Value: ₹{a.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ================= 2. DOCUMENT PREVIEW MODAL (INVOICE / QUOTATION / RECEIPT) =================
interface DocumentPreviewModalProps {
  item: ErpItem | null;
  onClose: () => void;
  onConvertToSale?: (quotation: ErpItem) => void;
  onCreateInstallation?: (sale: ErpItem) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  item,
  onClose,
  onConvertToSale,
  onCreateInstallation,
}) => {
  const [copiedMsg, setCopiedMsg] = useState(false);

  if (!item) return null;

  const docTypeLabel =
    item.category === 'quotation'
      ? 'QUOTATION / ESTIMATE'
      : item.category === 'payment'
      ? 'OFFICIAL PAYMENT RECEIPT'
      : 'TAX INVOICE (GST)';

  const balance = Math.max(0, item.amount - item.paidAmount);

  const handleWhatsAppShare = () => {
    const text = `*VARAH MANAGEMENT — ${docTypeLabel}*\nRef No: *${item.code}*\nDate: ${
      item.dateStr
    }\nCustomer: *${item.partyName || item.title}*\nDetails: ${
      item.subtitle
    }\nTotal Amount: *₹${item.amount.toLocaleString('en-IN')}*\nPaid: ₹${item.paidAmount.toLocaleString(
      'en-IN'
    )}\nBalance: ₹${balance.toLocaleString('en-IN')}\n\nThank you for choosing VARAH CCTV & Security Solutions!`;

    navigator.clipboard?.writeText(text);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-auto">
        {/* Top Action Header */}
        <div className="bg-[#0A1128] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-sm">{docTypeLabel} PREVIEW</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copiedMsg ? 'Copied for WhatsApp!' : 'WhatsApp Share'}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-300 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-document" className="p-6 sm:p-8 space-y-6 bg-white text-slate-900">
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-4 gap-4">
            <div>
              <div className="text-xl font-extrabold tracking-tight text-[#0A1128]">
                VARAH MANAGEMENT
              </div>
              <div className="text-xs font-semibold text-blue-600">
                Complete CCTV & Electronic Security Systems
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Nehru Place Commercial Complex, New Delhi - 110019
              </div>
              <div className="text-xs font-mono text-slate-600">
                GSTIN: 07AAFCV8821K1Z4 • Helpline: +91 98100-VARAH
              </div>
            </div>
            <div className="sm:text-right">
              <div className="inline-block px-3 py-1 rounded bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                {docTypeLabel}
              </div>
              <div className="font-mono text-base font-bold text-slate-900 mt-2">{item.code}</div>
              <div className="text-xs text-slate-500 font-mono">Date: {item.dateStr}</div>
            </div>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <div className="font-bold uppercase text-slate-400 mb-1">Customer / Party</div>
              <div className="text-sm font-bold text-slate-900">{item.partyName || item.title}</div>
              <div className="text-slate-600 mt-0.5">{item.location}</div>
              {item.mobile && <div className="font-mono mt-0.5">Mobile: {item.mobile}</div>}
            </div>
            <div className="sm:text-right">
              <div className="font-bold uppercase text-slate-400 mb-1">Tax & Reference Info</div>
              <div className="font-mono text-slate-800">
                Customer GSTIN: {item.gstin || 'Unregistered'}
              </div>
              <div className="text-slate-600 mt-0.5">Executive: {item.assignedTo || 'Admin'}</div>
              <div className="mt-1">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                  Status: {item.status}
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Summary */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white uppercase">
                  <th className="py-2.5 px-3">Description / CCTV Specification</th>
                  <th className="py-2.5 px-3 text-right">Qty</th>
                  <th className="py-2.5 px-3 text-right">Taxable / Rate</th>
                  <th className="py-2.5 px-3 text-right">GST</th>
                  <th className="py-2.5 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3">
                    <div className="font-bold text-slate-900 text-sm">{item.subtitle}</div>
                    <div className="text-slate-500 mt-1">{item.notes}</div>
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.map((t, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-right font-mono font-bold">{item.quantity}</td>
                  <td className="p-3 text-right font-mono">
                    ₹{item.rate.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-right font-mono">
                    ₹{item.taxAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900 text-sm">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Box */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-2">
            <div className="text-xs text-slate-500 space-y-1">
              <div className="font-bold text-slate-700">Bank Details for NEFT / RTGS / UPI:</div>
              <div className="font-mono">Bank: HDFC Bank • A/C: 50200048291044 • IFSC: HDFC0000192</div>
              <div>1 Year Manufacturer Warranty on Hikvision/CP Plus Cameras, NVR & HDD.</div>
            </div>
            <div className="w-full sm:w-64 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Taxable + Install:</span>
                <span className="font-mono font-semibold">
                  ₹{(item.amount - item.taxAmount).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GST (18%):</span>
                <span className="font-mono font-semibold">
                  ₹{item.taxAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-1.5">
                <span>Grand Total:</span>
                <span className="font-mono">₹{item.amount.toLocaleString('en-IN')}</span>
              </div>
              {item.category !== 'quotation' && (
                <>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Paid / Received:</span>
                    <span className="font-mono">₹{item.paidAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Balance Due:</span>
                    <span className="font-mono">₹{balance.toLocaleString('en-IN')}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Workflow Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Next Step in VARAH Business Flow:
          </span>
          <div className="flex items-center gap-2">
            {item.category === 'quotation' && onConvertToSale && (
              <button
                onClick={() => {
                  onConvertToSale(item);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                Convert Approved Quotation → Sales Invoice <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {item.category === 'sale' && onCreateInstallation && (
              <button
                onClick={() => {
                  onCreateInstallation(item);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#0A1128] hover:bg-slate-800 text-cyan-300 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                Create Installation Job & Assign Staff <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= 3. TECHNICIAN INSTALLATION / SERVICE EXECUTION MODAL =================
interface JobExecutionModalProps {
  job: ErpItem | null;
  onClose: () => void;
  onCompleteJob: (
    job: ErpItem,
    executionDetails: {
      status: string;
      gpsCoords: string;
      serialsAndParts: string;
      workRemarks: string;
      collectedAmount: number;
      paymentMode: string;
      hasSignature: boolean;
    }
  ) => Promise<void>;
}

export const JobExecutionModal: React.FC<JobExecutionModalProps> = ({
  job,
  onClose,
  onCompleteJob,
}) => {
  const [status, setStatus] = useState(job?.status || 'In Progress');
  const [gpsCoords, setGpsCoords] = useState('28.5355° N, 77.2711° E (Site Verified)');
  const [serialsAndParts, setSerialsAndParts] = useState(
    job?.tags.join(', ') || 'RJ45 PoE Connector, 12V 2A Adapter'
  );
  const [workRemarks, setWorkRemarks] = useState(job?.notes || '');
  const [beforePhotoLoaded, setBeforePhotoLoaded] = useState(true);
  const [afterPhotoLoaded, setAfterPhotoLoaded] = useState(false);
  const [collectedAmount, setCollectedAmount] = useState<number>(
    job ? Math.max(0, job.amount - job.paidAmount) : 0
  );
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [hasSignature, setHasSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (job) {
      setStatus(job.status === 'Assigned' ? 'In Progress' : job.status);
      setSerialsAndParts(job.tags.join(', '));
      setWorkRemarks(job.notes);
      setCollectedAmount(Math.max(0, job.amount - job.paidAmount));
    }
  }, [job]);

  if (!job) return null;

  const captureGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords(
            `${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E (Live GPS)`
          );
        },
        () => {
          setGpsCoords('28.5355° N, 77.2711° E (Okhla Phase-II Verified)');
        }
      );
    }
  };

  // Signature Pad Drawing Handlers
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    isDrawingRef.current = true;
    setHasSignature(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0A1128';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const endDraw = () => {
    isDrawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  const handleComplete = async (targetStatus: string) => {
    setIsSubmitting(true);
    try {
      await onCompleteJob(job, {
        status: targetStatus,
        gpsCoords,
        serialsAndParts,
        workRemarks,
        collectedAmount,
        paymentMode,
        hasSignature: true,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-auto">
        {/* Top Bar */}
        <div className="bg-[#0A1128] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold">
                {job.code}
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-xs font-bold uppercase">
                Priority: {job.priority}
              </span>
            </div>
            <h2 className="text-lg font-bold mt-1">
              {job.partyName} — {job.title}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technician Quick Action Strip (Section 14) */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-3 grid grid-cols-3 gap-2.5">
          <a
            href={`tel:${job.mobile || '9810456789'}`}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-300 hover:border-blue-600 text-xs font-bold text-slate-800 shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            CALL CUSTOMER
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              job.location
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-300 hover:border-blue-600 text-xs font-bold text-slate-800 shadow-2xs"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            NAVIGATION
          </a>
          <button
            type="button"
            onClick={() => {
              setStatus('In Progress');
              captureGps();
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-2xs"
          >
            <Wrench className="w-3.5 h-3.5" />
            START JOB
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 max-h-[72vh] overflow-y-auto space-y-4">
          {/* Status & GPS Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Job Pipeline Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold bg-white"
              >
                {['New', 'Assigned', 'On Way', 'In Progress', 'Completed', 'Closed'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Site GPS Location Stamp
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={gpsCoords}
                  onChange={(e) => setGpsCoords(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-slate-50"
                />
                <button
                  type="button"
                  onClick={captureGps}
                  className="px-2.5 py-2 rounded-lg bg-slate-900 text-cyan-400 text-xs font-bold shrink-0"
                >
                  GPS
                </button>
              </div>
            </div>
          </div>

          {/* Before & After Site Photos */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setBeforePhotoLoaded(true)}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition ${
                beforePhotoLoaded
                  ? 'border-emerald-300 bg-emerald-50/60'
                  : 'border-dashed border-slate-300 bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Before / Site Photo</div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  {beforePhotoLoaded ? '✓ Site_Before_01.jpg Attached' : 'Tap to Capture'}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAfterPhotoLoaded(true)}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition ${
                afterPhotoLoaded
                  ? 'border-emerald-300 bg-emerald-50/60'
                  : 'border-dashed border-slate-300 bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">After / Camera View Photo</div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  {afterPhotoLoaded ? '✓ Cam_Installed_View.jpg' : 'Tap to Attach After Photo'}
                </div>
              </div>
            </button>
          </div>

          {/* Equipment Serials / Parts Used / Cable Details */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              {job.category === 'installation'
                ? 'Equipment Serial Numbers & Cable Length Used'
                : 'Parts Used (Auto-Deducted from Stock)'}
            </label>
            <input
              type="text"
              value={serialsAndParts}
              onChange={(e) => setSerialsAndParts(e.target.value)}
              placeholder="e.g. Serial ABC123, ABC124, NVR12345, 180m CAT6 Cable"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
            />
          </div>

          {/* Work Done / Camera Locations Remarks */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Work Done / Camera Locations & Remarks
            </label>
            <textarea
              rows={2}
              value={workRemarks}
              onChange={(e) => setWorkRemarks(e.target.value)}
              placeholder="Enter camera locations (Main Gate, Office, Warehouse) or repair details..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          {/* On-Site Payment Collection */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Payment Collected on Site (₹)
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  value={collectedAmount}
                  onChange={(e) => setCollectedAmount(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-sm font-mono font-bold bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-semibold bg-white"
              >
                {['UPI', 'Cash', 'Bank', 'Cheque', 'Pending'].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer Digital Signature Pad */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase text-slate-500">
                Customer Digital Signature (Sign Below to Confirm Job Completion)
              </label>
              <button
                type="button"
                onClick={clearSignature}
                className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1"
              >
                <Eraser className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
            <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={560}
                height={110}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
                className="w-full h-28 cursor-crosshair touch-none"
              />
            </div>
            {hasSignature && (
              <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Customer signature captured & verified
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleComplete(status)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700"
          >
            Save Progress ({status})
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleComplete('Completed')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSubmitting ? 'Completing Job...' : 'Verify Signature & Complete Job'}
          </button>
        </div>
      </div>
    </div>
  );
};
