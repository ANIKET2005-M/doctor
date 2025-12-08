
import React from 'react';

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
];

export const TRANSLATIONS: Record<string, any> = {
  en: {
    app_name: "MediSage",
    tab_home: "Home",
    tab_scan: "Rx Scan",
    tab_chat: "Chat",
    tab_id: "Identify",
    tab_find: "Find",
    scan_title: "Scan Prescription",
    scan_desc: "Upload a photo of a prescription to get an explanation and a daily reminder plan.",
    tap_upload: "Tap to upload photo",
    retake: "Retake",
    analyze: "Analyze",
    analyzing: "Analyzing...",
    scan_another: "Scan Another Prescription",
    ai_summary: "AI Summary",
    customize_schedule: "Customize Schedule",
    wake_up: "Wake Up",
    sleep: "Sleep",
    create_plan: "Create Daily Plan",
    pharmacy_finder: "Pharmacy Finder",
    find_nearby: "Find Nearby Pharmacies",
    detecting_loc: "Detecting location...",
    loc_needed: "Location access is required.",
    closest: "Closest",
    top_rated: "Top Rated",
    id_medicine: "Identify Medicine",
    id_desc: "Scan a bottle, blister pack, or tablet to get details.",
    identify_now: "Identify Now",
    common_uses: "Common Uses",
    warnings: "Important Warnings",
    side_effects: "Side Effects",
    reminders: "Reminders",
    set_reminder: "Set Reminder",
    family_profiles: "Family Profiles",
    add_profile: "Add",
    new_profile: "New Profile",
    name: "Name",
    relationship: "Relationship",
    age: "Age",
    cancel: "Cancel",
    confirm: "Confirm",
    create: "Create",
    chat_welcome: "Hello! I am MediSage. How can I help you manage your health today?",
    chat_placeholder: "Ask about your medicine...",
    sort: "Sort",
    map_links: "Google Maps Links",
    about_title: "About MediSage",
    about_purpose: "MediSage empowers your health journey with AI tools for prescription analysis, medication identification, and pharmacy discovery.",
    disclaimer_title: "Medical Disclaimer",
    disclaimer_text: "MediSage is an AI assistant, not a medical professional. Information provided is for educational purposes only. Always consult a doctor for medical decisions.",
    privacy_policy: "Privacy Policy",
    terms_service: "Terms of Service",
    version: "Version 1.0.0",
    close: "Close"
  },
  hi: {
    app_name: "मेडीसेज",
    tab_home: "होम",
    tab_scan: "स्कैन",
    tab_chat: "चैट",
    tab_id: "पहचानें",
    tab_find: "खोजें",
    scan_title: "पर्ची स्कैन करें",
    scan_desc: "दवा की पर्ची की फोटो अपलोड करें और दैनिक रिमाइंडर प्लान प्राप्त करें।",
    tap_upload: "फोटो अपलोड करने के लिए टैप करें",
    retake: "फिर से लें",
    analyze: "विश्लेषण करें",
    analyzing: "विश्लेषण हो रहा है...",
    scan_another: "दूसरी पर्ची स्कैन करें",
    ai_summary: "AI सारांश",
    customize_schedule: "समय सारिणी बदलें",
    wake_up: "जागने का समय",
    sleep: "सोने का समय",
    create_plan: "प्लान बनाएं",
    pharmacy_finder: "फार्मेसी खोजें",
    find_nearby: "निकटतम फार्मेसी खोजें",
    detecting_loc: "स्थान का पता लगाया जा रहा है...",
    loc_needed: "स्थान की अनुमति आवश्यक है।",
    closest: "सबसे नज़दीकी",
    top_rated: "टॉप रेटेड",
    id_medicine: "दवा पहचानें",
    id_desc: "बोतल या गोली को स्कैन करके जानकारी प्राप्त करें।",
    identify_now: "अभी पहचानें",
    common_uses: "सामान्य उपयोग",
    warnings: "महत्वपूर्ण चेतावनी",
    side_effects: "दुष्प्रभाव (Side Effects)",
    reminders: "रिमाइंडर",
    set_reminder: "रिमाइंडर सेट करें",
    family_profiles: "परिवार प्रोफाइल",
    add_profile: "जोड़ें",
    new_profile: "नई प्रोफाइल",
    name: "नाम",
    relationship: "रिश्ता",
    age: "उम्र",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    create: "बनाएं",
    chat_welcome: "नमस्ते! मैं मेडीसेज हूँ। मैं आपकी स्वास्थ्य में कैसे मदद कर सकता हूँ?",
    chat_placeholder: "अपनी दवा के बारे में पूछें...",
    sort: "क्रम",
    map_links: "गूगल मैप्स लिंक",
    about_title: "मेडीसेज के बारे में",
    about_purpose: "मेडीसेज एआई टूल्स के साथ आपकी स्वास्थ्य यात्रा को सशक्त बनाता है।",
    disclaimer_title: "चिकित्सा अस्वीकरण",
    disclaimer_text: "मेडीसेज एक एआई सहायक है, डॉक्टर नहीं। दी गई जानकारी केवल शैक्षिक उद्देश्यों के लिए है।",
    privacy_policy: "गोपनीयता नीति",
    terms_service: "सेवा की शर्तें",
    version: "संस्करण 1.0.0",
    close: "बंद करें"
  },
  es: {
    app_name: "MediSage",
    tab_home: "Inicio",
    tab_scan: "Escanear",
    tab_chat: "Chat",
    tab_id: "Identificar",
    tab_find: "Buscar",
    scan_title: "Escanear Receta",
    scan_desc: "Sube una foto de una receta para obtener una explicación y un plan diario.",
    tap_upload: "Toque para subir foto",
    retake: "Retomar",
    analyze: "Analizar",
    analyzing: "Analizando...",
    scan_another: "Escanear otra receta",
    ai_summary: "Resumen IA",
    customize_schedule: "Personalizar Horario",
    wake_up: "Despertar",
    sleep: "Dormir",
    create_plan: "Crear Plan",
    pharmacy_finder: "Buscador de Farmacias",
    find_nearby: "Buscar Farmacias Cercanas",
    detecting_loc: "Detectando ubicación...",
    loc_needed: "Se requiere acceso a la ubicación.",
    closest: "Más Cercano",
    top_rated: "Mejor Valorado",
    id_medicine: "Identificar Medicina",
    id_desc: "Escanea una botella o pastilla para obtener detalles.",
    identify_now: "Identificar Ahora",
    common_uses: "Usos Comunes",
    warnings: "Advertencias Importantes",
    side_effects: "Efectos Secundarios",
    reminders: "Recordatorios",
    set_reminder: "Fijar Recordatorio",
    family_profiles: "Perfiles Familiares",
    add_profile: "Añadir",
    new_profile: "Nuevo Perfil",
    name: "Nombre",
    relationship: "Relación",
    age: "Edad",
    cancel: "Cancelar",
    confirm: "Confirmar",
    create: "Crear",
    chat_welcome: "¡Hola! Soy MediSage. ¿Cómo puedo ayudarte con tu salud hoy?",
    chat_placeholder: "Pregunta sobre tu medicina...",
    sort: "Ordenar",
    map_links: "Enlaces de Google Maps",
    about_title: "Sobre MediSage",
    about_purpose: "MediSage potencia tu salud con herramientas de IA.",
    disclaimer_title: "Aviso Médico",
    disclaimer_text: "MediSage no es un médico. La información es solo para fines educativos.",
    privacy_policy: "Política de Privacidad",
    terms_service: "Términos de Servicio",
    version: "Versión 1.0.0",
    close: "Cerrar"
  },
  fr: {
    app_name: "MediSage",
    tab_home: "Accueil",
    tab_scan: "Scanner",
    tab_chat: "Discuter",
    tab_id: "Identifier",
    tab_find: "Trouver",
    scan_title: "Scanner l'Ordonnance",
    scan_desc: "Téléchargez une photo pour obtenir une explication et un plan de rappel.",
    tap_upload: "Appuyez pour télécharger",
    retake: "Reprendre",
    analyze: "Analyser",
    analyzing: "Analyse...",
    scan_another: "Scanner une autre",
    ai_summary: "Résumé IA",
    customize_schedule: "Personnaliser",
    wake_up: "Réveil",
    sleep: "Coucher",
    create_plan: "Créer un Plan",
    pharmacy_finder: "Trouver Pharmacie",
    find_nearby: "Pharmacies à proximité",
    detecting_loc: "Détection emplacement...",
    loc_needed: "Accès localisation requis.",
    closest: "Plus Proche",
    top_rated: "Mieux Noté",
    id_medicine: "Identifier Médicament",
    id_desc: "Scannez un flacon ou une pilule pour les détails.",
    identify_now: "Identifier",
    common_uses: "Usages Courants",
    warnings: "Avertissements",
    side_effects: "Effets Secondaires",
    reminders: "Rappels",
    set_reminder: "Ajouter Rappel",
    family_profiles: "Profils Famille",
    add_profile: "Ajouter",
    new_profile: "Nouveau Profil",
    name: "Nom",
    relationship: "Relation",
    age: "Âge",
    cancel: "Annuler",
    confirm: "Confirmer",
    create: "Créer",
    chat_welcome: "Bonjour! Je suis MediSage. Comment puis-je vous aider?",
    chat_placeholder: "Posez une question...",
    sort: "Trier",
    map_links: "Liens Google Maps",
    about_title: "À propos de MediSage",
    about_purpose: "MediSage améliore votre parcours de santé avec l'IA.",
    disclaimer_title: "Avis Médical",
    disclaimer_text: "MediSage n'est pas un médecin. Informations à des fins éducatives uniquement.",
    privacy_policy: "Politique de Confidentialité",
    terms_service: "Conditions d'Utilisation",
    version: "Version 1.0.0",
    close: "Fermer"
  },
  bn: {
    app_name: "মেডিसेज",
    tab_home: "হোম",
    tab_scan: "স্ক্যান",
    tab_chat: "চ্যাট",
    tab_id: "চিনুন",
    tab_find: "খুঁজুন",
    scan_title: "প্রেসক্রিপশন স্ক্যান",
    scan_desc: "প্রেসক্রিপশনের ছবি আপলোড করুন এবং বিস্তারিত জানুন।",
    tap_upload: "ছবি আপলোড করতে ট্যাপ করুন",
    retake: "আবার নিন",
    analyze: "বিশ্লেষণ করুন",
    analyzing: "বিশ্লেষণ হচ্ছে...",
    scan_another: "অন্য প্রেসক্রিপশন স্ক্যান করুন",
    ai_summary: "AI সারাংশ",
    customize_schedule: "সময়সূচী কাস্টমাইজ করুন",
    wake_up: "ঘুম থেকে ওঠা",
    sleep: "ঘুমানো",
    create_plan: "প্ল্যান তৈরি করুন",
    pharmacy_finder: "ফার্মেসি খুঁজুন",
    find_nearby: "কাছাকাছি ফার্মেসি",
    detecting_loc: "অবস্থান সনাক্ত করা হচ্ছে...",
    loc_needed: "অবস্থান অ্যাক্সেস প্রয়োজন।",
    closest: "সবচেয়ে কাছে",
    top_rated: "সেরা রেটেড",
    id_medicine: "ঔষধ চিনুন",
    id_desc: "বোতল বা ট্যাবলেটের ছবি স্ক্যান করুন।",
    identify_now: "এখনই চিনুন",
    common_uses: "সাধারণ ব্যবহার",
    warnings: "সতর্কতা",
    side_effects: "পার্শ্ব প্রতিক্রিয়া",
    reminders: "রিমাইন্ডার",
    set_reminder: "রিমাইন্ডার সেট করুন",
    family_profiles: "পারিবারিক প্রোফাইল",
    add_profile: "যোগ করুন",
    new_profile: "নতুন প্রোফাইল",
    name: "নাম",
    relationship: "সম্পর্ক",
    age: "বয়স",
    cancel: "বাতিল",
    confirm: "নিশ্চিত করুন",
    create: "তৈরি করুন",
    chat_welcome: "নমস্কার! আমি MediSage। আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    chat_placeholder: "ঔষধ সম্পর্কে জিজ্ঞাসা করুন...",
    sort: "বাছাই",
    map_links: "গুগল ম্যাপস লিঙ্ক",
    about_title: "MediSage সম্পর্কে",
    about_purpose: "MediSage এআই টুলের মাধ্যমে আপনার স্বাস্থ্য যাত্রাকে শক্তিশালী করে।",
    disclaimer_title: "চিকিৎসা সতর্কতা",
    disclaimer_text: "MediSage ডাক্তার নয়। তথ্য শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে।",
    privacy_policy: "গোপনীয়তা নীতি",
    terms_service: "সেবার শর্তাবলী",
    version: "সংস্করণ 1.0.0",
    close: "বন্ধ করুন"
  },
  ta: {
    app_name: "மெடிசேஜ்",
    tab_home: "முகப்பு",
    tab_scan: "ஸ்கேன்",
    tab_chat: "அரட்டை",
    tab_id: "கண்டறி",
    tab_find: "தேடு",
    scan_title: "மருந்து சீட்டு ஸ்கேன்",
    scan_desc: "மருந்து சீட்டின் புகைப்படத்தைப் பதிவேற்றவும்.",
    tap_upload: "புகைப்படத்தைப் பதிவேற்ற தட்டவும்",
    retake: "மீண்டும் எடுக்கவும்",
    analyze: "பகுப்பாய்வு",
    analyzing: "பகுப்பாய்வு செய்கிறது...",
    scan_another: "மற்றொரு ஸ்கேன்",
    ai_summary: "AI சுருக்கம்",
    customize_schedule: "அட்டவணை",
    wake_up: "விழிக்கும் நேரம்",
    sleep: "தூங்கும் நேரம்",
    create_plan: "திட்டம் உருவாக்கவும்",
    pharmacy_finder: "மருந்தகம் தேடு",
    find_nearby: "அருகிலுள்ள மருந்தகங்கள்",
    detecting_loc: "இடம் கண்டறியப்படுகிறது...",
    loc_needed: "இட அனுமதி தேவை.",
    closest: "மிக அருகில்",
    top_rated: "சிறந்த மதிப்பீடு",
    id_medicine: "மருந்தை அறிதல்",
    id_desc: "மருந்து பாட்டில் அல்லது மாத்திரையை ஸ்கேன் செய்யவும்.",
    identify_now: "இப்போது கண்டறியவும்",
    common_uses: "பயன்கள்",
    warnings: "எச்சரிக்கைகள்",
    side_effects: "பக்க விளைவுகள்",
    reminders: "நினைவூட்டல்கள்",
    set_reminder: "நினைவூட்டல் அமைக்கவும்",
    family_profiles: "குடும்பம்",
    add_profile: "சேர்",
    new_profile: "புதிய சுயவிவரம்",
    name: "பெயர்",
    relationship: "உறவு",
    age: "வயது",
    cancel: "ரத்து",
    confirm: "உறுதி",
    create: "உருவாக்கு",
    chat_welcome: "வணக்கம்! நான் MediSage. நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    chat_placeholder: "மருந்து பற்றி கேட்கவும்...",
    sort: "வகைப்படுத்து",
    map_links: "கூகுள் மேப்ஸ் இணைப்புகள்",
    about_title: "MediSage பற்றி",
    about_purpose: "MediSage AI கருவிகள் மூலம் உங்கள் உடல்நலப் பயணத்தை மேம்படுத்துகிறது.",
    disclaimer_title: "மருத்துவ மறுப்பு",
    disclaimer_text: "MediSage ஒரு மருத்துவர் அல்ல. தகவல் கல்வி நோக்கங்களுக்காக மட்டுமே.",
    privacy_policy: "தனியுரிமைக் கொள்கை",
    terms_service: "சேவை விதிமுறைகள்",
    version: "பதிப்பு 1.0.0",
    close: "மூடு"
  },
  te: {
    app_name: "మెడిసేజ్",
    tab_home: "హోమ్",
    tab_scan: "స్కాన్",
    tab_chat: "చాట్",
    tab_id: "గుర్తించు",
    tab_find: "వెతుకు",
    scan_title: "ప్రిస్క్రిప్షన్ స్కాన్",
    scan_desc: "ప్రిస్క్రిప్షన్ ఫోటోను అప్‌లోడ్ చేయండి.",
    tap_upload: "ఫోటో అప్‌లోడ్ చేయడానికి నొక్కండి",
    retake: "మళ్ళీ తీసుకోండి",
    analyze: "విశ్లేషించండి",
    analyzing: "విశ్లేషిస్తోంది...",
    scan_another: "మరొకటి స్కాన్ చేయండి",
    ai_summary: "AI సారాంశం",
    customize_schedule: "షెడ్యూల్ మార్చండి",
    wake_up: "నిద్రలేచే సమయం",
    sleep: "నిద్రపోయే సమయం",
    create_plan: "ప్లాన్ చేయండి",
    pharmacy_finder: "ఫార్మసీ ఫైండర్",
    find_nearby: "దగ్గరి ఫార్మసీలు",
    detecting_loc: "లొకేషన్ వెతుకుతోంది...",
    loc_needed: "లొకేషన్ అనుమతి అవసరం.",
    closest: "అతి దగ్గర",
    top_rated: "టాప్ రేటెడ్",
    id_medicine: "మందును గుర్తించండి",
    id_desc: "మందు బాటిల్ లేదా బిళ్ళను స్కాన్ చేయండి.",
    identify_now: "ఇప్పుడే గుర్తించు",
    common_uses: "ఉపయోగాలు",
    warnings: "హెచ్చరికలు",
    side_effects: "దుష్ప్రభావాలు",
    reminders: "రిమైండర్లు",
    set_reminder: "రిమైండర్ సెట్ చేయండి",
    family_profiles: "కుటుంబం",
    add_profile: "జోడించు",
    new_profile: "కొత్త ప్రొఫైల్",
    name: "పేరు",
    relationship: "బంధం",
    age: "వయస్సు",
    cancel: "రద్దు",
    confirm: "నిర్ధారించు",
    create: "సృష్టించు",
    chat_welcome: "నమస్కారం! నేను MediSage. నేను మీకు ఎలా సహాయపడగలను?",
    chat_placeholder: "మందు గురించి అడగండి...",
    sort: "వరుసక్రమం",
    map_links: "గూగుల్ మ్యాప్స్ లింకులు",
    about_title: "MediSage గురించి",
    about_purpose: "MediSage AI టూల్స్‌తో మీ ఆరోగ్య ప్రయాణాన్ని మెరుగుపరుస్తుంది.",
    disclaimer_title: "మెడికల్ డిస్క్లైమర్",
    disclaimer_text: "MediSage డాక్టర్ కాదు. సమాచారం విద్యా ప్రయోజనాల కోసం మాత్రమే.",
    privacy_policy: "గోప్యతా విధానం",
    terms_service: "సేవా నిబంధనలు",
    version: "వెర్షన్ 1.0.0",
    close: "మూసివేయు"
  }
};

