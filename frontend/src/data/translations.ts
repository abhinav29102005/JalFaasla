export type Language = 'en' | 'pa' | 'hi';

export const TRANSLATIONS = {
  en: {
    appTitle: "JalFaasla",
    appSubtitle: "Groundwater-Aware Crop & Irrigation Advisor for Punjab",
    heroTagline: "Don't just say 'save water'. Discover exact tube-well hours and ₹ saved on your land.",
    selectLanguage: "Language",
    ludhianaFocusBadge: "PAU Ludhiana Data Integrated • CGWB Sentinel Network",
    
    // Tabs & Navigation
    tabOnboarding: "Farmer Setup & Advisory",
    tabRiskProfile: "Groundwater Stress Score",
    tabCalendar: "Legal Sowing Calendar",
    tabIrrigation: "7-Day Irrigation Schedule",
    tabCropFit: "Crop Fit & Economics",
    tabFarmerReport: "Farmer Ground-Truth Loop",
    tabAiAdvisor: "Ask AI Agronomist",
    tabAwsArchitecture: "AWS Cloud Architecture",
    
    // Onboarding Form
    district: "District",
    block: "Block / Tehsil",
    landSizeAcre: "Land Size (Acres)",
    soilType: "Soil Type",
    currentCrop: "Current / Planned Crop",
    tubewellDepthM: "Reported Tube-Well Depth (Meters / Feet)",
    pumpHp: "Submersible Pump Motor (HP)",
    powerSource: "Power Source",
    irrigationMethod: "Irrigation Method",
    plannedDate: "Planned Nursery / Transplanting Date",
    quickPresets: "Quick Scenarios for Demo:",
    presetLudhiana: "Ludhiana 18m Tube-Well (The Pitch Scenario)",
    presetSangrur: "Sangrur Deep Dark Zone (32m)",
    presetBet: "Sidhwan Bet Canal Tract (12m)",
    calculateAdvisory: "Generate Groundwater & Cost Advisory",
    
    // Groundwater scorecard
    stressScoreTitle: "Groundwater Stress Index",
    criticalStress: "CRITICAL OVER-EXPLOITED",
    moderateStress: "MODERATE / CRITICAL",
    safeStress: "SAFE / RECHARGE ADEQUATE",
    currentDepth: "Current Water Table",
    annualFall: "Annual Fall Rate",
    extractionRatio: "Stage of Extraction",
    cgwbWarning: "PAU Warning: Falling >50 cm annually in this central Punjab belt.",
    
    // Economic punchline
    economicHeadline: "Economic Impact on Your Field",
    savedHours: "Tube-Well Hours Saved",
    savedMoney: "Diesel / Energy Cost Saved",
    savedWater: "Groundwater Saved",
    legalStatus: "Punjab Subsoil Act Status",
    
    // Legal alert
    legalCompliant: "LEGAL COMPLIANCE: Within Notified Window",
    legalViolation: "LEGAL WARNING: Sowing Before Notified Date!",
    legalFineNotice: "Under Section 5 of the Punjab Preservation of Subsoil Water Act, early planting risks a fine of ₹10,000/month/hectare and destruction of the nursery.",
    notifiedWindowDate: "Official Notified Transplanting Date:",
    
    // Irrigation Scheduler
    irrigationHeadline: "7-Day Rain-Aware Irrigation Guidance",
    skipAlert: "PAUSE IRRIGATION: Rain predicted! Turn off tube-wells and hold water.",
    optimalTiming: "Recommended Pump Window: 5:00 AM - 8:30 AM or 6:30 PM - 9:00 PM (saves 18-22% evaporation loss)",
    awdGuideTitle: "Alternate Wetting & Drying (AWD) Pani-Pipe Protocol",
    
    // Crop fit
    cropFitHeadline: "Crop Diversification & Short-Duration Fit",
    shiftAdvice: "PAU Guidance: Shifting from Pusa-44 to PR-126 or Maize saves immense water without losing farmer income.",
    compareTitle: "Compare Your Options Side-by-Side",
    
    // Share & Export
    shareWhatsApp: "Share Advisory on WhatsApp",
    printReport: "Print Farmer Advisory Card",
    
    // Farmer Report Loop
    reportTitle: "Community Ground-Truth & Well Health Reporting",
    reportSubtitle: "Report actual water depths, pump motor lowering, and pump burning in your village to strengthen the community dataset.",
    submitReport: "Submit Verified Field Report",
    recentReports: "Recent Community Reports in Punjab"
  },
  pa: {
    appTitle: "ਜਲ ਫ਼ਾਸਲਾ",
    appSubtitle: "ਪੰਜਾਬ ਦੇ ਕਿਸਾਨਾਂ ਲਈ ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਆਧਾਰਿਤ ਫਸਲ ਅਤੇ ਸਿੰਚਾਈ ਸਲਾਹਕਾਰ",
    heroTagline: "ਸਿਰਫ਼ 'ਪਾਣੀ ਬਚਾਓ' ਨਾ ਕਹੋ। ਜਾਣੋ ਤੁਹਾਡੇ ਖੇਤ ਵਿੱਚ ਕਿੰਨੇ ਘੰਟੇ ਟਿਊਬਵੈੱਲ ਅਤੇ ਕਿੰਨੇ ਰੁਪਏ ਬਚਣਗੇ!",
    selectLanguage: "ਭਾਸ਼ਾ",
    ludhianaFocusBadge: "ਪੀ.ਏ.ਯੂ. ਲੁਧਿਆਣਾ ਰਿਸਰਚ • ਸੀ.ਜੀ.ਡਬਲਿਊ.ਬੀ. ਅੰਕੜੇ",
    
    // Tabs & Navigation
    tabOnboarding: "ਖੇਤ ਦਾ ਵੇਰਵਾ ਅਤੇ ਸਲਾਹ",
    tabRiskProfile: "ਪਾਣੀ ਦਾ ਸੰਕਟ ਸਕੋਰ",
    tabCalendar: "ਸਰਕਾਰੀ ਕਾਨੂੰਨੀ ਕੈਲੰਡਰ",
    tabIrrigation: "7 ਦਿਨਾਂ ਦਾ ਸਿੰਚਾਈ ਸ਼ਡਿਊਲ",
    tabCropFit: "ਫਸਲ ਚੋਣ ਅਤੇ ਕਮਾਈ",
    tabFarmerReport: "ਕਿਸਾਨ ਗਰਾਊਂਡ ਰਿਪੋਰਟ",
    tabAiAdvisor: "ਏ.ਆਈ. ਖੇਤੀ ਮਾਹਿਰ",
    tabAwsArchitecture: "AWS ਕਲਾਉਡ ਢਾਂਚਾ",
    
    // Onboarding Form
    district: "ਜ਼ਿਲ੍ਹਾ",
    block: "ਬਲਾਕ / ਤਹਿਸੀਲ",
    landSizeAcre: "ਜ਼ਮੀਨ ਦਾ ਰਕਬਾ (ਏਕੜ)",
    soilType: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ",
    currentCrop: "ਮੌਜੂਦਾ / ਚੁਣੀ ਹੋਈ ਫਸਲ",
    tubewellDepthM: "ਟਿਊਬਵੈੱਲ ਦੀ ਡੂੰਘਾਈ (ਮੀਟਰ / ਫੁੱਟ)",
    pumpHp: "ਸਬਮਰਸੀਬਲ ਮੋਟਰ ਦੀ ਸਮਰੱਥਾ (HP)",
    powerSource: "ਬਿਜਲੀ ਦਾ ਸਰੋਤ",
    irrigationMethod: "ਸਿੰਚਾਈ ਦਾ ਤਰੀਕਾ",
    plannedDate: "ਪਨੀਰੀ ਬੀਜਣ / ਝੋਨਾ ਲਾਉਣ ਦੀ ਮਿਤੀ",
    quickPresets: "ਡੈਮੋ ਲਈ ਤੁਰੰਤ ਉਦਾਹਰਣਾਂ:",
    presetLudhiana: "ਲੁਧਿਆਣਾ 18 ਮੀਟਰ ਟਿਊਬਵੈੱਲ (ਮੁੱਖ ਪਿੱਚ)",
    presetSangrur: "ਸੰਗਰੂਰ ਡਾਰਕ ਜ਼ੋਨ (32 ਮੀਟਰ)",
    presetBet: "ਸਿੱਧਵਾਂ ਬੇਟ ਨਹਿਰੀ ਇਲਾਕਾ (12 ਮੀਟਰ)",
    calculateAdvisory: "ਪਾਣੀ ਅਤੇ ਖਰਚੇ ਦੀ ਬੱਚਤ ਵੇਖੋ",
    
    // Groundwater scorecard
    stressScoreTitle: "ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਦਾ ਸੰਕਟ ਇੰਡੈਕਸ",
    criticalStress: "ਅਤਿ ਗੰਭੀਰ ਸੰਕਟ (ਓਵਰ-ਐਕਸਪਲੋਇਟਿਡ)",
    moderateStress: "ਦਰਮਿਆਨਾ ਸੰਕਟ",
    safeStress: "ਸੁਰੱਖਿਅਤ ਖੇਤਰ",
    currentDepth: "ਮੌਜੂਦਾ ਪਾਣੀ ਦਾ ਪੱਧਰ",
    annualFall: "ਸਾਲਾਨਾ ਗਿਰਾਵਟ ਦੀ ਦਰ",
    extractionRatio: "ਪਾਣੀ ਕੱਢਣ ਦੀ ਦਰ",
    cgwbWarning: "ਪੀ.ਏ.ਯੂ. ਚੇਤਾਵਨੀ: ਇਸ ਖੇਤਰ ਵਿੱਚ ਪਾਣੀ ਹਰ ਸਾਲ 50 ਸੈਂਟੀਮੀਟਰ ਤੋਂ ਵੱਧ ਹੇਠਾਂ ਡਿੱਗ ਰਿਹਾ ਹੈ।",
    
    // Economic punchline
    economicHeadline: "ਤੁਹਾਡੇ ਖੇਤ ਉੱਤੇ ਸਿੱਧਾ ਮੁਨਾਫ਼ਾ",
    savedHours: "ਬਚੇ ਟਿਊਬਵੈੱਲ ਦੇ ਘੰਟੇ",
    savedMoney: "ਬਚਿਆ ਡੀਜ਼ਲ / ਬਿਜਲੀ ਖਰਚਾ (₹)",
    savedWater: "ਬਚਾਇਆ ਧਰਤੀ ਹੇਠਲਾ ਪਾਣੀ",
    legalStatus: "ਪੰਜਾਬ ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਕਾਨੂੰਨ",
    
    // Legal alert
    legalCompliant: "ਕਾਨੂੰਨੀ ਤੌਰ ਤੇ ਸਹੀ: ਸਰਕਾਰੀ ਨੋਟੀਫਾਈਡ ਤਾਰੀਖ਼ ਦੇ ਅੰਦਰ",
    legalViolation: "ਕਾਨੂੰਨੀ ਚੇਤਾਵਨੀ: ਨੋਟੀਫਾਈਡ ਮਿਤੀ ਤੋਂ ਪਹਿਲਾਂ ਲਵਾਈ!",
    legalFineNotice: "ਪੰਜਾਬ ਸਬਸੋਇਲ ਵਾਟਰ ਐਕਟ ਦੀ ਧਾਰਾ 5 ਤਹਿਤ ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਝੋਨਾ ਲਾਉਣ ਤੇ ₹10,000 ਪ੍ਰਤੀ ਮਹੀਨਾ ਪ੍ਰਤੀ ਹੈਕਟੇਅਰ ਜੁਰਮਾਨਾ ਅਤੇ ਫਸਲ ਵਾਹੁਣ ਦਾ ਹੁਕਮ ਹੋ ਸਕਦਾ ਹੈ।",
    notifiedWindowDate: "ਸਰਕਾਰੀ ਨੋਟੀਫਾਈਡ ਲਵਾਈ ਮਿਤੀ:",
    
    // Irrigation Scheduler
    irrigationHeadline: "7 ਦਿਨਾਂ ਦਾ ਮੌਸਮ-ਅਨੁਸਾਰ ਸਿੰਚਾਈ ਸ਼ਡਿਊਲ",
    skipAlert: "ਟਿਊਬਵੈੱਲ ਬੰਦ ਰੱਖੋ: ਮੀਂਹ ਪੈਣ ਵਾਲਾ ਹੈ! ਪਾਣੀ ਅਤੇ ਬਿਜਲੀ ਦੀ ਬੱਚਤ ਕਰੋ।",
    optimalTiming: "ਪਾਣੀ ਲਾਉਣ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ: ਸਵੇਰੇ 5:00 - 8:30 ਜਾਂ ਸ਼ਾਮ 6:30 - 9:00 (ਵਾਸ਼ਪੀਕਰਨ 18-22% ਘੱਟਦਾ ਹੈ)",
    awdGuideTitle: "ਬਦਲਵੀਂ ਗਿੱਲੀ ਅਤੇ ਸੁੱਕੀ ਸਿੰਚਾਈ (AWD) ਪਾਣੀ-ਪਾਈਪ ਤਰੀਕਾ",
    
    // Crop fit
    cropFitHeadline: "ਘੱਟ ਸਮੇਂ ਵਾਲੀਆਂ ਫਸਲਾਂ ਅਤੇ ਵਿਭਿੰਨਤਾ",
    shiftAdvice: "ਪੀ.ਏ.ਯੂ. ਸਲਾਹ: ਪੂਸਾ-44 ਦੀ ਥਾਂ ਪੀ.ਆਰ.-126 ਜਾਂ ਮੱਕੀ ਲਾਉਣ ਨਾਲ ਬਿਨਾਂ ਆਮਦਨ ਘਟਾਏ ਵੱਡੀ ਬੱਚਤ ਹੁੰਦੀ ਹੈ।",
    compareTitle: "ਆਪਣੀਆਂ ਫਸਲਾਂ ਦਾ ਆਹਮੋ-ਸਾਹਮਣੇ ਮੁਕਾਬਲਾ",
    
    // Share & Export
    shareWhatsApp: "ਵਟਸਐਪ ਤੇ ਸਲਾਹ ਭੇਜੋ",
    printReport: "ਕਿਸਾਨ ਸਲਾਹ ਕਾਰਡ ਪ੍ਰਿੰਟ ਕਰੋ",
    
    // Farmer Report Loop
    reportTitle: "ਪਿੰਡ ਪੱਧਰੀ ਟਿਊਬਵੈੱਲ ਹਾਲਤ ਰਿਪੋਰਟਿੰਗ",
    reportSubtitle: "ਆਪਣੇ ਪਿੰਡ ਵਿੱਚ ਟਿਊਬਵੈੱਲ ਦੀ ਅਸਲ ਡੂੰਘਾਈ, ਪਾਈਪਾਂ ਵਧਾਉਣ ਜਾਂ ਮੋਟਰ ਸੜਨ ਦੀ ਰਿਪੋਰਟ ਦਰਜ ਕਰੋ।",
    submitReport: "ਰਿਪੋਰਟ ਜਮ੍ਹਾਂ ਕਰੋ",
    recentReports: "ਪੰਜਾਬ ਦੇ ਕਿਸਾਨਾਂ ਦੀਆਂ ਤਾਜ਼ਾ ਰਿਪੋਰਟਾਂ"
  },
  hi: {
    appTitle: "जल फ़ासला",
    appSubtitle: "पंजाब के किसानों हेतु भूजल-आधारित फसल एवं सिंचाई सलाहकार",
    heroTagline: "केवल 'पानी बचाओ' मत कहिए। जानिए आपके खेत पर कितने घंटे ट्यूबवेल और कितने ₹ बचेंगे!",
    selectLanguage: "भाषा",
    ludhianaFocusBadge: "पीएयू लुधियाना डेटा • सीजीडब्ल्यूबी नेटवर्क",
    
    // Tabs & Navigation
    tabOnboarding: "खेत विवरण एवं सलाह",
    tabRiskProfile: "भूजल संकट स्कोर",
    tabCalendar: "कानूनी बुवाई कैलेंडर",
    tabIrrigation: "7-दिवसीय सिंचाई शेड्यूल",
    tabCropFit: "फसल चयन एवं बचत",
    tabFarmerReport: "किसान ग्राउंड रिपोर्ट",
    tabAiAdvisor: "एआई कृषि विशेषज्ञ",
    tabAwsArchitecture: "AWS क्लाउड संरचना",
    
    // Onboarding Form
    district: "जिला",
    block: "ब्लॉक / तहसील",
    landSizeAcre: "जमीन का रकबा (एकड़)",
    soilType: "मिट्टी का प्रकार",
    currentCrop: "वर्तमान / चुनी गई फसल",
    tubewellDepthM: "ट्यूबवेल की गहराई (मीटर / फीट)",
    pumpHp: "सबमर्सिबल मोटर क्षमता (HP)",
    powerSource: "ऊर्जा स्रोत",
    irrigationMethod: "सिंचाई विधि",
    plannedDate: "पनीरी / रोपाई की तिथि",
    quickPresets: "डेमो हेतु त्वरित परिदृश्य:",
    presetLudhiana: "लुधियाना 18 मी ट्यूबवेल (मुख्य पिच)",
    presetSangrur: "संगरूर डार्क जोन (32 मी)",
    presetBet: "सिद्धवां बेट नहरी क्षेत्र (12 मी)",
    calculateAdvisory: "पानी एवं खर्च की बचत देखें",
    
    // Groundwater scorecard
    stressScoreTitle: "भूजल तनाव इंडेक्स",
    criticalStress: "अत्यधिक गंभीर (अति-दोहित)",
    moderateStress: "मध्यम / गंभीर",
    safeStress: "सुरक्षित क्षेत्र",
    currentDepth: "वर्तमान जल स्तर",
    annualFall: "वार्षिक गिरावट दर",
    extractionRatio: "जल दोहन अनुपात",
    cgwbWarning: "पीएयू चेतावनी: इस मध्य पंजाब बेल्ट में भूजल 50 सेमी/वर्ष से अधिक तेजी से गिर रहा है।",
    
    // Economic punchline
    economicHeadline: "आपके खेत पर सीधा आर्थिक लाभ",
    savedHours: "बचे ट्यूबवेल के घंटे",
    savedMoney: "बचा डीजल / बिजली खर्च (₹)",
    savedWater: "बचाया भूजल",
    legalStatus: "पंजाब उपमृदा जल कानून स्थिति",
    
    // Legal alert
    legalCompliant: "कानूनी रूप से मान्य: अधिसूचित अवधि के भीतर",
    legalViolation: "कानूनी चेतावनी: अधिसूचित तिथि से पहले रोपाई!",
    legalFineNotice: "पंजाब उपमृदा जल संरक्षण कानून के तहत समय से पहले धान लगाने पर ₹10,000/माह/हेक्टेयर का जुर्माना व फसल नष्ट करने का आदेश हो सकता है।",
    notifiedWindowDate: "सरकारी अधिसूचित रोपाई तिथि:",
    
    // Irrigation Scheduler
    irrigationHeadline: "7-दिवसीय मौसम-आधारित सिंचाई मार्गदर्शन",
    skipAlert: "ट्यूबवेल बंद रखें: बारिश का अनुमान! पानी एवं ऊर्जा बचाएं।",
    optimalTiming: "सर्वोत्तम पंप समय: सुबह 5:00 - 8:30 या शाम 6:30 - 9:00 (वाष्पीकरण 18-22% घटता है)",
    awdGuideTitle: "वैकल्पिक गीली एवं सूखी सिंचाई (AWD) पानी-पाइप विधि",
    
    // Crop fit
    cropFitHeadline: "कम अवधि वाली फसलें एवं विविधीकरण",
    shiftAdvice: "पीएयू सलाह: पूसा-44 के स्थान पर पीआर-126 या मक्का लगाने से बिना आय घटाए भारी पानी व लागत बचती है।",
    compareTitle: "फसलों का आमने-सामने तुलनात्मक विश्लेषण",
    
    // Share & Export
    shareWhatsApp: "व्हाट्सएप पर सलाह साझा करें",
    printReport: "किसान परामर्श कार्ड प्रिंट करें",
    
    // Farmer Report Loop
    reportTitle: "ग्राम स्तरीय ट्यूबवेल स्वास्थ्य रिपोर्टिंग",
    reportSubtitle: "अपने गांव में ट्यूबवेल की वास्तविक गहराई, पाइप बढ़ाने व मोटर जलने की सूचना दर्ज करें।",
    submitReport: "रिपोर्ट सबमिट करें",
    recentReports: "पंजाब के किसानों की हालिया रिपोर्टें"
  }
};
