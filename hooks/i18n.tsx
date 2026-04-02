// i18n.ts: Simple language context for English/Nepali
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from "react";

type TranslationKeys =
  | "welcome"
  | "namaste"
  | "journey"
  | "himalayas"
  | "email"
  | "password"
  | "forgotPassword"
  | "login"
  | "signup"
  | "dontHaveAccount"
  | "terms"
  | "termsOfService"
  | "privacyPolicy"
  | string;

type Language = "en" | "np";

const translations: Record<Language, Record<TranslationKeys, string>> = {
  en: {
    welcome: "WELCOME BACK",
    namaste: "Namaste",
    journey: "Begin your journey into",
    himalayas: "the Himalayas",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    login: "Login",
    signup: "Sign Up",
    dontHaveAccount: "Don't have an account? ",
    terms: "By continuing you agree to our",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",

    // Home
    greeting: "Namaste",
    welcomeBack: "Welcome back, ",
    discoverTitle: "Discover Nepal's",
    discoverSubtitle: "Cultural Heritage",
    discoverDesc: "Explore ancient sites and museums that tell the story of Nepal's rich history and traditions",
    heritageSites: "Heritage Sites",
    heritageSubtitle: "Nepal Heritage Sites",
    museums: "Museums",
    museumsSubtitle: "Art & Culture Collections",
    viewAll: "View All",
    heritageBadge: "Heritage",
    museumBadge: "Museum",
    loading: "Loading...",

    // Common Actions
    search: "Search...",
    searchPlaceholder: "Search museums, sites...",
    map: "In-App Map",
    googleMaps: "Google Maps",
    bookTicket: "Book Ticket",
    leaveReview: "Leave Review",
    edit: "Edit",
    delete: "Delete",
    submit: "Submit",
    cancel: "Cancel",
    close: "Close",
    save: "Save Changes",

    // Museum/Site Forms & Details
    name: "Name",
    description: "Description",
    openingHours: "Opening Hours",
    gpsCoordinates: "GPS Coordinates",
    museumImage: "Museum Image",
    siteImage: "Site Image",
    tapToSelect: "Tap to select image",
    changeImage: "Change Image",
    selectLocation: "Select Location",
    confirmLocation: "Confirm Location",

    // Profile
    accountOverview: "Account Overview",
    accountInfo: "Account Information",
    bookings: "Bookings",
    reviews: "Reviews",
    visited: "Visited",
    myReviews: "My Reviews",
    preferences: "Preferences",
    language: "Language",
    paymentHistory: "Payment History",
    security: "Security & Privacy",
    notifications: "Notifications",
    help: "Help & Support",
    logOut: "Log Out",
    editProfile: "Edit Profile",
    uploadImage: "Upload image",

    // Alerts/Messages
    success: "Success",
    error: "Error",
    profileUpdated: "Profile updated successfully",
    confirmDelete: "Are you sure you want to delete this item?",
    noItemsFound: "No items found",
  },
  np: {
    welcome: "फेरि स्वागत छ",
    namaste: "नमस्ते",
    journey: "आफ्नो यात्रा सुरु गर्नुहोस्",
    himalayas: "हिमालय",
    email: "इमेल",
    password: "पासवर्ड",
    forgotPassword: "पासवर्ड बिर्सनुभयो?",
    login: "लगइन",
    signup: "साइन अप",
    dontHaveAccount: "खाता छैन? ",
    terms: "जारी राखेर तपाईं हाम्रो सहमत हुनुहुन्छ",
    termsOfService: "सेवा सर्तहरू",
    privacyPolicy: "गोपनीयता नीति",

    // Home
    greeting: "नमस्ते",
    welcomeBack: "फेरि स्वागत छ, ",
    discoverTitle: "नेपालको सांस्कृतिक",
    discoverSubtitle: "सम्पदा अन्वेषण गर्नुहोस्",
    discoverDesc: "नेपालको समृद्ध इतिहास र परम्परा बोकेका प्राचीन स्थल र संग्रहालयहरू घुम्नुहोस्",
    heritageSites: "सम्पदा स्थलहरू",
    heritageSubtitle: "नेपालका सम्पदा स्थलहरू",
    museums: "संग्रहालयहरू",
    museumsSubtitle: "कला र संस्कृति संग्रह",
    viewAll: "सबै हेर्नुहोस्",
    heritageBadge: "सम्पदा",
    museumBadge: "संग्रहालय",
    loading: "लोड हुँदैछ...",

    // Common Actions
    search: "खोज्नुहोस्...",
    searchPlaceholder: "संग्रहालय, स्थलहरू खोज्नुहोस्...",
    map: "नक्सा",
    googleMaps: "गुगल नक्सा",
    bookTicket: "टिकट बुक गर्नुहोस्",
    leaveReview: "प्रतिक्रिया दिनुहोस्",
    edit: "सम्पादन",
    delete: "हटाउनुहोस्",
    submit: "बुझाउनुहोस्",
    cancel: "रद्द गर्नुहोस्",
    close: "बन्द गर्नुहोस्",
    save: "परिवर्तनहरू सुरक्षित गर्नुहोस्",

    // Museum/Site Forms & Details
    name: "नाम",
    description: "विवरण",
    openingHours: "खुल्ने समय",
    gpsCoordinates: "GPS निर्देशांक",
    museumImage: "संग्रहालयको तस्बिर",
    siteImage: "स्थलको तस्बिर",
    tapToSelect: "तस्बिर छान्नुहोस्",
    changeImage: "तस्बिर परिवर्तन गर्नुहोस्",
    selectLocation: "स्थान चयन गर्नुहोस्",
    confirmLocation: "स्थान निश्चित गर्नुहोस्",

    // Profile
    accountOverview: "खाता विवरण",
    accountInfo: "खाता जानकारी",
    bookings: "बुकिङहरू",
    reviews: "प्रतिक्रियाहरू",
    visited: "भ्रमण गरिएको",
    myReviews: "मेरा प्रतिक्रियाहरू",
    preferences: "प्राथमिकताहरू",
    language: "भाषा",
    paymentHistory: "भुक्तानी इतिहास",
    security: "सुरक्षा र गोपनीयता",
    notifications: "सूचनाहरू",
    help: "सहयोग र समर्थन",
    logOut: "लग आउट",
    editProfile: "प्रोफाइल सम्पादन",
    uploadImage: "तस्बिर अपलोड गर्नुहोस्",

    // Alerts/Messages
    success: "सफल",
    error: "त्रुटि",
    profileUpdated: "प्रोफाइल सफलतापूर्वक अद्यावधिक गरियो",
    confirmDelete: "के तपाइँ यो वस्तु लिन निश्चित हुनुहुन्छ?",
    noItemsFound: "कुनै वस्तु फेला परेन",
  }
};

const LanguageContext = createContext({
  language: "en",
  setLanguage: (lang: "en" | "np") => { },
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<"en" | "np">("en");

  useEffect(() => {
    AsyncStorage.getItem('appLanguage').then((lang) => {
      if (lang === 'np' || lang === 'en') setLanguageState(lang);
    });
  }, []);

  const setLanguage = (lang: "en" | "np") => {
    setLanguageState(lang);
    AsyncStorage.setItem('appLanguage', lang);
  };

  const t = (key: string) => (translations[language] && translations[language][key as TranslationKeys]) || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