export const INITIAL_PROFILES = [
  {
    id: '1',
    name: 'Me',
    avatarUrl: 'https://picsum.photos/100/100?random=1',
    relationship: 'Self' as const,
    medications: []
  },
  {
    id: '2',
    name: 'Mom',
    avatarUrl: 'https://picsum.photos/100/100?random=2',
    relationship: 'Parent' as const,
    medications: []
  }
];

// Reusable SVG props
const svgProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const Icons = {
  Scan: () => (
    <svg {...svgProps}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
  ),
  Chat: () => (
    <svg {...svgProps}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Map: () => (
    <svg {...svgProps}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  People: () => (
    <svg {...svgProps}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Home: () => (
    <svg {...svgProps}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Add: () => (
    <svg {...svgProps}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  ArrowRight: () => (
    <svg {...svgProps}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Warning: () => (
    <svg {...svgProps} className="text-yellow-500">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Info: () => (
    <svg {...svgProps} className="text-blue-400">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Send: () => (
    <svg {...svgProps}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Close: () => (
    <svg {...svgProps}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Delete: () => (
    <svg {...svgProps} className="text-red-400">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Walk: () => (
    <svg {...svgProps} width="16" height="16">
      <path d="M13 4v6l-2 3-2.5-1.5L10 7V4H7v4l2.5 4 1 5" />
      <circle cx="10" cy="2" r="1.5" />
    </svg>
  ),
  Star: () => (
    <svg {...svgProps} width="14" height="14" fill="currentColor" className="text-yellow-500">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Pill: () => (
    <svg {...svgProps}>
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
    </svg>
  ),
  Globe: () => (
    <svg {...svgProps}>
       <circle cx="12" cy="12" r="10" />
       <line x1="2" y1="12" x2="22" y2="12" />
       <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Mic: () => (
    <svg {...svgProps}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  HelpCircle: () => (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};
