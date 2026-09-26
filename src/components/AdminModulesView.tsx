import React, { useState } from 'react';
import {
  Camera,
  Plus,
  Search,
  Printer,
  Eye,
  Wrench,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  FileText,
  Download,
  Shield,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { AdminModuleId, ErpCategory, ErpItem } from '../types';

interface AdminModulesViewProps {
  activeModule: AdminModuleId;
  items: ErpItem[];
  onNavigateModule: (mod: AdminModuleId) => void;
  onOpenOcrScanner: () => void;
  onSelectCustomer360: (customer: ErpItem) => void;
  onPreviewDocument: (docItem: ErpItem) => void;
  onOpenJobExecution: (job: ErpItem) => void;
  onCreateErpItem: (item: ErpItem) => Promise<void>;
  onUpdateErpItem: (item: ErpItem) => Promise<void>;
}

const STOCK_CATEGORIES = [
  'All',
  'Camera',
  'DVR',
  'NVR',
  'HDD',
  'Cable',
  'SMPS',
  'BNC',
  'Adapter',
  'POE Switch',
  'Rack',
  'Monitor',
  'Router',
  'Accessories',
];

export const AdminModulesView: React.FC<AdminModulesViewProps> = ({
  activeModule,
  items,
  onNavigateModule,
  onOpenOcrScanner,
  onSelectCustomer360,
  onPreviewDocument,
  onOpenJobExecution,
  onCreateErpItem,
  onUpdateErpItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('All');
  const [reportTab, setReportTab] = useState<'sales' | 'purchase' | 'stock' | 'accounts' | 'staff'>(
    'sales'
  );
  const [showQuickCreate, setShowQuickCreate] = useState(false);

  // Interactive Sales Invoice / Quotation Builder State (Sections 5 & 18)
  const [billCustomer, setBillCustomer] = useState('Sharma Traders');
  const [billStockSku, setBillStockSku] = useState('SKU-CAM-001');
  const [billQty, setBillQty] = useState(8);
  const [billRate, setBillRate] = useState(2500);
  const [billInstallCharge, setBillInstallCharge] = useState(3000);
  const [billDiscount, setBillDiscount] = useState(500);
  const [billGstPct, setBillGstPct] = useState(18);
  const [billPaidAmt, setBillPaidAmt] = useState(20000);

  // Generic Quick Create State for any module
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newParty, setNewParty] = useState('Sharma Traders');
  const [newMobile, setNewMobile] = useState('9810456789');
  const [newLocation, setNewLocation] = useState('Plot 14, Okhla Phase-II, New Delhi');
  const [newCode, setNewCode] = useState('');
  const [newQty, setNewQty] = useState(1);
  const [newRate, setNewRate] = useState(2500);
  const [newAmount, setNewAmount] = useState(2500);
  const [newAssigned, setNewAssigned] = useState('Ravi Kumar');
  const [newPriority, setNewPriority] = useState('High');

  const customers = items.filter((i) => i.category === 'customer');
  const stockItems = items.filter((i) => i.category === 'stock');
  const staffMembers = items.filter((i) => i.category === 'staff');

  const selectedStockObj = stockItems.find((s) => s.code === billStockSku) || stockItems[0];

  // Auto-calculated Sales / Quotation Math
  const subTotal = billQty * billRate;
  const taxableValue = Math.max(0, subTotal + billInstallCharge - billDiscount);
  const gstAmount = Math.round((taxableValue * billGstPct) / 100);
  const grandTotal = taxableValue + gstAmount;
  const balanceDue = Math.max(0, grandTotal - billPaidAmt);

  const handleGenerateInvoiceOrQuotation = async (targetCat: 'sale' | 'quotation') => {
    const cust = customers.find((c) => c.title === billCustomer);
    const codePrefix = targetCat === 'sale' ? 'INV-2026-' : 'QTN-2026-';
    const newDoc: ErpItem = {
      id: `${targetCat}_${Date.now()}`,
      ownerId: 'demo_owner',
      category: targetCat,
      code: `${codePrefix}${Math.floor(110 + Math.random() * 890)}`,
      title: billCustomer,
      subtitle: `${billQty}x ${selectedStockObj?.title || 'CCTV Camera'} + Installation ₹${billInstallCharge}`,
      partyName: billCustomer,
      mobile: cust?.mobile || '9810456789',
      location: cust?.location || 'New Delhi',
      gstin: cust?.gstin || '07AABCS1429B1Z1',
      status: targetCat === 'quotation' ? 'Pending Approval' : balanceDue === 0 ? 'Paid' : 'Partially Paid',
      priority: 'High',
      quantity: billQty,
      minQuantity: 0,
      rate: taxableValue,
      amount: grandTotal,
      paidAmount: targetCat === 'quotation' ? 0 : billPaidAmt,
      taxAmount: gstAmount,
      discountAmount: billDiscount,
      dateStr: '2026-09-25',
      endDateStr: '2027-09-25',
      assignedTo: 'Ravi Kumar',
      notes: `${billQty} × ₹${billRate} | Install: ₹${billInstallCharge} | Disc: ₹${billDiscount} | GST ${billGstPct}%: ₹${gstAmount}`,
      tags: [`${billQty}x ${selectedStockObj?.gstin || 'Camera'}`, `GST ${billGstPct}%`],
    };

    await onCreateErpItem(newDoc);

    // If Sale, automatically decrease stock quantity
    if (targetCat === 'sale' && selectedStockObj) {
      const nextQty = Math.max(0, selectedStockObj.quantity - billQty);
      await onUpdateErpItem({
        ...selectedStockObj,
        quantity: nextQty,
        status: nextQty <= selectedStockObj.minQuantity ? 'Low Stock' : 'In Stock',
      });
    }

    onPreviewDocument(newDoc);
  };

  const handleQuickCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mapModuleToCategory: Record<string, ErpCategory> = {
      customers: 'customer',
      equipment: 'equipment',
      suppliers: 'supplier',
      stock: 'stock',
      staff: 'staff',
      attendance: 'attendance',
      payment: 'payment',
      cash_bank: 'cash_bank',
      expenses: 'expense',
      installation: 'installation',
      service: 'service',
      amc: 'amc',
      warranty: 'equipment',
    };
    const cat = mapModuleToCategory[activeModule] || 'service';
    const item: ErpItem = {
      id: `${cat}_${Date.now()}`,
      ownerId: 'demo_owner',
      category: cat,
      code: newCode || `${cat.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 899)}`,
      title: newTitle || 'New CCTV Record',
      subtitle: newSubtitle || 'Standard CCTV Operation',
      partyName: newParty || newTitle,
      mobile: newMobile,
      location: newLocation,
      gstin: cat === 'stock' ? 'Camera' : 'VERIFIED',
      status: cat === 'service' || cat === 'installation' ? 'Assigned' : 'Active',
      priority: newPriority,
      quantity: newQty,
      minQuantity: cat === 'stock' ? 5 : 0,
      rate: newRate,
      amount: newAmount,
      paidAmount: cat === 'payment' || cat === 'expense' ? newAmount : 0,
      taxAmount: 0,
      discountAmount: 0,
      dateStr: '2026-09-25',
      endDateStr: '2027-09-25',
      assignedTo: newAssigned,
      notes: `${newSubtitle} • Created via VARAH Admin`,
      tags: [cat.toUpperCase(), newPriority],
    };
    await onCreateErpItem(item);
    setShowQuickCreate(false);
    setNewTitle('');
    setNewSubtitle('');
    setNewCode('');
  };

  const exportCsv = (rows: ErpItem[], filename: string) => {
    const headers = ['Code,Title,Party,Status,Quantity,Amount,Paid,Date,AssignedTo'];
    const csvLines = rows.map(
      (r) =>
        `"${r.code}","${r.title}","${r.partyName}","${r.status}",${r.quantity},${r.amount},${r.paidAmount},"${r.dateStr}","${r.assignedTo}"`
    );
    const blob = new Blob([headers.concat(csvLines).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
  };

  // ================= SALES INVOICE & QUOTATION BUILDER (Sections 5 & 18) =================
  if (activeModule === 'sales' || activeModule === 'quotation') {
    const isQuotation = activeModule === 'quotation';
    const listItems = items.filter((i) =>
      isQuotation ? i.category === 'quotation' : i.category === 'sale'
    );

    return (
      <div className="space-y-6 pb-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                {isQuotation
                  ? 'Quotation / BOQ Estimate Builder (PDF → WhatsApp → Invoice)'
                  : 'GST Sales Invoice Generator (Auto Stock Deduction)'}
              </h2>
              <p className="text-xs text-slate-500">
                Select Customer → Product → Quantity → Rate. Automatically calculates GST, Discount,
                Installation Charges & Balance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Select Customer
              </label>
              <select
                value={billCustomer}
                onChange={(e) => setBillCustomer(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold bg-white"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Select CCTV Product from Stock
              </label>
              <select
                value={billStockSku}
                onChange={(e) => {
                  const sku = e.target.value;
                  setBillStockSku(sku);
                  const found = stockItems.find((s) => s.code === sku);
                  if (found) setBillRate(found.amount);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold bg-white"
              >
                {stockItems.map((s) => (
                  <option key={s.id} value={s.code}>
                    {s.title} (Qty: {s.quantity} • ₹{s.amount})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min={1}
                value={billQty}
                onChange={(e) => setBillQty(Math.max(1, Number(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Unit Sale Rate (₹)
              </label>
              <input
                type="number"
                value={billRate}
                onChange={(e) => setBillRate(Math.max(0, Number(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Installation Charges (₹)
              </label>
              <input
                type="number"
                value={billInstallCharge}
                onChange={(e) => setBillInstallCharge(Math.max(0, Number(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Discount (₹)
              </label>
              <input
                type="number"
                value={billDiscount}
                onChange={(e) => setBillDiscount(Math.max(0, Number(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                GST %
              </label>
              <select
                value={billGstPct}
                onChange={(e) => setBillGstPct(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono bg-white"
              >
                <option value={18}>18% GST (Standard CCTV)</option>
                <option value={12}>12% GST</option>
                <option value={0}>0% Exempt</option>
              </select>
            </div>

            {!isQuotation && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Amount Paid Now (₹)
                </label>
                <input
                  type="number"
                  value={billPaidAmt}
                  onChange={(e) => setBillPaidAmt(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-lg border border-emerald-300 bg-emerald-50/40 text-sm font-mono font-bold text-emerald-800"
                />
              </div>
            )}
          </div>

          {/* Live Calculation Bar */}
          <div className="bg-[#0A1128] text-white rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs w-full md:w-auto">
              <div>
                <div className="text-slate-400">Items + Install</div>
                <div className="font-mono font-bold text-sm mt-0.5">
                  ₹{taxableValue.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <div className="text-slate-400">GST ({billGstPct}%)</div>
                <div className="font-mono font-bold text-sm mt-0.5">
                  ₹{gstAmount.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <div className="text-cyan-300 font-bold">TOTAL AMOUNT</div>
                <div className="font-mono font-extrabold text-lg text-cyan-400">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </div>
              </div>
              {!isQuotation && (
                <div>
                  <div className="text-amber-300 font-bold">BALANCE DUE</div>
                  <div className="font-mono font-extrabold text-lg text-amber-400">
                    ₹{balanceDue.toLocaleString('en-IN')}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() =>
                handleGenerateInvoiceOrQuotation(isQuotation ? 'quotation' : 'sale')
              }
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shrink-0"
            >
              <Printer className="w-4 h-4" />
              {isQuotation
                ? 'Generate Quotation (PDF / WhatsApp)'
                : 'Generate Invoice (PDF / Print / WhatsApp)'}
            </button>
          </div>
        </div>

        {/* Saved Invoices / Quotations List */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {isQuotation ? 'Generated Quotations' : 'Generated GST Sales Invoices'} (
              {listItems.length})
            </span>
          </div>
          <div className="divide-y divide-slate-200">
            {listItems.map((inv) => (
              <div
                key={inv.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600">{inv.code}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      {inv.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{inv.dateStr}</span>
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1">{inv.partyName}</div>
                  <div className="text-xs text-slate-600">{inv.subtitle}</div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <div className="font-mono font-extrabold text-base text-slate-900">
                      ₹{inv.amount.toLocaleString('en-IN')}
                    </div>
                    {!isQuotation && (
                      <div className="text-xs font-mono text-emerald-600">
                        Paid: ₹{inv.paidAmount.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onPreviewDocument(inv)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" /> PDF / WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ================= CASH / BANK MODULE (Section 16) =================
  if (activeModule === 'cash_bank') {
    const payments = items.filter((i) => i.category === 'payment');
    const expenses = items.filter((i) => i.category === 'expense');

    const cashOpening = 48500;
    const cashReceived = payments
      .filter((p) => p.gstin === 'Cash')
      .reduce((s, p) => s + p.amount, 0);
    const cashExpense = expenses
      .filter((e) => e.subtitle.includes('Cash'))
      .reduce((s, e) => s + e.amount, 0);
    const cashClosing = cashOpening + cashReceived - cashExpense;

    const bankOpening = 385000;
    const bankReceived = payments
      .filter((p) => p.gstin !== 'Cash')
      .reduce((s, p) => s + p.amount, 0);
    const bankExpense = expenses
      .filter((e) => !e.subtitle.includes('Cash'))
      .reduce((s, e) => s + e.amount, 0);
    const bankClosing = bankOpening + bankReceived - bankExpense;

    return (
      <div className="space-y-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* CASH BOOK CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                  CASH LEDGER
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Office Cash Drawer Balance
                </h3>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Closing Cash</div>
                <div className="text-2xl font-extrabold font-mono text-emerald-600">
                  ₹{cashClosing.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Opening Balance</span>
                <span className="font-mono font-bold">₹{cashOpening.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-emerald-700">
                <span>+ Cash Received (Sales/Receipts)</span>
                <span className="font-mono font-bold">+₹{cashReceived.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-rose-600">
                <span>- Cash Expense (Tools/Site)</span>
                <span className="font-mono font-bold">-₹{cashExpense.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-extrabold text-slate-900">
                <span>Closing Cash Balance</span>
                <span className="font-mono">₹{cashClosing.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* BANK BOOK CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                  BANK LEDGER (HDFC ••4829)
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Current Bank Account & UPI
                </h3>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Closing Bank Balance</div>
                <div className="text-2xl font-extrabold font-mono text-blue-600">
                  ₹{bankClosing.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Opening Bank Balance</span>
                <span className="font-mono font-bold">₹{bankOpening.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-emerald-700">
                <span>+ UPI / NEFT Receipts</span>
                <span className="font-mono font-bold">+₹{bankReceived.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-rose-600">
                <span>- Bank Payments & Expenses</span>
                <span className="font-mono font-bold">-₹{bankExpense.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-extrabold text-slate-900">
                <span>Closing Bank Balance</span>
                <span className="font-mono">₹{bankClosing.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= REPORTS MODULE (Section 21) =================
  if (activeModule === 'reports') {
    const reportMap: Record<typeof reportTab, ErpItem[]> = {
      sales: items.filter((i) => i.category === 'sale'),
      purchase: items.filter((i) => i.category === 'purchase'),
      stock: items.filter((i) => i.category === 'stock'),
      accounts: items.filter((i) => i.category === 'payment' || i.category === 'expense'),
      staff: items.filter(
        (i) => i.category === 'attendance' || i.category === 'installation' || i.category === 'service'
      ),
    };
    const activeRows = reportMap[reportTab];

    return (
      <div className="space-y-5 pb-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Business Intelligence & GST Reports
              </h2>
              <p className="text-xs text-slate-500">
                Sales, Purchase, Stock Valuation, Accounts Receivable/Payable & Staff Field Reports
              </p>
            </div>
            <button
              onClick={() => exportCsv(activeRows, `varah_${reportTab}_report`)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 self-start"
            >
              <Download className="w-4 h-4 text-cyan-400" /> Export {reportTab.toUpperCase()} CSV
            </button>
          </div>

          <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'sales', label: 'Sales Report (Daily/Monthly/Customer)' },
              { id: 'purchase', label: 'Purchase Report (Supplier/Product)' },
              { id: 'stock', label: 'Stock & Serial Valuation Report' },
              { id: 'accounts', label: 'Accounts (Receivable/Cash/Expenses)' },
              { id: 'staff', label: 'Staff & Service Report' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setReportTab(t.id as typeof reportTab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                  reportTab === t.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                  <th className="py-2.5 px-3">Ref Code</th>
                  <th className="py-2.5 px-3">Title / Description</th>
                  <th className="py-2.5 px-3">Party / Staff</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Qty</th>
                  <th className="py-2.5 px-3 text-right">Value (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activeRows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{r.code}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{r.title}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.partyName}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{r.dateStr}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">{r.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{r.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ================= SETTINGS & ROLE PERMISSIONS MATRIX (Section 23) =================
  if (activeModule === 'settings') {
    const rolesMatrix = [
      {
        role: 'Admin',
        sales: true,
        payment: true,
        reports: true,
        stock: true,
        staff: true,
        service: true,
        settings: true,
      },
      {
        role: 'Accountant',
        sales: true,
        payment: true,
        reports: true,
        stock: false,
        staff: false,
        service: false,
        settings: false,
      },
      {
        role: 'Technician',
        sales: false,
        payment: true,
        reports: false,
        stock: false,
        staff: false,
        service: true,
        settings: false,
      },
      {
        role: 'Installer',
        sales: false,
        payment: true,
        reports: false,
        stock: false,
        staff: false,
        service: true,
        settings: false,
      },
      {
        role: 'Store Manager',
        sales: false,
        payment: false,
        reports: true,
        stock: true,
        staff: false,
        service: false,
        settings: false,
      },
      {
        role: 'Service Manager',
        sales: false,
        payment: true,
        reports: true,
        stock: true,
        staff: true,
        service: true,
        settings: false,
      },
    ];

    return (
      <div className="space-y-6 pb-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Role & User Permission Matrix (Section 23)
              </h2>
              <p className="text-xs text-slate-500">
                Granular module access control for Admin, Accountant, Technician, Installer & Store Manager
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white uppercase">
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-3 text-center">Sales</th>
                  <th className="py-3 px-3 text-center">Payment Collection</th>
                  <th className="py-3 px-3 text-center">Install & Service</th>
                  <th className="py-3 px-3 text-center">Stock</th>
                  <th className="py-3 px-3 text-center">Staff</th>
                  <th className="py-3 px-3 text-center">Reports</th>
                  <th className="py-3 px-3 text-center">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rolesMatrix.map((r) => (
                  <tr key={r.role} className="hover:bg-slate-50 font-semibold">
                    <td className="py-3 px-4 font-bold text-slate-900">{r.role}</td>
                    <td className="py-3 px-3 text-center">{r.sales ? '✔' : '❌'}</td>
                    <td className="py-3 px-3 text-center">{r.payment ? '✔' : '❌'}</td>
                    <td className="py-3 px-3 text-center">{r.service ? '✔' : '❌'}</td>
                    <td className="py-3 px-3 text-center">{r.stock ? '✔' : '❌'}</td>
                    <td className="py-3 px-3 text-center">{r.staff ? '✔' : '❌'}</td>
                    <td className="py-3 px-3 text-center">{r.reports ? '✔' : '❌'}</td>
                    <td className="py-3 px-3 text-center">{r.settings ? '✔' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ================= UNIFIED LIST & ACTION VIEW FOR REMAINING MODULES =================
  const moduleConfig: Record<
    string,
    { title: string; subtitle: string; cat: ErpCategory; actionBtn: string }
  > = {
    purchase: {
      title: 'Purchase Invoices & AI OCR Verification (Section 4)',
      subtitle: 'Scan supplier GST bills via mobile camera → Verify OCR → Auto-increase Stock',
      cat: 'purchase',
      actionBtn: 'Scan Supplier Invoice (OCR)',
    },
    customers: {
      title: 'Customer Directory & 360° Site History (Section 6)',
      subtitle: 'Click any customer to view their Sales, Payments, Installations, AMC & Installed CCTV Assets',
      cat: 'customer',
      actionBtn: '+ Add Customer',
    },
    equipment: {
      title: 'CCTV Equipment / Site Asset Registry (Section 7)',
      subtitle: 'Customer-wise installed Camera, NVR & HDD serial numbers, locations & active warranties',
      cat: 'equipment',
      actionBtn: '+ Register Site Equipment',
    },
    stock: {
      title: 'CCTV Stock & Serial Inventory Management (Section 8)',
      subtitle: 'Track Camera, DVR, NVR, HDD, Cable, SMPS, BNC, POE Switch, Rack & Serial Numbers',
      cat: 'stock',
      actionBtn: '+ Add Stock Product',
    },
    suppliers: {
      title: 'CCTV Distributors & Suppliers Ledger',
      subtitle: 'Manage Prama Hikvision, CP Plus, Dahua & wholesale payables',
      cat: 'supplier',
      actionBtn: '+ Add Supplier',
    },
    staff: {
      title: 'Staff Management & Roles (Section 9)',
      subtitle: 'Technicians, Installers, Sales, Accountant, Store Manager & Service Manager',
      cat: 'staff',
      actionBtn: '+ Add Staff Member',
    },
    attendance: {
      title: 'GPS + Selfie Field Attendance Log (Section 10)',
      subtitle: 'Real-time verification of technician check-in time, selfie & customer site GPS coordinates',
      cat: 'attendance',
      actionBtn: '+ Log Attendance',
    },
    installation: {
      title: 'Installation Jobs & Site Handover (Sections 11 & 12)',
      subtitle: 'Assign technicians, track cameras/NVR/cable used, capture site photos & customer signature',
      cat: 'installation',
      actionBtn: '+ Create Installation Job',
    },
    service: {
      title: 'Service Calls & Complaint Management (Sections 13 & 14)',
      subtitle: 'Pipeline: New → Assigned → On Way → In Progress → Completed → Closed',
      cat: 'service',
      actionBtn: '+ New Service Call',
    },
    payment: {
      title: 'Payment / Receipt Collection (Section 15)',
      subtitle: 'Collect Cash, UPI, Bank NEFT or Cheque against invoices & share WhatsApp PDF Receipt',
      cat: 'payment',
      actionBtn: '+ Collect Payment / Receipt',
    },
    expenses: {
      title: 'Field & Office Expense Management (Section 17)',
      subtitle: 'Track Petrol, Travel, Courier, Office, Electricity, Repair & Tools with bill photo',
      cat: 'expense',
      actionBtn: '+ Add Expense',
    },
    amc: {
      title: 'AMC (Annual Maintenance Contract) Management (Section 20)',
      subtitle: 'Track AMC validity, preventive visit schedules, covered cameras & renewal alerts',
      cat: 'amc',
      actionBtn: '+ New AMC Contract',
    },
    warranty: {
      title: 'Equipment Warranty Tracker & Expiry Alerts (Section 19)',
      subtitle: 'Tracks Purchase Date, Sale Date, Installation Date, Warranty Start & Warranty End',
      cat: 'equipment',
      actionBtn: '+ Log Warranty Item',
    },
    notifications: {
      title: 'Notification Center & Business Alerts (Section 22)',
      subtitle: '🔴 Low Stock • 🟠 Payment Due • 🟠 Service Pending • 🟢 Job Completed • 🔵 New Purchase',
      cat: 'notification',
      actionBtn: '+ Broadcast Alert',
    },
  };

  const currentCfg = moduleConfig[activeModule] || moduleConfig.service;
  const filteredRows = items
    .filter((i) => i.category === currentCfg.cat)
    .filter((i) => {
      if (activeModule === 'stock' && stockFilter !== 'All') {
        return i.gstin.toLowerCase() === stockFilter.toLowerCase();
      }
      return true;
    })
    .filter((i) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        i.title.toLowerCase().includes(q) ||
        i.code.toLowerCase().includes(q) ||
        i.partyName.toLowerCase().includes(q) ||
        i.subtitle.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-5 pb-24">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">{currentCfg.title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{currentCfg.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          {activeModule === 'purchase' ? (
            <button
              onClick={onOpenOcrScanner}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Camera className="w-4 h-4" /> Scan Invoice (AI OCR)
            </button>
          ) : (
            <button
              onClick={() => setShowQuickCreate(!showQuickCreate)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> {currentCfg.actionBtn}
            </button>
          )}
        </div>
      </div>

      {/* Quick Create Drawer */}
      {showQuickCreate && (
        <form
          onSubmit={handleQuickCreateSubmit}
          className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-blue-900">
              Create New Record in {currentCfg.title}
            </span>
            <button
              type="button"
              onClick={() => setShowQuickCreate(false)}
              className="text-xs font-bold text-slate-500"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Title / Name / Problem (e.g. Camera 4 Not Working)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold"
            />
            <input
              type="text"
              placeholder="Model / Role / Details (e.g. Hikvision 2MP)"
              value={newSubtitle}
              onChange={(e) => setNewSubtitle(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
            />
            <input
              type="text"
              placeholder="Customer / Supplier Name"
              value={newParty}
              onChange={(e) => setNewParty(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
            />
            <input
              type="text"
              placeholder="Code / Serial / SKU (e.g. ABC125)"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-mono"
            />
            <input
              type="text"
              placeholder="Site Location / Address"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
            />
            <select
              value={newAssigned}
              onChange={(e) => setNewAssigned(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold"
            >
              {staffMembers.map((s) => (
                <option key={s.id} value={s.title}>
                  Assign: {s.title} ({s.subtitle})
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={newQty}
              onChange={(e) => setNewQty(Number(e.target.value) || 1)}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-mono"
            />
            <input
              type="number"
              placeholder="Amount / Sale Rate (₹)"
              value={newAmount}
              onChange={(e) => setNewAmount(Number(e.target.value) || 0)}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-mono"
            />
            <button
              type="submit"
              className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm"
            >
              Save Record
            </button>
          </div>
        </form>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Customer, Serial Number, SKU, Invoice or Location..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:border-blue-600 focus:outline-none"
          />
        </div>

        {activeModule === 'stock' && (
          <div className="flex overflow-x-auto gap-1.5 pb-1">
            {STOCK_CATEGORIES.slice(0, 8).map((cat) => (
              <button
                key={cat}
                onClick={() => setStockFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                  stockFilter === cat
                    ? 'bg-[#0A1128] text-cyan-300'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Records List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredRows.map((row) => {
          const isLowStock =
            row.category === 'stock' && row.quantity <= row.minQuantity;

          return (
            <div
              key={row.id}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-400 transition shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {row.code}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isLowStock || row.status.includes('Expiring') || row.priority === 'High'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isLowStock ? '🔴 Low Stock' : row.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{row.dateStr}</span>
                </div>

                <div className="text-base font-bold text-slate-900">{row.title}</div>
                <div className="text-xs text-slate-600">{row.subtitle}</div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  {row.partyName && (
                    <span>
                      Party: <strong className="text-slate-700">{row.partyName}</strong>
                    </span>
                  )}
                  {row.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> {row.location}
                    </span>
                  )}
                  {row.assignedTo && (
                    <span>
                      Staff: <strong className="text-slate-700">{row.assignedTo}</strong>
                    </span>
                  )}
                </div>

                {row.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {row.tags.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[11px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Contextual Right-Side Actions */}
              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                {row.category === 'stock' && (
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Available Qty</div>
                    <div
                      className={`text-xl font-extrabold font-mono ${
                        isLowStock ? 'text-rose-600' : 'text-slate-900'
                      }`}
                    >
                      {row.quantity} Units
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">
                      Buy: ₹{row.rate} • Sell: ₹{row.amount}
                    </div>
                  </div>
                )}

                {row.amount > 0 && row.category !== 'stock' && (
                  <div className="text-right">
                    <div className="font-mono font-extrabold text-base text-slate-900">
                      ₹{row.amount.toLocaleString('en-IN')}
                    </div>
                    {row.paidAmount > 0 && (
                      <div className="text-xs font-mono text-emerald-600">
                        Paid: ₹{row.paidAmount.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                )}

                {row.category === 'customer' && (
                  <button
                    onClick={() => onSelectCustomer360(row)}
                    className="px-3.5 py-2 rounded-xl bg-[#0A1128] hover:bg-slate-800 text-cyan-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Cpu className="w-3.5 h-3.5" /> 360° History & CCTV Assets
                  </button>
                )}

                {(row.category === 'installation' || row.category === 'service') && (
                  <button
                    onClick={() => onOpenJobExecution(row)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Wrench className="w-3.5 h-3.5" /> Execute / Sign
                  </button>
                )}

                {row.category === 'payment' && (
                  <button
                    onClick={() => onPreviewDocument(row)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Receipt PDF
                  </button>
                )}

                {row.category === 'notification' && row.location && (
                  <button
                    onClick={() => onNavigateModule(row.location as AdminModuleId)}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold flex items-center gap-1"
                  >
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
