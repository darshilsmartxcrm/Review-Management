export type LanguageCode = 'en' | 'hi' | 'gu';

export type IndustryKey =
  | 'surgical_medical'
  | 'healthcare'
  | 'restaurant'
  | 'salon'
  | 'automobile'
  | 'electronics'
  | 'realestate'
  | 'fashion'
  | 'fitness'
  | 'education'
  | 'furniture'
  | 'legal_finance'
  | 'general';

export interface IndustryCategory {
  id: IndustryKey;
  name: string;
  icon: string;
  categoryPhrase: {
    en: string;
    hi: string;
    gu: string;
  };
  defaultProducts: string[];
}

export interface Client {
  id: string;
  name: string;
  person_name?: string;
  category: IndustryKey;
  city: string;
  google_url: string;
  phone: string;
  keywords: string;
  default_lang: LanguageCode;
  createdAt: string;
  start_date?: string;  // YYYY-MM-DD start validity date
  expiry_date?: string; // YYYY-MM-DD end validity date
}

export type ClientAccessStatus = 'active' | 'upcoming' | 'expired';

export interface Lead {
  id: string;
  name: string;
  business: string;
  city: string;
  industry: string;
  phone: string;
  date: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}
