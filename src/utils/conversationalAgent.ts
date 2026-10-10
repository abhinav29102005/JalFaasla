export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  metricsHighlight?: {
    label: string;
    value: string;
  };
}

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'agent',
    text: `Sat Sri Akal / Namaste! I am your **JalFaasla AI Agronomist**, powered by PAU Ludhiana research, CGWB groundwater data, and the Punjab Preservation of Subsoil Water Act.\n\nAsk me any question in English, Punjabi, or Hindi about your tube-well running hours, AWD irrigation, or legal sowing dates.`,
    timestamp: 'Just now',
    suggestedActions: [
      'I have 4 acres in Ludhiana, tube-well depth 18 m, rain expected Thursday—when should I irrigate?',
      'Can I transplant PR-126 on June 12 in Ludhiana?',
      'How much diesel will I save shifting from Pusa-44 to PR-126 with AWD?',
      'How to make an AWD Pani-Pipe?'
    ]
  }
];

export function getAiAgronomistResponse(userPrompt: string, lang: 'en' | 'pa' | 'hi' = 'en'): ChatMessage {
  const q = userPrompt.toLowerCase();

  // 1. Rain Thursday / Ludhiana 18m tube-well question
  if (q.includes('thursday') || q.includes('rain') || q.includes('4 acre') || q.includes('18 m') || q.includes('ਮੀਂਹ') || q.includes('ਵੀਰਵਾਰ') || q.includes('बारिश')) {
    if (lang === 'pa') {
      return {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: `**ਲੁਧਿਆਣਾ ਲਈ ਸਿੰਚਾਈ ਸਲਾਹ (18 ਮੀਟਰ ਟਿਊਬਵੈੱਲ, 4 ਏਕੜ):**\n\n1. **ਵੀਰਵਾਰ ਨੂੰ ਟਿਊਬਵੈੱਲ ਬੰਦ ਰੱਖੋ!** ਮੌਸਮ ਵਿਭਾਗ ਅਨੁਸਾਰ ਵੀਰਵਾਰ ਨੂੰ 28 ਮਿਲੀਮੀਟਰ ਚੰਗਾ ਮੀਂਹ ਪੈਣ ਦੀ 90% ਸੰਭਾਵਨਾ ਹੈ।\n2. **ਸਿੰਚਾਈ ਸ਼ਡਿਊਲ:** ਵੀਰਵਾਰ ਅਤੇ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਪਾਣੀ ਬਿਲਕੁਲ ਨਾ ਲਾਓ। ਖੇਤ ਦੀਆਂ ਵੱਟਾਂ ਉੱਚੀਆਂ ਰੱਖੋ ਤਾਂ ਜੋ ਮੀਂਹ ਦਾ ਪਾਣੀ ਅੰਦਰ ਹੀ ਜਜ਼ਬ ਹੋ ਸਕੇ।\n3. **ਬੱਚਤ:** ਇਕੱਲਾ ਵੀਰਵਾਰ ਦਾ ਪਾਣੀ ਰੋਕਣ ਨਾਲ ਤੁਹਾਡੇ **14 ਘੰਟੇ ਟਿਊਬਵੈੱਲ** ਅਤੇ ਲਗਭਗ **₹1,450 ਤੋਂ ₹2,200 ਦਾ ਡੀਜ਼ਲ/ਖਰਚਾ** ਬਚੇਗਾ!\n4. **ਅਗਲੀ ਸਿੰਚਾਈ:** ਸ਼ਨੀਵਾਰ ਜਾਂ ਐਤਵਾਰ ਨੂੰ ਆਪਣਾ **ਪਾਣੀ-ਪਾਈਪ** ਚੈੱਕ ਕਰੋ। ਜਦੋਂ ਤੱਕ ਪਾਣੀ ਜ਼ਮੀਨ ਤੋਂ 5 ਸੈਂਟੀਮੀਟਰ ਹੇਠਾਂ ਨਾ ਜਾਵੇ, ਟਿਊਬਵੈੱਲ ਨਾ ਚਲਾਓ।`,
        timestamp: 'Just now',
        metricsHighlight: {
          label: 'Immediate Saving',
          value: '14 Pump Hours & ₹2,200 Saved'
        },
        suggestedActions: [
          'How to install a Pani-Pipe in the field?',
          'What if rain does not occur on Thursday?',
          'Is PR-126 safe from pests?'
        ]
      };
    } else if (lang === 'hi') {
      return {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: `**लुधियाना 4 एकड़, 18 मी ट्यूबवेल हेतु सिंचाई परामर्श:**\n\n1. **गुरुवार को ट्यूबवेल चालू न करें!** मौसम मॉडल के अनुसार 28 मिमी बारिश का 90% अनुमान है।\n2. **शेड्यूल:** गुरुवार और शुक्रवार को कोई पूरक सिंचाई न दें। खेत की मेड़ें ऊंची रखें ताकि वर्षा जल खेत में ही रुके।\n3. **बचत:** केवल एक सिंचाई टालने से आपके **14 पंप घंटे** और लगभग **₹2,200 डीजल खर्च** की बचत होगी।\n4. **अगला कदम:** शनिवार को पानी-पाइप से नमी जांचें। जब तक पानी सतह से 5 सेमी नीचे न जाए, सिंचाई न करें।`,
        timestamp: 'Just now',
        metricsHighlight: {
          label: 'अनुमानित बचत',
          value: '14 घंटे और ₹2,200 सुरक्षित'
        },
        suggestedActions: [
          'पानी-पाइप कैसे बनाएं?',
          'पीआर-126 की रोग प्रतिरोधक क्षमता क्या है?'
        ]
      };
    } else {
      return {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: `**Irrigation Advisory for 4 Acres in Ludhiana (18m Tube-well):**\n\n1. **DO NOT irrigate on Thursday!** The agro-meteorological model predicts **28 mm of soaking rainfall** (90% probability).\n2. **Action Plan:** Hold off pumping entirely on Thursday and Friday. Maintain raised field bunds (Watt-bandi) to trap all rainwater.\n3. **Calculated Savings:** Skipping this single irrigation cycle saves **~14 tube-well running hours** and **₹2,217 in diesel** (or 105 kWh electric units).\n4. **When to Resume:** On Saturday/Sunday, check your field **Pani-Pipe**. Under AWD protocol, only re-irrigate when the water drops **5 cm below the soil surface**.`,
        timestamp: 'Just now',
        metricsHighlight: {
          label: 'Direct Saving',
          value: '14 Pump Hours & ₹2,217 Saved'
        },
        suggestedActions: [
          'How do I install an AWD Pani-Pipe?',
          'Can I transplant PR-126 on June 12 in Ludhiana?',
          'What is the legal penalty under Punjab Subsoil Act?'
        ]
      };
    }
  }

  // 2. June 12 transplanting date / legal window question
  if (q.includes('june 12') || q.includes('legal') || q.includes('act') || q.includes('12 june') || q.includes('11 june') || q.includes('20 june') || q.includes('ਨੋਟੀਫਾਈਡ') || q.includes('ਕਾਨੂੰਨ') || q.includes('अधिसूचित')) {
    return {
      id: `agent-${Date.now()}`,
      sender: 'agent',
      text: `**Legal Calendar Verification (Punjab Preservation of Subsoil Water Act):**\n\n- **In Ludhiana (Group 2 District):** The notified transplanting date is **June 20**.\n- **Transplanting on June 12 is an illegal violation** (8 days early) under Section 3(2).\n- **Risk & Penalty:** Under Section 5, you risk a fine of **₹10,000/month/hectare** (~₹4,047/acre/month), plus the Agriculture Department is empowered to uproot the crop.\n- **Agronomic Recommendation:** PR-126 matures in only 93 days! Transplanting on or after **June 20** is optimal because you capture the onset of monsoon rains, avoid scorching 44°C June evaporation, and still harvest by late September!`,
      timestamp: 'Just now',
      metricsHighlight: {
        label: 'Legal Requirement',
        value: 'Wait until June 20 in Ludhiana'
      },
      suggestedActions: [
        'How much diesel will I save waiting until June 20?',
        'Which districts are allowed from June 11?'
      ]
    };
  }

  // 3. Diesel savings / Pusa-44 vs PR-126 question
  if (q.includes('diesel') || q.includes('cost') || q.includes('pusa') || q.includes('pr-126') || q.includes('pr126') || q.includes('ਖਰਚਾ') || q.includes('ਡੀਜ਼ਲ') || q.includes('ਡੀਜਲ') || q.includes('डीजल')) {
    return {
      id: `agent-${Date.now()}`,
      sender: 'agent',
      text: `**Economics: Shifting 2 Acres from Pusa-44 to PR-126 with AWD:**\n\n- **Pusa-44 Baseline:** Takes 145 days in field, ~26 irrigations, ~145 tube-well hours/acre. Operating cost on 2 acres = **₹45,936** in diesel.\n- **PR-126 with AWD:** Takes only 93 days, ~18 irrigations, ~102 tube-well hours/acre. Operating cost on 2 acres = **₹32,312** in diesel.\n- **Your Exact Savings:**\n  - **86 Tube-well running hours saved** across 2 acres.\n  - **₹13,624 direct diesel cash saved** in your pocket!\n  - **2,700 m³ (27 lakh liters)** of precious Ludhiana groundwater preserved.\n- **Net Profit:** Because PR-126 saves ₹6,800/acre in fuel and inputs while yielding 31 qtl/acre at MSP ₹2,320, your net income is **₹42,964/acre** (higher than Pusa-44's ₹41,412/acre)!`,
      timestamp: 'Just now',
      metricsHighlight: {
        label: 'Net Cash Saved',
        value: '₹13,624 & 86 Pump Hours'
      },
      suggestedActions: [
        'What about stubble burning with PR-126?',
        'Can I also add 1 acre of Maize?'
      ]
    };
  }

  // 4. Pani Pipe / AWD guide
  if (q.includes('pani') || q.includes('pipe') || q.includes('awd') || q.includes('water tube') || q.includes('ਪਾਈਪ') || q.includes('पाइप')) {
    return {
      id: `agent-${Date.now()}`,
      sender: 'agent',
      text: `**How to Implement Alternate Wetting & Drying (AWD) with a "Pani-Pipe":**\n\n1. **Material:** Take a 40 cm long PVC pipe (diameter 15-20 cm).\n2. **Perforations:** Drill small holes (0.5 cm) in the lower 20 cm portion. Leave the top 20 cm solid.\n3. **Installation:** Push the pipe 20 cm deep into your paddy field 2 weeks after transplanting. Scoop out soil inside the pipe so you can see the water level.\n4. **Irrigation Trigger:**\n   - Water the field with 5 cm standing water.\n   - Do NOT irrigate again until the water inside the pipe drops **5 cm below soil level**.\n   - **Exception:** During flowering/panicle heading (about 2 weeks), keep 3-5 cm water continuously.\n5. **Result:** Saves 5 to 8 irrigations (25% water), zero yield penalty, and cuts root rot!`,
      timestamp: 'Just now',
      metricsHighlight: {
        label: 'AWD Rule',
        value: 'Re-irrigate only at -5 cm level'
      },
      suggestedActions: [
        'Does AWD reduce weed growth?',
        'Show 7-day irrigation forecast'
      ]
    };
  }

  // Default intelligent response
  return {
    id: `agent-${Date.now()}`,
    sender: 'agent',
    text: `Based on Punjab Agricultural University (PAU) research and CGWB observations for the Punjab central belt:\n\n- **Groundwater Status:** Most central blocks (Ludhiana, Sangrur, Moga) have water tables between 18m and 32m, depleting at 50–70 cm/year.\n- **Recommended Strategy:** Avoid long-duration Pusa-44. Adopt short-duration **PR-126** or **Direct Seeded Rice (DSR)** with **Alternate Wetting & Drying (AWD)**.\n- **Legal Compliance:** Wait until your district's notified transplanting date (${q.includes('amritsar') ? 'June 11' : 'June 20'}) to avoid ₹10,000/ha/month fines.\n- **Savings Insight:** Delaying transplanting and using AWD saves 35–45 tube-well running hours and ₹6,000–₹8,000 in diesel per acre.`,
    timestamp: 'Just now',
    suggestedActions: [
      'I have 4 acres in Ludhiana, tube-well depth 18 m, rain expected Thursday—when should I irrigate?',
      'Can I transplant PR-126 on June 12 in Ludhiana?',
      'How to make an AWD Pani-Pipe?'
    ]
  };
}
