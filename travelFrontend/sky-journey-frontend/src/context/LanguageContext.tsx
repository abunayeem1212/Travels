import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

type Language = 'en' | 'bn';

type TranslationTree = string | { [key: string]: TranslationTree };

const translations: Record<Language, TranslationTree> = {
  en: {
    nav: {
      home: 'Home',
      tourPackages: 'Tour Packages',
      hotels: 'Hotels',
      gallery: 'Gallery',
      contact: 'Contact',
      search: 'Search',
      login: 'Login',
      adminPanel: 'Admin Panel',
    },
    hero: {
      welcome: 'Explore Bangladesh with The Friendship Tours & Travels',
      subtitle: 'Your trusted travel partner for unforgettable holidays.',
      browse: 'Browse Packages',
    },
    home: {
      popularPackages: 'Popular Tour Packages',
      packagesDescription: 'Explore the best of Bangladesh with our handpicked tour packages',
      ourHotels: 'Our Hotels',
      hotelsDescription: 'Comfortable and affordable hotels across Bangladesh',
      noResults: 'No results found. Try another search.',
      aboutTitle: 'Why Travel with The Friendship Tours & Travels?',
      aboutDescription: 'A local team dedicated to crafting safe, memorable, and value-packed tours for every traveler.',
      featureTrusted: 'Trusted local guides',
      featureFlexible: 'Flexible packages',
      featureSupport: '24/7 travel support',
      featureSustainable: 'Sustainable travel focus',
      contactTitle: 'Contact Us',
    },
    banner: {
      offer: 'Limited time offer! Save up to 30% on selected packages.',
      bookNow: 'Book Now',
      daysLeft: 'Days left',
    },
    cookie: {
      message: 'We use cookies to improve your browsing experience. By continuing, you accept our cookie policy.',
      accept: 'Accept',
    },
    footer: {
      quickLinks: 'Quick Links',
      popularDestinations: 'Popular Destinations',
      contactUs: 'Contact Us',
      rights: 'All rights reserved.',
      developed: 'Designed & Developed with ❤️ in Bangladesh',
    },
    contact: {
      getInTouch: 'Get In Touch',
      name: 'Name *',
      phone: 'Phone *',
      email: 'Email',
      subject: 'Subject',
      message: 'Message *',
      sendMessage: 'Send Message',
      sending: 'Sending...',
      fillRequired: 'Please fill required fields',
      success: 'Message sent successfully!',
      failure: 'Failed to send message. Try again.',
    },
    searchPage: {
      title: 'Search Packages & Hotels',
      placeholder: 'Search by name, location or experience',
      noResults: 'No packages or hotels match your search.',
    },
  },
  bn: {
    nav: {
      home: 'হোম',
      tourPackages: 'ট্যুর প্যাকেজ',
      hotels: 'হোটেল',
      gallery: 'গ্যালারি',
      contact: 'যোগাযোগ',
      search: 'সার্চ',
      login: 'লগইন',
      adminPanel: 'অ্যাডমিন প্যানেল',
    },
    hero: {
      welcome: 'স্কাইজার্নির সাথে আবিষ্কার করুন বাংলাদেশ',
      subtitle: 'আপনার অবিস্মরণীয় ছুটির জন্য আপনার বিশ্বস্ত ভ্রমণ সহযোগী।',
      browse: 'প্যাকেজ দেখুন',
    },
    home: {
      popularPackages: 'জনপ্রিয় ট্যুর প্যাকেজ',
      packagesDescription: 'বাংলাদেশের সেরা জায়গা আমাদের নির্বাচিত ট্যুর প্যাকেজের সাথে আবিষ্কার করুন',
      ourHotels: 'আমাদের হোটেল',
      hotelsDescription: 'বাংলাদেশ জুড়ে আরামদায়ক ও সাশ্রয়ী হোটেল',
      noResults: 'কোন ফলাফল পাওয়া যায়নি। অন্য একবার চেষ্টা করুন।',
      aboutTitle: 'কেন The Friendship Tours & Travels-এর সাথে ভ্রমণ করবেন?',
      aboutDescription: 'একটি স্থানীয় দল যা প্রতিটি ভ্রমণকারীর জন্য নিরাপদ, স্মরণীয় এবং মানসম্মত ট্যুর তৈরি করে।',
      featureTrusted: 'বিশ্বস্ত গাইড',
      featureFlexible: 'নমনীয় প্যাকেজ',
      featureSupport: '২৪/৭ সহায়তা',
      featureSustainable: 'টেকসই ভ্রমণ',
      contactTitle: 'যোগাযোগ করুন',
    },
    banner: {
      offer: 'সীমিত সময়ের অফার! নির্বাচিত প্যাকেজে ৩০% পর্যন্ত ছাড়।',
      bookNow: 'এখনই বুক করুন',
      daysLeft: 'দিন বাকি',
    },
    cookie: {
      message: 'আমরা আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে কুকি ব্যবহার করি। চালিয়ে গেলে, আপনি আমাদের কুকি নীতিতে সম্মতি দিচ্ছেন।',
      accept: 'মেনে নিন',
    },
    footer: {
      quickLinks: 'দ্রুত লিঙ্ক',
      popularDestinations: 'জনপ্রিয় গন্তব্য',
      contactUs: 'যোগাযোগ',
      rights: 'সর্বস্বত্ব সংরক্ষিত।',
      developed: 'বাংলাদেশে ❤️ সহ ডিজাইন ও ডেভেলপ করা হয়েছে',
    },
    contact: {
      getInTouch: 'যোগাযোগ করুন',
      name: 'নাম *',
      phone: 'ফোন *',
      email: 'ইমেল',
      subject: 'বিষয়',
      message: 'বার্তা *',
      sendMessage: 'বার্তা পাঠান',
      sending: 'পাঠানো হচ্ছে...',
      fillRequired: 'দয়া করে প্রয়োজনীয় ক্ষেত্র পূরণ করুন',
      success: 'বার্তা সফলভাবে পাঠানো হয়েছে!',
      failure: 'বার্তা পাঠাতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
    },
    searchPage: {
      title: 'প্যাকেজ ও হোটেল অনুসন্ধান করুন',
      placeholder: 'নাম, অবস্থান বা অভিজ্ঞতা অনুসারে অনুসন্ধান করুন',
      noResults: 'আপনার অনুসন্ধানে কোনও প্যাকেজ বা হোটেল মেলে না।',
    },
  },
};

interface LanguageContextValue {
  lang: Language;
  setLanguage: (value: Language) => void;
  t: (keyPath: string) => string;
  isBangla: boolean;        // ← এটা add করো
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
const STORAGE_KEY = 'skyjourney-language';

function getValue(tree: TranslationTree, path: string[]) {
  return path.reduce<string | TranslationTree | undefined>((current, key) => {
    if (typeof current === 'object' && current !== null) {
      return (current as Record<string, TranslationTree>)[key];
    }
    return undefined;
  }, tree) as string | undefined;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === 'bn' || saved === 'en') {
      setLang(saved);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const t = useCallback((keyPath: string) => {
    const path = keyPath.split('.');
    const value = getValue(translations[lang], path);
    if (typeof value === 'string') return value;
    return keyPath;
  }, [lang]);

  const toggleLanguage = useCallback(() => {
  setLang(prev => (prev === 'en' ? 'bn' : 'en'));
}, []);

  const value = useMemo(
  () => ({
    lang,
    setLanguage: setLang,
    t,
    isBangla: lang === 'bn',
    toggleLanguage,
  }),
  [lang, t, toggleLanguage]
);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}

export function useTranslation() {
  return useLanguage();
}
