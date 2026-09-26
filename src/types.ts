export type ErpCategory =
  | 'customer'
  | 'supplier'
  | 'stock'
  | 'purchase'
  | 'sale'
  | 'quotation'
  | 'installation'
  | 'service'
  | 'equipment'
  | 'amc'
  | 'payment'
  | 'expense'
  | 'staff'
  | 'attendance'
  | 'notification'
  | 'permission'
  | 'cash_bank'
  | 'work_report';

export interface ErpItem {
  id: string;
  ownerId: string;
  category: ErpCategory;
  code: string;         // SKU, Invoice No, Serial No, Job ID, Receipt No
  title: string;        // Customer Name, Product Name, Staff Name, Alert Title
  subtitle: string;     // Brand/Model, Problem description, Role, Payment Mode
  partyName: string;    // Linked Customer / Supplier / Staff Name
  mobile: string;       // Contact phone
  location: string;     // Site Address, Camera Location, or GPS coordinates
  gstin: string;        // GSTIN or Reference ID
  status: string;       // Active, Pending, Assigned, On Way, In Progress, Completed, Closed, Approved, Low Stock
  priority: string;     // High, Medium, Low, Normal
  quantity: number;     // Stock Qty, Visits count, Items count
  minQuantity: number;  // Minimum Stock threshold or Completed visits
  rate: number;         // Purchase Rate or Unit Rate
  amount: number;       // Sale Rate, Total Invoice Amount, Salary, Expense Amount
  paidAmount: number;   // Paid / Collected Amount
  taxAmount: number;    // GST Amount
  discountAmount: number; // Discount or Installation charges
  dateStr: string;      // Primary Date / Time
  endDateStr: string;   // Warranty End Date / AMC End Date / Check-out Time
  assignedTo: string;   // Assigned Staff Name
  notes: string;        // Detailed summary, work done, items breakdown, or signature state
  tags: string[];       // Up to 10 strings: serial numbers, line items, or permissions
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type AdminModuleId =
  | 'dashboard'
  | 'purchase'
  | 'sales'
  | 'customers'
  | 'equipment'
  | 'suppliers'
  | 'stock'
  | 'staff'
  | 'attendance'
  | 'payment'
  | 'cash_bank'
  | 'expenses'
  | 'quotation'
  | 'installation'
  | 'service'
  | 'amc'
  | 'warranty'
  | 'reports'
  | 'notifications'
  | 'settings';

export type StaffTabId =
  | 'my_dashboard'
  | 'attendance'
  | 'installations'
  | 'service_calls'
  | 'payments'
  | 'work_report'
  | 'notifications'
  | 'profile';

export interface OcrLineItem {
  product: string;
  brand: string;
  model: string;
  quantity: number;
  rate: number;
  discount: number;
  gstPercent: number;
  total: number;
  serialNumbers: string[];
}

export interface OcrInvoiceData {
  supplier: string;
  invoiceNumber: string;
  date: string;
  gstin: string;
  items: OcrLineItem[];
  grandTotal: number;
}
