import { Client, Lead, AdminCredentials } from './types';
import { DEFAULT_CLIENTS } from './data';
import { API_BASE_URL, getAuthToken, setAuthToken, clearAuthToken } from '../api/client';

export { API_BASE_URL, getAuthToken, setAuthToken, clearAuthToken };

// In-memory runtime cache (prevents writing sensitive/large business data to localStorage)
let memoryClients: Client[] = [...DEFAULT_CLIENTS];
let memoryLeads: Lead[] = [];
let memoryAgencyPhone = '919876543210';
let memoryUsedReviews: { clientId: string; reviewText: string; timestamp: number }[] = [];

// Clean up legacy localStorage keys on startup so client-side storage is empty
export function purgeLegacyLocalStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('review_growth_hub_clients_v3');
    localStorage.removeItem('review_growth_hub_leads_v1');
    localStorage.removeItem('rgh_admin_creds_v1');
    localStorage.removeItem('rgh_agency_contact_number_v1');
    localStorage.removeItem('rgh_used_reviews_lock_v1');
    localStorage.removeItem('rgh_admin_session_v1');
  } catch {}
}

if (typeof window !== 'undefined') {
  purgeLegacyLocalStorage();
}

export function getStoredClients(): Client[] {
  return memoryClients;
}

export function saveStoredClients(clients: Client[]): void {
  memoryClients = clients;
  if (typeof window === 'undefined') return;
  try {
    const token = getAuthToken();
    fetch(`${API_BASE_URL}/api/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(clients),
    }).catch(() => {});
  } catch (e) {
    console.error('Failed to sync clients with API', e);
  }
}

export function getStoredLeads(): Lead[] {
  return memoryLeads;
}

export function saveStoredLeads(leads: Lead[]): void {
  memoryLeads = leads;
}

export function getAdminCredentials(): AdminCredentials {
  return { username: 'admin', password: 'admin@123' };
}

export function saveAdminCredentials(creds: AdminCredentials): void {
  // Passwords are stored securely in MongoDB (hashed with bcrypt), never in plaintext localStorage
}

export function isUserAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(getAuthToken());
}

export function setSessionAuthenticated(remember: boolean): void {
  // Session is tracked via JWT token in client.ts
}

export function clearSessionAuth(): void {
  clearAuthToken();
}

export const DEFAULT_AGENCY_PHONE = '919876543210';

export function getAgencyContactNumber(): string {
  return memoryAgencyPhone;
}

export function saveAgencyContactNumber(phone: string): void {
  const clean = phone.trim();
  memoryAgencyPhone = clean;
  if (typeof window === 'undefined') return;
  try {
    const token = getAuthToken();
    fetch(`${API_BASE_URL}/api/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ agencyPhone: clean }),
    }).catch(() => {});
  } catch (e) {
    console.error('Failed to save agency phone', e);
  }
}

// 24-Hour Review Locking System (Synchronized directly with MongoDB backend)
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export function getUsedReviewsLocal(clientId: string): string[] {
  const now = Date.now();
  const active = memoryUsedReviews.filter(
    (item) => item.clientId === clientId && now - item.timestamp <= TWENTY_FOUR_HOURS_MS
  );
  return active.map((item) => item.reviewText);
}

export async function markReviewUsed(clientId: string, reviewText: string): Promise<void> {
  if (!reviewText || !clientId) return;
  const now = Date.now();
  memoryUsedReviews = [
    { clientId, reviewText: reviewText.trim(), timestamp: now },
    ...memoryUsedReviews.filter((item) => now - item.timestamp <= TWENTY_FOUR_HOURS_MS),
  ];

  if (typeof window === 'undefined') return;
  try {
    await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, reviewText: reviewText.trim() }),
    });
  } catch (e) {
    console.error('Failed to mark review as used on server:', e);
  }
}

export async function fetchServerUsedReviews(clientId: string): Promise<string[]> {
  const local = getUsedReviewsLocal(clientId);
  if (typeof window === 'undefined' || !clientId) return local;

  try {
    const res = await fetch(`${API_BASE_URL}/api/reviews?clientId=${encodeURIComponent(clientId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.usedReviews)) {
        const now = Date.now();
        const serverReviews: string[] = data.usedReviews;
        serverReviews.forEach((txt) => {
          if (!memoryUsedReviews.some((v) => v.clientId === clientId && v.reviewText === txt)) {
            memoryUsedReviews.push({ clientId, reviewText: txt, timestamp: now });
          }
        });
        return Array.from(new Set([...local, ...serverReviews]));
      }
    }
  } catch (err) {
    console.warn('Could not fetch remote used reviews:', err);
  }

  return local;
}
