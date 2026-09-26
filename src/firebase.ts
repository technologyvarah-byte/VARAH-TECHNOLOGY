import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { ErpItem } from './types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Defensive payload sanitizer matching firebase-blueprint.json & firestore.rules
function sanitizeId(raw: string): string {
  const cleaned = (raw || 'item_1').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  return cleaned.length > 0 ? cleaned : 'item_1';
}

function clampStr(val: string | undefined, max: number, min = 0, fallback = ''): string {
  const str = (val ?? fallback).trim().slice(0, max);
  if (min > 0 && str.length === 0) {
    return fallback.slice(0, max) || 'N/A';
  }
  return str;
}

function clampNum(val: number | undefined, max = 100000000): number {
  const n = Number(val);
  if (Number.isNaN(n) || n < 0) return 0;
  return Math.min(n, max);
}

export function sanitizeErpPayload(item: ErpItem, uid: string) {
  const safeTags = Array.isArray(item.tags)
    ? item.tags
        .slice(0, 10)
        .map((t) => String(t || '').slice(0, 200))
        .filter((t) => t.length > 0)
    : [];

  return {
    id: sanitizeId(item.id),
    ownerId: sanitizeId(uid),
    category: item.category,
    code: clampStr(item.code, 100, 1, 'CODE-01'),
    title: clampStr(item.title, 200, 1, 'Untitled Record'),
    subtitle: clampStr(item.subtitle, 300, 0, ''),
    partyName: clampStr(item.partyName, 200, 0, ''),
    mobile: clampStr(item.mobile, 30, 0, ''),
    location: clampStr(item.location, 500, 0, ''),
    gstin: clampStr(item.gstin, 30, 0, ''),
    status: clampStr(item.status, 50, 1, 'Active'),
    priority: clampStr(item.priority, 30, 1, 'Normal'),
    quantity: clampNum(item.quantity, 1000000),
    minQuantity: clampNum(item.minQuantity, 1000000),
    rate: clampNum(item.rate, 100000000),
    amount: clampNum(item.amount, 100000000),
    paidAmount: clampNum(item.paidAmount, 100000000),
    taxAmount: clampNum(item.taxAmount, 100000000),
    discountAmount: clampNum(item.discountAmount, 100000000),
    dateStr: clampStr(item.dateStr, 40, 1, '2026-09-25'),
    endDateStr: clampStr(item.endDateStr, 40, 0, ''),
    assignedTo: clampStr(item.assignedTo, 200, 0, ''),
    notes: clampStr(item.notes, 2000, 0, ''),
    tags: safeTags,
  };
}

export async function createErpItemInFirestore(item: ErpItem): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  const sanitized = sanitizeErpPayload(item, user.uid);
  const path = `erp_items/${sanitized.id}`;
  try {
    await setDoc(doc(db, 'erp_items', sanitized.id), {
      ...sanitized,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateErpItemInFirestore(item: ErpItem): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  const sanitized = sanitizeErpPayload(item, user.uid);
  const path = `erp_items/${sanitized.id}`;
  try {
    const { id: _id, ownerId: _ownerId, category: _category, ...mutableFields } = sanitized;
    await updateDoc(doc(db, 'erp_items', sanitized.id), {
      ...mutableFields,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteErpItemFromFirestore(itemId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  const safeId = sanitizeId(itemId);
  const path = `erp_items/${safeId}`;
  try {
    await deleteDoc(doc(db, 'erp_items', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export {
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  collection,
  query,
  where,
  onSnapshot,
};
export type { User };
