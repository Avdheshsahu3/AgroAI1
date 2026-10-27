import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const LanguageContext = createContext(null)

// Comprehensive Hindi Dictionary for AgroAI
export const HI_DICTIONARY = {
  'Current Mandi Rate': 'वर्तमान मंडी दर',
  'Enter your password': 'अपना पासवर्ड दर्ज करें',
  'Reset conversation': 'बातचीत रीसेट करें',
  'Action': 'कार्रवाई',
  'Wind': 'हवा की गति',
  'pH Level': 'pH स्तर',
  'pH': 'pH',
  'e.g. Alluvial Loam, Black Cotton Soil, Red Soil': 'जैसे जलोढ़ दोमट, काली कपास मिट्टी, लाल मिट्टी',
  'e.g. Discrepancy in Soil Nitrogen reading on USB sensor': 'जैसे USB सेंसर पर मिट्टी नाइट्रोजन रीडिंग में अंतर',
  'e.g. Pune, Maharashtra or Ludhiana, Punjab': 'जैसे पुणे, महाराष्ट्र या लुधियाना, पंजाब',
  'e.g. Ramesh Patel': 'जैसे रमेश पटेल',
  'e.g. Jabalpur, Madhya Pradesh': 'जैसे जबलपुर, मध्य प्रदेश',
  'AgroAI Agronomist is analyzing telemetry &amp; formulations...': 'एग्रोएआई कृषि विशेषज्ञ टेलीमेट्री का विश्लेषण कर रहा है...',
  '% moisture': '% नमी',
  '☀️ Natural Daylight': '☀️ प्राकृतिक दिन का प्रकाश',
  '⚙️ FARM PREFERENCES & SENSOR CONFIG': '⚙️ खेत प्राथमिकताएं एवं सेंसर कॉन्फ़िगरेशन',
  '⚡ Instant 1-Click Test Specimens': '⚡ त्वरित 1-क्लिक परीक्षण नमूने',
  '✉️ Email Support': '✉️ ईमेल सहायता',
  '✨ Gemini AI': '✨ Gemini AI',
  '✨ Healthy': '✨ स्वस्थ पत्ती',
  '✨ Powered by Gemini AI': '✨ Gemini AI द्वारा संचालित',
  '🌧️ Extreme Precipitation & Storm Warnings': '🌧️ अत्यधिक वर्षा एवं आंधी-तूफ़ान चेतावनी',
  '🌾 Powdery Mildew': '🌾 चूर्णिल आसिता',
  '🍂 Blight': '🍂 झुलसा',
  '🍃 Check Leaf Underside': '🍃 पत्ती की निचली सतह देखें',
  '🍃 Leaf Spot': '🍃 पत्ती धब्बा',
  '🎧 24/7 KRISHI HELPDESK & FARMER SUPPORT': '🎧 24/7 कृषि हेल्पडेस्क एवं किसान सहायता',
  '🐛 Regional Pest & Disease Outbreak Radar': '🐛 क्षेत्रीय कीट एवं रोग प्रकोप रडार',
  '💧 Evapotranspiration Irrigation Prompts': '💧 वाष्पीकरण-उत्सर्जन सिंचाई संकेत',
  '💬 Chat With AI': '💬 एआई से चैट करें',
  '📈 APMC Mandi 30-Day High Price Alerts': '📈 APMC मंडी 30-दिवसीय उच्चतम मूल्य अलर्ट',
  '📍 Find Nearest KVK': '📍 नज़दीकी केवीके खोजें',
  '📞 1800-180-1551': '📞 1800-180-1551',
  '🔄 Viable Alternative / Companion Choices': '🔄 अन्य उपयुक्त विकल्प / सह-फ़सलें',
  '🔍 Sharp Macro Focus': '🔍 स्पष्ट मैक्रो फ़ोकस',
  '🔬 AI PHYTOSANITARY PATHOLOGY LAB': '🔬 एआई पादप रोग विज्ञान प्रयोगशाला',
  '100% Free Lifetime Account': '100% आजीवन निःशुल्क खाता',
  '115200 bps (High-Speed ESP32 / Arduino Telemetry)': '115200 bps (हाई-स्पीड ESP32 / Arduino टेलीमेट्री)',
  '19200 bps (Industrial Modbus)': '19200 bps (औद्योगिक मॉडबस)',
  '24/7 AGRO-INTELLIGENCE': '24/7 कृषि बुद्धिमत्ता',
  '24/7 dedicated support, government schemes helpline, agronomy expert guidance, and troubleshooting resources.': '24/7 समर्पित सहायता, सरकारी योजनाएं हेल्पलाइन, कृषि विशेषज्ञ मार्गदर्शन।',
  '24h Change': '24 घंटे का बदलाव',
  '24h Shift:': '24 घंटे का बदलाव:',
  '26°C • Moderate Monsoon': '26°C • मध्यम मानसून',
  '28°C • Clear Sky': '28°C • साफ़ आसमान',
  '60% less water usage': '60% कम पानी की खपत',
  '7-Day': '7-दिवसीय',
  '7-Day Agro Weather Forecast': '7-दिवसीय कृषि मौसम पूर्वानुमान',
  '7-Day Weather Forecast': '7-दिवसीय मौसम पूर्वानुमान',
  '7-Day Weather Radar & Predictive Trajectory': '7-दिवसीय मौसम पूर्वानुमान एवं विश्लेषण',
  '94% Model Match': '94% मॉडल मिलान',
  '9600 bps (Standard NPK Sensor Probes)': '9600 bps (मानक NPK सेंसर जांच)',
  'Absolutely. Your farm telemetry, location, acreage, and soil records are encrypted and strictly confidential. They are used exclusively to calculate your personalized agronomic advisories and are never shared or sold to commercial third parties.': 'बिल्कुल। आपकी खेत टेलीमेट्री, स्थान, क्षेत्रफल और मिट्टी के रिकॉर्ड पूरी तरह से एन्क्रिप्टेड और गोपनीय हैं। इनका उपयोग केवल आपकी व्यक्तिगत कृषि सलाह की गणना के लिए किया जाता है और कभी किसी तीसरे पक्ष को नहीं दिया जाता।',
  'Account & Profile Settings': 'खाता एवं प्रोफ़ाइल सेटिंग्स',
  'Acidic': 'अम्लीय',
  'acre': 'एकड़',
  'Actionable farm decisions synthesized from 7-day temperature swings, precipitation forecast, and wind velocities.': '7-दिवसीय तापमान उतार-चढ़ाव, वर्षा पूर्वानुमान और हवा की गति से तैयार किए गए व्यावहारिक खेत निर्णय।',
  'ACTIVE ENDPOINT': 'सक्रिय एंडपॉइंट',
  'Active Port': 'सक्रिय पोर्ट',
  'Add soil data to see a recommendation for your farm.': 'अपने खेत के लिए एआई सुझाव पाने हेतु मिट्टी का डेटा जोड़ें।',
  'Advisory System': 'परामर्श प्रणाली',
  'Agri Produce': 'कृषि उपज',
  'Agricultural Weather & Climate Intelligence': 'कृषि मौसम एवं जलवायु बुद्धिमत्ता',
  'Agro-Alerts': 'कृषि चेतावनियाँ',
  'AGRO-INTELLIGENCE': 'कृषि बुद्धिमत्ता',
  'AGRO-INTELLIGENCE CROP ENGINE': 'कृषि बुद्धिमत्ता फ़सल इंजन',
  'AgroAI': 'एग्रोएआई',
  'AgroAI Agronomist': 'एग्रोएआई कृषि विशेषज्ञ',
  'AgroAI Agronomist Advisor': 'एग्रोएआई कृषि विशेषज्ञ सलाहकार',
  'AgroAI Agronomist is analyzing telemetry & formulations...': 'एग्रोएआई कृषि विशेषज्ञ टेलीमेट्री का विश्लेषण कर रहा है...',
  'AgroAI Intelligent Assistant': 'एग्रोएआई बुद्धिमान सहायक',
  'Agronomic Compatibility Matrix': 'कृषि अनुकूलता मैट्रिक्स',
  'Agronomic Management Advisory': 'कृषि प्रबंधन सलाह',
  'Agronomic Model': 'कृषि विज्ञान मॉडल',
  'Agronomic Remediation Protocols': 'कृषि उपचार एवं सुधार प्रोटोकॉल',
  'Agronomic Support & Help Center': 'कृषि सहायता एवं समाधान केंद्र',
  'AI Agronomic Intelligence & Crop Advisory': 'एआई कृषि बुद्धिमत्ता एवं फ़सल परामर्श',
  'AI Agronomic Recommendation Engine': 'एआई कृषि विज्ञान फ़सल सुझाव इंजन',
  'AI Agronomist Advisory Chat': 'एआई कृषि परामर्श चैट',
  'AI Agronomist Chat': 'एआई कृषि विशेषज्ञ चैट',
  'AI Chatbot': 'एआई चैटबॉट',
  'AI Confidence': 'एआई विश्वसनीयता',
  'AI Crop Advisory': 'एआई फ़सल परामर्श',
  'AI Crop Disease Diagnostic Laboratory': 'एआई फ़सल रोग निदान प्रयोगशाला',
  'AI Crop Recommendation': 'एआई फ़सल सुझाव',
  'AI Crop Suitability Recommendations': 'एआई फ़सल उपयुक्तता सुझाव',
  'AI PHYTOSANITARY PATHOLOGY LAB': 'एआई पादप रोग विज्ञान प्रयोगशाला',
  'AI suggestion based on agro-meteorological data.': 'कृषि-मौसम डेटा पर आधारित एआई सुझाव।',
  'Alerts you when regional wholesale market prices for your crops surge above seasonal averages.': 'जब आपकी फ़सलों के थोक बाज़ार भाव मौसमी औसत से ऊपर बढ़ जाते हैं तो आपको अलर्ट करता है।',
  'Alkaline': 'क्षारीय',
  'All Commodities': 'सभी फ़सलें',
  'All States': 'सभी राज्य',
  'Alluvial Loam (River Plains)': 'जलोढ़ दोमट (नदी मैदानी भाग)',
  'Alluvial Plain': 'जलोढ़ मैदान (Alluvial)',
  'Alphabetical (A-Z)': 'वर्णमाला अनुसार (A-Z)',
  'Already have an account?': 'पहले से खाता है?',
  'Already registered with AgroAI?': 'क्या आप पहले से एग्रोएआई में पंजीकृत हैं?',
  'Alternative Crop Matches': 'अन्य उपयुक्त फ़सलें',
  'Analyze Soil Readings': 'मिट्टी परीक्षण देखें',
  'Analyzing Soil Chemistry & Meteorology...': 'मिट्टी रसायन और मौसम का विश्लेषण किया जा रहा है...',
  'Andhra Pradesh': 'आंध्र प्रदेश',
  'APMC': 'APMC',
  'APMC Mandi Intelligence Network': 'APMC मंडी विश्लेषण नेटवर्क',
  'APMC Mandi Source': 'APMC मंडी स्रोत',
  'APMC Market Outlook': 'APMC बाज़ार दृष्टिकोण',
  'Apple': 'सेब',
  'Application Language': 'एप्लिकेशन भाषा',
  'Apply cold-pressed Neem oil (3-5 ml/L) as a routine preventive repellent every 15-20 days.': 'नियमित निवारक के रूप में हर 15-20 दिनों में नीम का तेल (3-5 मिली/लीटर) छिड़कें।',
  'Apply Mancozeb 75% WP or Chlorothalonil 75% WP at the first onset of concentric lesions. For advanced spread, rotate with Azoxystrobin.': 'लक्षण दिखने पर मैंकोजेब 75% WP या क्लोरोथैलोनिल 75% WP का छिड़काव करें।',
  'Arhar': 'अरहर',
  'Arrival Date': 'आवक तिथि',
  'Arrival Date (Newest)': 'आवक तिथि (नवीनतम)',
  'Arrivals': 'आवक',
  'Ask about Wheat, leaf yellowing, fertilizers, watering, or pests...': 'गेहूं, पत्तों का पीलापन, खाद, सिंचाई या कीटों के बारे में पूछें...',
  'Ask any question... (e.g. crop care, fertilizers, weather, math, general knowledge)': 'कोई भी प्रश्न पूछें... (फ़सल, खाद, मौसम, गणित, सामान्य ज्ञान आदि)',
  'Ask anything • Crop & Soil Science • Weather • General Knowledge': 'कुछ भी पूछें • फ़सल एवं मिट्टी विज्ञान • मौसम • सामान्य ज्ञान',
  'Ask anything • Farming & Crop Care • Weather • General Knowledge': 'कुछ भी पूछें • खेती एवं फ़सल प्रबंधन • मौसम • सामान्य ज्ञान',
  'Assam': 'असम',
  'Atmospheric Curves': 'वायुमंडलीय स्थिति',
  'Auto-Fill Sample Data': 'नमूना डेटा स्वतः भरें',
  'Auto-Sync Telemetry Frequency': 'ऑटो-सिंक टेलीमेट्री आवृत्ति',
  'Automatic location lookup with current conditions and a 7-day forecast, powered by Open-Meteo.': 'स्थान के अनुसार सटीक मौसम और 7 दिनों का मौसम पूर्वानुमान।',
  'Average Modal Rate': 'औसत मॉडल भाव',
  'Back to Recommendation Engine': 'फ़सल सुझाव इंजन पर वापस जाएं',
  'Bajra': 'बाजरा',
  'Banana': 'केला',
  'Bar Chart View': 'बार चार्ट दृश्य',
  'Barley': 'जौ',
  'Barometric Pressure:': 'वायुमंडलीय दबाव:',
  'Bars reflect predicted 24-hr precipitation accumulation (mm)': 'स्तंभ 24 घंटे की अनुमानित वर्षा संचय (मिमी) दर्शाते हैं',
  'Below benchmark. Consider supplementary top-dressing.': 'मानक से कम। पूरक उर्वरक देने पर विचार करें।',
  'Bicarbonate & Milk Emulsion': 'बाइकार्बोनेट एवं छाछ मिश्रण',
  'Bihar': 'बिहार',
  'Biological Antagonists': 'जैविक प्रतिरोधी',
  'Black Cotton': 'काली कपास मिट्टी (Black Soil)',
  'Black Cotton Soil (Regur)': 'काली कपास मिट्टी (रेगुर)',
  'Boosts disease resistance & grain/fruit fullness.': 'रोग प्रतिरोधक क्षमता और दानों/फलों की गुणवत्ता बढ़ाता है।',
  'Botanical & Copper Soap Extracts': 'वानस्पतिक एवं कॉपर साबुन निष्कर्ष',
  'Brinjal': 'बैंगन',
  'Broad-Spectrum Copper / Systemic': 'व्यापक-स्पेक्ट्रम कॉपर कवकनाशी',
  'Calculates daily soil moisture loss and advises on optimal dawn/dusk drip cycles.': 'दैनिक मिट्टी की नमी के नुकसान की गणना करता है और सुबह/शाम ड्रिप सिंचाई चक्र की सलाह देता है।',
  'Calibrate NPK nutrients, stream live RS485 soil sensor feeds, and analyze moisture equilibrium across farm zones.': 'NPK पोषक तत्वों की जांच करें, लाइव RS485 सेंसर डेटा देखें, और खेत के विभिन्न हिस्सों में नमी का संतुलन बनाएं।',
  'Calibrated for Indian soil agro-ecological zones': 'भारतीय मिट्टी कृषि-पारिस्थितिकी क्षेत्रों के लिए कैलिब्रेटेड',
  'Calibrating and Saving Soil Profile...': 'मिट्टी प्रोफ़ाइल कैलिब्रेट और सहेजी जा रही है...',
  'Camera Snap': 'कैमरा से फोटो लें',
  'Can I connect my own RS-485 / USB / Modbus soil sensor probe?': 'क्या मैं अपना RS-485 / USB / मॉडबस मिट्टी सेंसर जोड़ सकता हूँ?',
  'Canopy Airflow & De-crowding': 'वायु संचार एवं छंटाई',
  'Capture under soft morning or overcast light. Avoid harsh direct sun glare that washes out lesion margins.': 'सुबह की हल्की धूप या बादलों के प्रकाश में फ़ोटो लें। सीधी तेज़ धूप से बचें जिससे धब्बे धुंधले हो जाते हैं।',
  'Card Grid View': 'कार्ड ग्रिड दृश्य',
  'Cash Crop': 'नकदी फ़सल',
  'Cash/Oilseeds': 'नकदी/तिलहन',
  'Caution / Delay': 'सावधानी / स्थगित करें',
  'Caution Drift': 'छिड़काव में सावधानी',
  'Cercospora Leaf Spot': 'सर्कोस्पोरा पत्ती धब्बा',
  'Cereal': 'अनाज',
  'Cereal rotation staple': 'अनाज चक्र मुख्य फ़सल',
  'Cereals': 'अनाज',
  'Chana': 'चना',
  'Change': 'बदलाव',
  'Changes will sync across recommendations and weather telemetry.': 'परिवर्तन फ़सल सुझावों और मौसम टेलीमेट्री में समन्वयित हो जाएंगे।',
  'Chat with AI about': 'के बारे में एआई से चैट करें',
  'Chemical Remedy': 'रासायनिक उपचार',
  'Chhattisgarh': 'छत्तीसगढ़',
  'Chickpea': 'चना',
  'Chili': 'मिर्च',
  'Chilli': 'मिर्च',
  'Circular necrotic spots with ashy gray centers and dark reddish-brown margins. Causes progressive yellowing and severe defoliation.': 'राख जैसे धूसर केंद्र और गहरे लाल-भूरे किनारों वाले गोल धब्बे। पत्तियां पीली पड़कर गिरती हैं।',
  'Clayey Loam': 'चिकनी दोमट',
  'Clean Specimen (Control)': 'स्वच्छ नमूना (नियंत्रण)',
  'Clear': 'साफ़ मौसम ☀️',
  'Clear Sky': 'साफ़ आसमान',
  'Click any profile to load calibrated ranges': 'कैलिब्रेटेड मान लोड करने के लिए किसी भी प्रोफ़ाइल पर क्लिक करें',
  'Click to view detailed price spread & profit calculator': 'विस्तृत मूल्य अंतर और लाभ कैलकुलेटर देखने के लिए क्लिक करें',
  'Climate & Weather Sync': 'जलवायु एवं मौसम समन्वय',
  'Cloud Cover': 'बादलों का आवरण',
  'Cloudy': 'बादल छाए रहेंगे ☁️',
  'CNN Pathology': 'विज़न रोग निदान',
  'Coastal Sandy': 'तटीय रेतीली मिट्टी (Coastal Sandy)',
  'Coffee': 'कॉफ़ी',
  'Collect and destroy fallen leaf debris after harvest. Avoid planting nightshades or susceptible host crops in the same plot consecutively.': 'कटाई के बाद गिरी हुई संक्रमित पत्तियों को नष्ट करें। एक ही खेत में लगातार संवेदनशील फ़सल न लगाएं।',
  'Combine your soil readings with local weather to get a crop suggestion with a clear explanation.': 'मिट्टी की जांच और स्थानीय मौसम के आधार पर वैज्ञानिक फ़सल सुझाव प्राप्त करें।',
  'Commodity': 'फ़सल / वस्तु',
  'Complete Farm Registration': 'खेत पंजीकरण पूरा करें',
  'Complete your farm profile': 'अपनी खेती की प्रोफ़ाइल पूरी करें',
  'Computer Vision': 'कंप्यूटर विज़न',
  'Confidence Score': 'विश्वसनीयता स्कोर',
  'Configure baud rates, Modbus communication, and calibration offsets for RS-485 / USB NPK sensor hardware.': 'RS-485 / USB NPK सेंसर हार्डवेयर के लिए बॉड दरें, मॉडबस संचार और अंशांकन ऑफ़सेट कॉन्फ़िगर करें।',
  'Connect device and read': 'डिवाइस जोड़ें और पढ़ें',
  'Connect directly with Krishi Vigyan Kendra scientists in your district.': 'अपने ज़िले के कृषि विज्ञान केंद्र के वैज्ञानिकों से सीधा संपर्क करें।',
  'Connect USB Sensor': 'USB सेंसर कनेक्ट करें',
  'Connected. Waiting for a newline-delimited JSON reading…': 'कनेक्ट हो गया। सेंसर डेटा की प्रतीक्षा है...',
  'Connecting to AgroAI Agronomist & Telemetry...': 'एग्रोएआई और टेलीमेट्री से कनेक्ट किया जा रहा है...',
  'Consulting regarding:': 'परामर्श विषय:',
  'Controls how frequently soil readings are saved into your agronomic database.': 'यह नियंत्रित करता है कि मिट्टी के आंकड़े कितनी बार आपके डेटाबेस में सहेजे जाते हैं।',
  'Copied': 'कॉपी किया गया',
  'Copper Oxychloride @ 3 g/L (45 g per 15L knapsack)': 'कॉपर ऑक्सीक्लोराइड @ 3 ग्राम/लीटर (45 ग्राम प्रति 15 लीटर पंप)',
  'Copy message': 'संदेश कॉपी करें',
  'Copy Treatment': 'उपचार कॉपी करें',
  'Core biological parameters': 'मुख्य जैविक मापदंड',
  'Coriander': 'धनिया',
  'Corn': 'मक्का',
  'Cotton': 'कपास',
  'Create a Free Farm Account': 'निःशुल्क किसान खाता बनाएं',
  'Create account': 'नया खाता बनाएं',
  'Create Digital Plot Profile': 'डिजिटल खेत प्रोफ़ाइल बनाएं',
  'Create Farmer Account': 'किसान खाता बनाएं',
  'Create your AgroAI account': 'अपना एग्रोएआई खाता बनाएं',
  'Creating account...': 'खाता बनाया जा रहा है...',
  'Crop': 'फ़सल',
  'Crop Advisory': 'फ़सल परामर्श',
  'Crop Disease Detection': 'फ़सल रोग पहचान',
  'Crop Disease Detection & Diagnosis': 'फ़सल रोग पहचान एवं निदान',
  'Crop Disease Scanner': 'फ़सल रोग स्कैनर',
  'Crop Duration': 'फ़सल अवधि',
  'Crop Engine': 'फ़सल इंजन',
  'Crop preview': 'फ़सल का पूर्वावलोकन',
  'Crop Recommendation': 'फ़सल सुझाव',
  'Crop Recommendation & Advisory': 'फ़सल सुझाव एवं कृषि परामर्श',
  'Crop Recommendation Advisory': 'फ़सल सुझाव परामर्श',
  'Crop Residue & Rotation': 'फ़सल अवशेष एवं चक्र',
  'Crop Rotation Synergy': 'फ़सल चक्र तालमेल',
  'Cultural Care': 'कृषि प्रबंधन',
  'Cumin': 'जीरा',
  'Current Rate': 'वर्तमान दर',
  'Current Rate:': 'वर्तमान दर:',
  'Current Weather': 'मौजूदा मौसम',
  'Current Weather Station': 'वर्तमान मौसम केंद्र',
  'Currently using': 'वर्तमान में प्रयुक्त',
  'Daily Price Trend': 'दैनिक भाव रुझान',
  'Dark brown to black necrotic spots showing characteristic "target-board" concentric rings, frequently encircled by yellow chlorotic tissue.': 'गहरे भूरे या काले धब्बे जिनमें संकेंद्री छल्ले दिखते हैं और पीले ऊतकों से घिरे होते हैं।',
  'Dashboard': 'डैशबोर्ड',
  'Data & Exports': 'डेटा एवं निर्यात',
  'Data & Security': 'डेटा एवं सुरक्षा',
  'Data-driven crop decisions for every farmer, in every field.': 'हर किसान और हर खेत के लिए डेटा आधारित सटीक निर्णय।',
  'Day High:': 'दिन का अधिकतम:',
  'Daytime High (°C)': 'दिन का अधिकतम तापमान (°C)',
  'Deep CNN Computer Vision': 'डीप सीएनएन कंप्यूटर विज़न',
  'Default Regional Baseline': 'डिफ़ॉल्ट क्षेत्रीय मानक',
  'Demand': 'मांग',
  'Detailed Description': 'विस्तृत विवरण',
  'Detect Disease': 'रोग की पहचान करें',
  'Detecting...': 'रोग की जाँच हो रही है...',
  'Determines seed germination and root oxygenation.': 'बीज अंकुरण और जड़ों को ऑक्सीजन उपलब्धता निर्धारित करता है।',
  'Device disconnected.': 'डिवाइस डिस्कनेक्ट हो गया।',
  'Diagnosis Match': 'निदान मिलान',
  'Diagnosis Results': 'निदान परिणाम',
  'Diluted sour buttermilk (1:10 ratio with water)': 'खट्टी छाछ (1:10 के अनुपात में पानी के साथ)',
  'Direct access to agricultural scientists, kisan toll-free hotlines, interactive troubleshooting guides, and AI chat assistance.': 'कृषि वैज्ञानिकों, किसान टोल-फ्री हेल्पलाइन, समस्या निवारण मार्गदर्शिकाओं और एआई चैट सहायता तक सीधी पहुंच।',
  'Direct Agronomist Inquiry': 'कृषि वैज्ञानिक से सीधा संपर्क',
  'Disconnect': 'डिस्कनेक्ट करें',
  'Disease Detection & Fungicides': 'रोग पहचान एवं कवकनाशी',
  'Disease Scanner': 'रोग स्कैनर',
  'District': 'ज़िला',
  'District & State': 'जिला एवं राज्य',
  'District KVK Centers': 'जिला कृषि विज्ञान केंद्र (KVK)',
  'Dominant Soil Type': 'मुख्य मिट्टी का प्रकार',
  'Don\'t have an account yet?': 'क्या आपका अभी तक कोई खाता नहीं है?',
  'Done': 'पूर्ण',
  'Dosage:': 'मात्रा:',
  'Download complete JSON data packet containing your soil NPK timeline, crop rotations, and IoT configurations.': 'मिट्टी के NPK समय-सारणी, फ़सल चक्र और IoT कॉन्फ़िगरेशन युक्त पूर्ण JSON डेटा पैकेट डाउनलोड करें।',
  'Download Data (JSON)': 'डेटा डाउनलोड करें (JSON)',
  'Drag & drop your leaf image here, or browse files': 'अपनी पत्ती की छवि यहाँ खींचें और छोड़ें, या फ़ाइल चुनें',
  'Drag & drop, or click to upload a crop or leaf image': 'पत्ती या फ़सल की फ़ोटो यहाँ खींचें या अपलोड करने के लिए क्लिक करें',
  'Drizzle': 'बूंदाबांदी',
  'Dry': 'सूखी',
  'Dynamic Weather Analytics & Advisory Planner': 'मौसम विश्लेषण एवं कृषि योजनाकार',
  'Early Blight': 'अगेती झुलसा (Early Blight)',
  'Eco-Safe': 'पर्यावरण अनुकूल',
  'Email': 'ईमेल',
  'Email Address': 'ईमेल पता',
  'Email Helpdesk': 'ईमेल हेल्पडेस्क',
  'Empowering your farm with actionable AI telemetry': 'व्यावहारिक एआई टेलीमेट्री से अपने खेत को सशक्त बनाएं',
  'English': 'अंग्रेज़ी',
  'Enriches soil nitrogen': 'मिट्टी में नाइट्रोजन बढ़ाता है',
  'Enter any Indian district or tehsil': 'कोई भी भारतीय जिला या तहसील दर्ज करें',
  'Enter your farm location above to load weather, soil health and a crop recommendation.': 'मौसम, मिट्टी की सेहत और फ़सल सुझाव देखने के लिए ऊपर खेत का स्थान दर्ज करें।',
  'Enter your registered credentials to access your farm diagnostics.': 'अपनी खेत जांच तक पहुंचने के लिए पंजीकृत क्रेडेंशियल दर्ज करें।',
  'Estimate Revenue at Mandi Modal Rate:': 'मंडी मॉडल दर पर अनुमानित आय:',
  'Estimated Gross Payout:': 'अनुमानित कुल भुगतान:',
  'Every 15 Minutes (Standard Field Sampling)': 'प्रत्येक 15 मिनट (मानक क्षेत्रीय नमूना)',
  'Every 5 Seconds (Live Streaming Probe)': 'प्रत्येक 5 सेकंड (लाइव स्ट्रीमिंग जांच)',
  'Excellent intercropping partner': 'उत्कृष्ट अंतर-फ़सली साथी',
  'Excellent range for maximum nutrient uptake.': 'अधिकतम पोषक तत्व अवशोषण के लिए उत्कृष्ट सीमा।',
  'Exceptional Agronomic Match': 'असाधारण कृषि मिलान',
  'Expected yield and mandi price for': 'की अपेक्षित उपज और मंडी भाव क्या है',
  'Expert agricultural consultation • Diagnostic leaf analysis • Sowing & NPK advisory': 'विशेषज्ञ कृषि परामर्श • पत्ती रोग निदान • बुवाई एवं NPK सलाह',
  'Export CSV': 'CSV निर्यात करें',
  'Export Farm Telemetry File': 'खेत टेलीमेट्री फ़ाइल निर्यात करें',
  'Export filtered records to CSV': 'फ़िल्टर किए गए रिकॉर्ड CSV में निर्यात करें',
  'Export full records of your soil readings, recommendations, and farm telemetry for bank crop loan verification or agronomist review.': 'बैंक फ़सल ऋण सत्यापन या कृषि वैज्ञानिक समीक्षा के लिए अपने मिट्टी परीक्षण, सुझावों और खेत टेलीमेट्री के पूर्ण रिकॉर्ड निर्यात करें।',
  'FAQs & Helpline': 'प्रश्नोत्तरी एवं हेल्पलाइन',
  'Farm Area': 'खेत का क्षेत्रफल',
  'Farm Area (acres)': 'खेत का क्षेत्रफल (एकड़)',
  'Farm Area (Acres)': 'खेत का क्षेत्रफल (एकड़)',
  'Farm Data Governance & Exports': 'खेत डेटा शासन एवं निर्यात',
  'Farm Health Index': 'खेत स्वास्थ्य सूचकांक',
  'Farm Location': 'खेत का स्थान',
  'Farm Location (District, State)': 'खेत का स्थान (जिला, राज्य)',
  'Farm Location (Tehsil / District, State)': 'खेत का स्थान (तहसील / जिला, राज्य)',
  'Farm Location (Village/City, State)': 'खेत का स्थान (गाँव/शहर, राज्य)',
  'Farm Overview': 'खेत अवलोकन',
  'Farm Preferences & Sensor Config': 'खेत सेटिंग्स एवं सेंसर कॉन्फ़िगरेशन',
  'Farm Settings & Configurations': 'खेत सेटिंग्स एवं कॉन्फ़िगरेशन',
  'Farmer Help & Knowledge Center': 'किसान सहायता एवं ज्ञान केंद्र',
  'Farmer Profile': 'किसान प्रोफ़ाइल',
  'Farmer Profile & Identity': 'किसान प्रोफ़ाइल एवं पहचान',
  'Farmer Sign In': 'किसान साइन इन',
  'Farming Activity Guidance': 'खेती कार्य मार्गदर्शन',
  'Farming Q&A Copilot': 'खेती प्रश्नोत्तरी सहायक',
  'Favorable Window': 'अनुकूल समय',
  'Feels like': 'महसूस होता है',
  'Fertility Index': 'उर्वरता सूचकांक',
  'Fertilizer dosage for': 'के लिए खाद की मात्रा',
  'Fetching live rates from mandi-api.onrender.com...': 'mandi-api से लाइव दरें प्राप्त की जा रही हैं...',
  'Fetching weather...': 'मौसम की जानकारी लाई जा रही है...',
  'FIELD & MARKET TOOLS': 'खेत एवं बाज़ार उपकरण',
  'Field Operations': 'खेत के कार्य',
  'Field Photography Tips for 95%+ Diagnostic Accuracy': '95%+ निदान सटीकता के लिए फ़ील्ड फ़ोटोग्राफ़ी टिप्स',
  'Field Sanitation & Irrigation': 'खेत की स्वच्छता एवं सिंचाई',
  'Field Telemetry Diagnostics': 'खेत टेलीमेट्री जांच',
  'Field Workability': 'खेत कार्यशीलता',
  'Filter market, district, variety...': 'बाज़ार, जिला, किस्म खोजें...',
  'Fine-tune raw sensor voltage readings to align with chemical laboratory soil test results.': 'रासायनिक प्रयोगशाला मिट्टी परीक्षण परिणामों के साथ संरेखित करने के लिए सेंसर वोल्टेज रीडिंग को ठीक करें।',
  'Floor rate recorded': 'दर्ज न्यूनतम दर',
  'Fog': 'कोहरा',
  'Foliar application of Wettable Sulfur 80% WP or Hexaconazole 5% EC. Provides rapid eradication of surface fungal mycelia.': 'घुलनशील गंधक 80% WP या हेक्साकोनाज़ोल 5% EC का छिड़काव करें।',
  'Foliar hydration balance': 'पत्तियों का जलयोजन संतुलन',
  'Foliar spray with Trichoderma viride or Pseudomonas fluorescens to colonize leaf surface and outcompete Alternaria hyphae.': 'ट्राइकोडर्मा विरिडी या स्यूडोमोनास फ्लोरेसेंस का पर्णीय छिड़काव करें।',
  'For best computer vision accuracy, ensure the photo is taken in natural indirect daylight, focused closely on the lesion spots (10-15 cm away). If an unusual infection occurs, you can use our 24/7 AI Agronomist Chat or dial the Kisan Call Center at 1800-180-1551 for local expert plant pathologist advice.': 'सर्वोत्तम सटीकता के लिए, प्राकृतिक अप्रत्यक्ष धूप में पत्ती के धब्बों के करीब (10-15 सेमी दूर) स्पष्ट फ़ोटो लें। यदि कोई असामान्य संक्रमण हो, तो आप 24/7 एआई चैट का उपयोग कर सकते हैं या 1800-180-1551 पर किसान कॉल सेंटर से सलाह ले सकते हैं।',
  'for better insights': 'बेहतर फ़सल परिणामों के लिए',
  'Free Farmer Onboarding': 'निःशुल्क किसान पंजीकरण',
  'Frequently Asked Questions': 'अक्सर पूछे जाने वाले प्रश्न (FAQ)',
  'Frost': 'पाला',
  'Fruit': 'फल',
  'Full Name': 'पूरा नाम',
  'Fungal spores (like Powdery Mildew or Rust) often flourish on the leaf underside; photograph both surfaces.': 'फंगल बीजाणु (जैसे पाउडरी मिल्ड्यू या रतुआ) अक्सर पत्ती के निचले हिस्से पर पनपते हैं; दोनों सतहों की तस्वीर लें।',
  'Garlic': 'लहसुन',
  'Gemini AI': 'Gemini AI',
  'Gemini AI Connected': 'Gemini AI कनेक्टेड',
  'Generate AI Crop Recommendation': 'एआई फ़सल सुझाव प्राप्त करें',
  'Generate Recommendation': 'फ़सल सुझाव प्राप्त करें',
  'Generating AI Recommendation...': 'एआई फ़सल सुझाव तैयार हो रहा है...',
  'Get AI crop recommendations, disease cures, and live APMC commodity tracking.': 'एआई फ़सल सुझाव, रोग निदान और लाइव APMC कमोडिटी ट्रैकिंग प्राप्त करें।',
  'Get Recommendation': 'फ़सल सुझाव प्राप्त करें',
  'Get Started': 'शुरू करें',
  'Ginger': 'अदरक',
  'Good afternoon': 'शुभ दोपहर',
  'Good evening': 'शुभ संध्या',
  'Good morning': 'सुप्रभात',
  'Got questions? We\\\'re here to help.': 'कोई सवाल है? हम आपकी सहायता के लिए तैयार हैं।',
  'Government Agmarknet (Data.gov.in)': 'सरकारी एगमार्कनेट (Data.gov.in)',
  'Government KVK Linkage': 'सरकारी कृषि विज्ञान केंद्र (KVK) संपर्क',
  'Grade': 'श्रेणी (Grade)',
  'Grade A Soil': 'ग्रेड A मिट्टी',
  'Gram': 'चना',
  'Grapes': 'अंगूर',
  'Great rotational cereal': 'उत्कृष्ट चक्रीय अनाज',
  'Grid Cards View': 'ग्रिड कार्ड दृश्य',
  'Groundnut': 'मूँगफली',
  'Grow smarter with AgroAI': 'एग्रोएआई के साथ स्मार्ट खेती करें',
  'Grow Smarter with AgroAI': 'एग्रोएआई के साथ स्मार्ट खेती करें',
  'Guava': 'अमरूद',
  'Gujarat': 'गुजरात',
  'Gypsum or compost helps moderate alkalinity.': 'जिप्सम या कम्पोस्ट क्षारीयता को नियंत्रित करने में मदद करता है।',
  'Haldi': 'हल्दी',
  'Hardware Serial Soil Sensor': 'हार्डवेयर सीरियल मिट्टी सेंसर',
  'Harvest & Storage': 'कटाई एवं सुरक्षित भंडारण',
  'Harvest Profitably': 'लाभकारी उपज प्राप्त करें',
  'Haryana': 'हरियाणा',
  'Healthy Green Foliage': 'स्वस्थ हरी पत्तियां',
  'Healthy Leaf': 'स्वस्थ पत्ती (Healthy Leaf)',
  'Heavy rain': 'भारी बारिश 🌧️',
  'Heavy Rain': 'भारी वर्षा',
  'Help & Support': 'सहायता और समर्थन',
  'High': 'अधिक',
  'High (Max):': 'अधिकतम (Max):',
  'High clay, excellent water retention for cotton & soybean': 'कपास और सोयाबीन के लिए उच्च जल-धारण क्षमता वाली मिट्टी',
  'High Confidence': 'उच्च विश्वसनीयता',
  'High Demand': 'भारी मांग',
  'High Evaporation': 'अत्यधिक वाष्पीकरण',
  'High Liquidity': 'उच्च तरलता',
  'High moisture. Ensure good drainage.': 'अधिक नमी। उचित जल निकासी सुनिश्चित करें।',
  'High oil content value': 'उच्च तेल मात्रा मूल्य',
  'High Risk • Necrotic Lesions': 'उच्च जोखिम • नेक्रोटिक धब्बे',
  'High Spread • Spore Colony': 'तीव्र फैलाव • बीजाणु कॉलोनी',
  'High-Resolution Image Diagnosis': 'उच्च-गुणवत्ता छवि निदान',
  'Higher volumetric yield': 'अधिक मात्रा में उत्पादन',
  'Highest Price ⬇': 'उच्चतम भाव ⬇',
  'Himachal Pradesh': 'हिमाचल प्रदेश',
  'Hindi': 'हिन्दी',
  'Hourly (Battery Saver Mode)': 'प्रति घंटा (बैटरी सेवर मोड)',
  'How AgroAI Powers Your Farm': 'एग्रोएआई आपके खेत को कैसे सशक्त बनाता है',
  'How can I access local Krishi Vigyan Kendra (KVK) physical soil testing?': 'मैं स्थानीय कृषि विज्ञान केंद्र (KVK) भौतिक मिट्टी परीक्षण कैसे करा सकता हूँ?',
  'How does AgroAI calculate crop recommendations?': 'एग्रोएआई फ़सल सुझावों की गणना कैसे करता है?',
  'How frequently are APMC Mandi wholesale commodity rates updated?': 'APMC मंडी थोक कमोडिटी दरें कितनी बार अपडेट होती हैं?',
  'How to apply for Kisan Credit Card (KCC)?': 'किसान क्रेडिट कार्ड (KCC) के लिए कैसे आवेदन करें?',
  'How to grow': 'की खेती कैसे करें',
  'How to prepare organic compost?': 'जैविक कम्पोस्ट कैसे बनाएं?',
  'How to prevent pests organically in': 'में जैविक तरीके से कीट नियंत्रण कैसे करें',
  'Humidity': 'आर्द्रता',
  'Hyperlocal real-time weather, 7-day predictive forecasting, soil moisture impact, and automated crop advisory planner.': 'सटीक रीयल-टाइम मौसम, 7-दिवसीय पूर्वानुमान, मिट्टी नमी प्रभाव, और स्वचालित फ़सल परामर्श।',
  'Ideal nutrient density for crop growth.': 'फ़सल विकास के लिए आदर्श पोषक तत्व घनत्व।',
  'If you want to cross-reference your hardware sensors with government lab wet-chemistry soil testing, visit your district KVK center with 500g of composite topsoil taken from 5-6 points across your field. You can log the resulting certified NPK numbers in the Soil Data page.': 'यदि आप सरकारी प्रयोगशाला मिट्टी परीक्षण के साथ मिलान करना चाहते हैं, तो अपने खेत के 5-6 स्थानों से 500 ग्राम मिट्टी लेकर जिला KVK केंद्र जाएं। आप प्रमाणित NPK आंकड़े मिट्टी डेटा पृष्ठ में दर्ज कर सकते हैं।',
  'Immediate Chemical Protocol': 'रासायनिक उपचार',
  'In Window': 'अनुकूल अवधि में',
  'Input Soil & Region': 'मिट्टी एवं क्षेत्र दर्ज करें',
  'Inquiry Category': 'पूछताछ की श्रेणी',
  'Instant 1-Click Test Specimens': 'त्वरित 1-क्लिक परीक्षण नमूने',
  'Instant Leaf Scanner': 'त्वरित पत्ती स्कैनर',
  'Instant replies for fertilizer split dosages, weed control, and irrigation advice.': 'उर्वरक की सही मात्रा, खरपतवार नियंत्रण और सिंचाई सलाह के लिए तत्काल उत्तर।',
  'IoT device': 'IoT सेंसर डिवाइस',
  'IoT Hardware & Sensors': 'IoT हार्डवेयर एवं सेंसर',
  'IoT Soil Probes & Hardware': 'IoT मिट्टी सेंसर एवं उपकरण',
  'Irrigation Planning': 'सिंचाई योजना',
  'Irrigation recommended before sowing.': 'बुवाई से पहले सिंचाई की सलाह दी जाती है।',
  'Irrigation Schedule': 'सिंचाई समय-सारणी',
  'Irrigation schedule for': 'के लिए सिंचाई कार्यक्रम',
  'Is my farm acreage and yield data kept private and secure?': 'क्या मेरे खेत का क्षेत्रफल और उपज का डेटा निजी और सुरक्षित रहता है?',
  'Jharkhand': 'झारखंड',
  'Jowar': 'ज्वार',
  'Jute': 'जूट',
  'K Offset (kg/ha)': 'K ऑफ़सेट (किग्रा/हेक्टेयर)',
  'Karnataka': 'कर्नाटक',
  'Keep the camera lens 10–15 cm away from the infected spots, centering the leaf in 70% of the frame.': 'कैमरा लेंस को संक्रमित स्थानों से 10-15 सेमी दूर रखें, पत्ती को 70% फ्रेम में केंद्रित करें।',
  'Kerala': 'केरल',
  'kg/ha': 'किग्रा/हेक्टेयर',
  'Kisan Call Center': 'किसान कॉल सेंटर',
  'Knapsack Spraying Window': 'छिड़काव अनुकूलता खिड़की',
  'Knowledge Base': 'ज्ञान केंद्र',
  'KVK Directory': 'KVK निर्देशिका',
  'Laboratory & Sensor Metrics': 'प्रयोगशाला एवं सेंसर मेट्रिक्स',
  'Laboratory Calibration Offsets (± Adjustment)': 'प्रयोगशाला अंशांकन ऑफ़सेट (± समायोजन)',
  'Land & Profile': 'भूमि एवं प्रोफ़ाइल',
  'Language': 'भाषा',
  'Language & Localization': 'भाषा एवं क्षेत्रीयकरण',
  'Late Blight': 'पछेती झुलसा (Late Blight)',
  'Leaf demonstrates uniform chlorophyll distribution with no necrotic spots, chlorotic halos, or fungal spore mycelium.': 'पत्ती पर क्लोरोफिल का एकसमान वितरण है, कोई नेक्रोटिक धब्बे या फंगल बीजाणु नहीं हैं।',
  'Leaf Diagnostic Scanner': 'पत्ती नैदानिक स्कैनर',
  'Leaf Spot': 'पत्ती धब्बा रोग (Leaf Spot)',
  'Leguminous nitrogen replenisher': 'नाइट्रोजन की पूर्ति करने वाली दलहनी फ़सल',
  'Lemon': 'नींबू',
  'Lentil': 'मसूर',
  'Light rain': 'हल्की बारिश 🌦️',
  'Light, well-aerated soil ideal for tubers and vegetables': 'कंद और सब्जियों के लिए उपयुक्त हल्की हवादार मिट्टी',
  'Lime application helps normalize acidity.': 'चूने का प्रयोग अम्लता को सामान्य करने में मदद करता है।',
  'Listening for sensor stream...': 'सेंसर डेटा की प्रतीक्षा की जा रही है...',
  'Live': 'लाइव',
  'Live APMC Mandi Price Intelligence': 'लाइव APMC मंडी मूल्य विश्लेषण',
  'Live Data Feed': 'लाइव डेटा फ़ीड',
  'Live Farm View': 'खेत का लाइव दृश्य',
  'Live Mandi Prices & APMC Wholesale Analytics': 'लाइव मंडी भाव एवं APMC थोक विश्लेषण',
  'Live Mandi Rates': 'लाइव मंडी दरें',
  'Live Market Rates': 'लाइव मंडी दरें',
  'Live Meteorological Radar & Agro-Weather': 'लाइव मौसम रडार एवं कृषि मौसम',
  'Live Radar Feed': 'लाइव रडार फीड',
  'Live Telemetry Connected': 'लाइव टेलीमेट्री सक्रिय',
  'Live Weather': 'लाइव मौसम',
  'Load Demo Sample': 'डेमो डेटा लोड करें',
  'Load this historical reading into the form': 'इस ऐतिहासिक रिकॉर्ड को फ़ॉर्म में लोड करें',
  'Loading market prices...': 'बाज़ार भाव लोड हो रहे हैं...',
  'Loading your dashboard...': 'आपका डैशबोर्ड लोड हो रहा है...',
  'Loading your farm data...': 'आपके खेत का डेटा लोड हो रहा है...',
  'Loading...': 'लोड हो रहा है...',
  'Local Forecast': 'स्थानीय मौसम',
  'Local KVK Locator': 'स्थानीय केवीके केंद्र खोजें',
  'Locate your nearest ICAR research station for certified seeds and physical soil lab tests.': 'प्रमाणित बीजों और भौतिक मिट्टी परीक्षण के लिए अपने निकटतम ICAR अनुसंधान केंद्र का पता लगाएं।',
  'Location-aware weather, soil health, AI crop recommendations, market prices and disease detection - in one dashboard.': 'स्थान आधारित मौसम, मिट्टी की सेहत, एआई फ़सल सुझाव, बाज़ार भाव और रोग पहचान—एक ही डैशबोर्ड में।',
  'Log Soil Test or IoT Probes': 'मिट्टी परीक्षण या IoT जांच दर्ज करें',
  'Logged this session': 'इस सत्र में दर्ज',
  'Logging in...': 'लॉग इन हो रहा है...',
  'Login': 'लॉग इन',
  'Logout': 'लॉग आउट',
  'Long Term': 'दीर्घकालिक',
  'Low': 'कम',
  'Low (Min):': 'न्यूनतम (Min):',
  'Low:': 'न्यूनतम:',
  'Lower pest vulnerability': 'कीटों के प्रति कम संवेदनशीलता',
  'Lower water requirement': 'कम पानी की आवश्यकता',
  'Lowest Mandi Quote': 'न्यूनतम मंडी भाव',
  'Lowest Price ⬆': 'न्यूनतम भाव ⬆',
  'Machinery Accessible': 'मशीनरी संचालन योग्य',
  'Madhya Pradesh': 'मध्य प्रदेश',
  'Maharashtra': 'महाराष्ट्र',
  'Mainly Clear': 'मुख्य रूप से साफ़',
  'Maintain balanced N-P-K fertilization and regular drip/furrow irrigation to keep plant cell walls sturdy and resistant.': 'पौधों को मजबूत रखने के लिए संतुलित N-P-K खाद और नियमित ड्रिप सिंचाई बनाए रखें।',
  'Maize': 'मक्का',
  'Manage registered land plots, calibrate IoT soil telemetry probes, customize alert thresholds, and language preferences.': 'पंजीकृत भूमि भूखंडों का प्रबंधन करें, IoT मिट्टी टेलीमेट्री जांच को कैलिब्रेट करें, चेतावनी सीमाएं और भाषा प्राथमिकताएं निर्धारित करें।',
  'Mancozeb @ 2.5 g/L (35–40 g per 15L knapsack tank)': 'मैंकोजेब @ 2.5 ग्राम/लीटर (35–40 ग्राम प्रति 15 लीटर पंप)',
  'Mandi': 'मंडी',
  'Mandi Analytics': 'मंडी विश्लेषण',
  'Mandi Benchmark': 'मंडी बेंचमार्क',
  'Mandi Prices & APMC Rates': 'मंडी भाव एवं APMC दरें',
  'Mandi State': 'मंडी राज्य',
  'Mango': 'आम',
  'Manual Capture Only': 'केवल मैनुअल रिकॉर्ड',
  'Manual entry': 'मैन्युअल प्रविष्टि',
  'Market': 'बाज़ार भाव',
  'Market (APMC Mandi)': 'बाज़ार (APMC मंडी)',
  'Market / Mandi': 'मंडी / बाज़ार',
  'Market Demand': 'बाज़ार मांग',
  'Market Name': 'मंडी का नाम',
  'Market Name (A-Z)': 'मंडी का नाम (A-Z)',
  'Market Prices': 'मंडी भाव',
  'Max (₹/q)': 'अधिकतम (₹/क्विंटल)',
  'Max Price': 'अधिकतम मूल्य',
  'Maximize Mandi Profits': 'मंडी मुनाफ़ा अधिकतम करें',
  'Measured in kg/hectare': 'किग्रा/हेक्टेयर में मापा गया',
  'Micro-climate temperature range & precipitation outlook for crop irrigation': 'फ़सल सिंचाई हेतु सूक्ष्म-जलवायु तापमान सीमा और वर्षा का पूर्वानुमान',
  'Min (₹/q)': 'न्यूनतम (₹/क्विंटल)',
  'Min Price': 'न्यूनतम मूल्य',
  'Minimize chat': 'चैट छुपाएं',
  'ML AI': 'मशीन लर्निंग एआई',
  'ML Confidence': 'मशीन लर्निंग विश्वास',
  'ML Synthesis': 'मशीन लर्निंग विश्लेषण',
  'Mobile Number': 'मोबाइल नंबर',
  'Mobile Phone (For Mandi SMS)': 'मोबाइल नंबर (मंडी एसएमएस हेतु)',
  'Modal Price': 'मॉडल भाव (औसत)',
  'Modal Price (₹/q)': 'मॉडल भाव (₹/क्विंटल)',
  'Modal Price (Highest First)': 'मॉडल मूल्य (उच्चतम पहले)',
  'Modal Price (Lowest First)': 'मॉडल मूल्य (न्यूनतम पहले)',
  'Modal Rate': 'मॉडल दर',
  'Model Confidence': 'मॉडल विश्वसनीयता',
  'Model Fit': 'मॉडल उपयुक्तता',
  'Moderate (5.5)': 'मध्यम (5.5)',
  'Moderate Agronomic Match': 'मध्यम कृषि मिलान',
  'Moderate Demand': 'सामान्य मांग',
  'Moderate Risk • Fungal Blight': 'मध्यम जोखिम • फंगल झुलसा',
  'Moisture': 'नमी',
  'Moisture (%)': 'नमी (%)',
  'Mon': 'सोम',
  'Monday': 'सोमवार',
  'Monitored Farm Location': 'निगरानी किया जा रहा खेत स्थान',
  'Moong': 'मूंग',
  'Muddy / Restrict': 'कीचड़ / सीमित कार्य',
  'Multi-Crop Strategy': 'बहु-फ़सल रणनीति',
  'Multi-Variable ML Model': 'बहु-चरणीय मशीन लर्निंग मॉडल',
  'Mustard': 'सरसों',
  'N Offset (kg/ha)': 'N ऑफ़सेट (किग्रा/हेक्टेयर)',
  'Nearby APMC Mandis': 'नज़दीकी APMC मंडियां',
  'Need help with a sensor reading or crop disease? Our field scientists will respond promptly.': 'क्या किसी सेंसर रीडिंग या फ़सल रोग में सहायता चाहिए? हमारे कृषि वैज्ञानिक शीघ्र उत्तर देंगे।',
  'Neem Oil 10,000 ppm @ 3 ml/L with liquid soap emulsifier': 'नीम का तेल 10,000 ppm @ 3 मिली/लीटर साबुन घोल के साथ',
  'Neem-seed kernel extract (NSKE 5%)': 'नीम बीज गिरी अर्क (NSKE 5%)',
  'Neutral': 'तटस्थ',
  'Neutral range is 6.0 – 7.5. Acidic < 6, Alkaline > 7.8.': 'तटस्थ सीमा 6.0 – 7.5 है। अम्लीय < 6, क्षारीय > 7.8।',
  'New here?': 'यहाँ नए हैं?',
  'Next': 'अगला',
  'Next 7 Days Outlook': 'आगामी 7 दिनों का दृष्टिकोण',
  'Next Page': 'अगला पृष्ठ',
  'NEXT-GEN AI FOR PRECISION FARMING • 2026': 'सटीक कृषि हेतु नेक्स्ट-जेन एआई • 2026',
  'Nighttime Low (°C)': 'रात का न्यूनतम तापमान (°C)',
  'Nitrogen': 'नाइट्रोजन',
  'Nitrogen (N)': 'नाइट्रोजन (N)',
  'Nitrogen Level': 'नाइट्रोजन स्तर',
  'No chemical intervention needed. Avoid unnecessary synthetic fungicide applications to preserve beneficial phyllosphere microflora.': 'किसी रासायनिक उपचार की आवश्यकता नहीं है। लाभकारी सूक्ष्मजीवों की सुरक्षा के लिए अनावश्यक कवकनाशी से बचें।',
  'No mandi records found': 'कोई मंडी रिकॉर्ड नहीं मिला',
  'No Rain': 'बारिश नहीं',
  'No records found': 'कोई रिकॉर्ड नहीं मिला',
  'No soil data recorded yet. Add a reading on the Soil Data page.': 'मिट्टी का डेटा अभी दर्ज नहीं है। कृपया मिट्टी डेटा पेज पर जानकारी जोड़ें।',
  'None / Fallow': 'कोई नहीं / परती भूमि',
  'Normal': 'सामान्य',
  'Normal (Within 24h)': 'सामान्य (24 घंटे के भीतर)',
  'Normal Schedule': 'सामान्य सिंचाई',
  'Not set': 'निर्धारित नहीं',
  'Notifies when predicted rainfall exceeds 25mm or high wind speeds threaten spray drift.': 'जब अनुमानित वर्षा 25 मिमी से अधिक हो या तेज़ हवाओं से छिड़काव प्रभावित होने का जोखिम हो तो सूचित करता है।',
  'NPK': 'एनपीके',
  'NPK Soil Macronutrients': 'NPK प्राथमिक पोषक तत्व',
  'Nutrient Management': 'उर्वरक एवं पोषक तत्व प्रबंधन',
  'Nutrient Telemetry': 'पोषक तत्व टेलीमेट्री',
  'Odisha': 'ओडिशा',
  'Oilseed': 'तिलहन',
  'Oilseeds': 'तिलहन',
  'Onion': 'प्याज़',
  'Online': 'सक्रिय',
  'Open AI Agronomist Chat': 'एआई कृषि विशेषज्ञ चैट खोलें',
  'Optimal': 'उत्तम',
  'Optimal Condition': 'उत्कृष्ट स्थिति',
  'Optimal Health • No Pathogens': 'उत्तम स्वास्थ्य • कोई रोगजनक नहीं',
  'Optimal Temp': 'अनुकूल तापमान',
  'Or type custom previous crop (e.g. Mustard, Millet, Sugarcane)...': 'या पिछली फ़सल का नाम लिखें (जैसे सरसों, बाजरा, गन्ना)...',
  'Orange': 'संतरा',
  'Organic & Bio': 'जैविक एवं बायो',
  'Organic Remediation': 'जैविक उपचार',
  'Our models combine your soil N-P-K nutrient density, pH, and soil moisture with hyper-local Open-Meteo satellite weather telemetry (temperature curves, humidity, and rainfall) and your previous crop rotation history. Rather than a static lookup table, our machine learning model evaluates multi-dimensional agronomic suitability scores.': 'हमारे मॉडल आपकी मिट्टी की N-P-K पोषक तत्व मात्रा, pH और नमी को उपग्रह मौसम टेलीमेट्री (तापमान, आर्द्रता और वर्षा) तथा पिछली फ़सल चक्र के साथ जोड़ते हैं। केवल स्थिर तालिका के बजाय, हमारा मशीन लर्निंग मॉडल बहुआयामी कृषि उपयुक्तता स्कोर का मूल्यांकन करता है।',
  'Overcast': 'बादल छाए रहेंगे',
  'P Offset (kg/ha)': 'P ऑफ़सेट (किग्रा/हेक्टेयर)',
  'Paddy': 'धान / चावल',
  'Papaya': 'पपीता',
  'Partly cloudy': 'आंशिक बादल ⛅',
  'Partly Cloudy': 'आंशिक रूप से बादल',
  'Password': 'पासवर्ड',
  'Password (Min 8 chars)': 'पासवर्ड (न्यूनतम 8 वर्ण)',
  'Peak Mandi Quote': 'उच्चतम मंडी भाव',
  'Peanut': 'मूँगफली',
  'Phosphorus': 'फ़ॉस्फ़ोरस',
  'Phosphorus (P)': 'फ़ॉस्फ़ोरस (P)',
  'Phosphorus Level': 'फ़ॉस्फ़ोरस स्तर',
  'Please explain the issue or provide leaf symptoms, soil values, and plot details...': 'कृपया समस्या बताएं या पत्ती के लक्षण, मिट्टी के मान और खेत का विवरण दें...',
  'Pomegranate': 'अनार',
  'Potassium': 'पोटैशियम',
  'Potassium (K)': 'पोटैशियम (K)',
  'Potassium Bicarbonate spray (3 g/L) + vegetable oil (5 ml/L) alters leaf surface pH, destroying fungal spore walls on contact.': 'पोटैशियम बाइकार्बोनेट (3 ग्राम/लीटर) + वनस्पति तेल (5 मिली/लीटर) फफूंद को नष्ट करता है।',
  'Potassium Level': 'पोटैशियम स्तर',
  'Potato': 'आलू',
  'Powdery Mildew': 'चूर्णिल आसिता (पाउडरी मिल्ड्यू)',
  'Precipitation': 'वर्षा की संभावना',
  'Precision Agriculture': 'सटीक कृषि मंच',
  'Precision Agronomic Alerts & Notifications': 'सटीक कृषि चेतावनियाँ एवं सूचनाएं',
  'Predicted Rain:': 'अनुमानित वर्षा:',
  'Preferences & IoT': 'सेटिंग्स एवं IoT',
  'Preferences Saved!': 'प्राथमिकताएं सहेजी गईं!',
  'Preventative Bio-Shield': 'निवारक जैविक सुरक्षा',
  'Preventative Cultural Practices': 'रोकथाम एवं सावधानियां',
  'Previous': 'पिछला',
  'Previous Crop (optional)': 'पिछली फ़सल (वैकल्पिक)',
  'Previous Page': 'पिछला पृष्ठ',
  'Previous Season Crop': 'पिछली ऋतु की फ़सल',
  'Price': 'भाव',
  'Price Comparison': 'भाव की तुलना',
  'Price Spread': 'मूल्य अंतर',
  'Price Spread Analytics': 'भाव अंतर विश्लेषण',
  'Primary Macro-Nutrients (NPK)': 'प्राथमिक मुख्य पोषक तत्व (NPK)',
  'Priority': 'प्राथमिकता',
  'Proactive Agronomic Advisory Planner': 'सक्रिय कृषि परामर्श योजनाकार',
  'Proactive alerts when blight or powdery mildew spore conditions are detected in your agro-climatic zone.': 'जब आपके कृषि-जलवायु क्षेत्र में झुलसा या चूर्णिल आसिता के बीजाणु अनुकूल स्थिति का पता चलता है तो अग्रिम अलर्ट देता है।',
  'Profile': 'प्रोफ़ाइल',
  'Promotes leaf and foliage vegetative vigor.': 'पत्तियों और वनस्पति के स्वस्थ विकास को बढ़ावा देता है।',
  'Prophylactic Maintenance': 'रोगनिरोधी रखरखाव',
  'Prune excess vegetative suckers to improve sunlight penetration and air movement, which naturally inhibits spore germination.': 'धूप और हवा के संचार को बेहतर बनाने के लिए अतिरिक्त शाखाओं की छंटाई करें।',
  'Prune infected bottom leaves touching the soil (primary source of splash inoculation). Shift to drip irrigation to keep canopy dry.': 'मिट्टी को छूने वाली संक्रमित निचली पत्तियों को काटें। पत्तियों को सूखा रखने के लिए ड्रिप सिंचाई अपनाएं।',
  'Pulse': 'दलहन',
  'Pulses': 'दलहन',
  'Pune Radar • 0 mm Rain': 'पुणे रडार • 0 मिमी वर्षा',
  'Punjab': 'पंजाब',
  'Quick Crop Actions': 'त्वरित कार्य',
  'Quick Demo Farmer': 'त्वरित डेमो किसान',
  'Quick Fill Demo Credentials': 'डेमो क्रेडेंशियल स्वतः भरें',
  'Quick Hubs:': 'त्वरित केंद्र:',
  'Quick Presets:': 'त्वरित फ़िल्टर:',
  'Rain': 'वर्षा',
  'Rain Expected': 'बारिश की संभावना',
  'Rain Offset Available': 'बारिश से सिंचाई की बचत',
  'Rainfall': 'वर्षा',
  'Rajasthan': 'राजस्थान',
  'Rapid Halt': 'त्वरित रोकथाम',
  'Rate Analysis': 'दर विश्लेषण',
  'Re-query API': 'एपीआई पुनः क्वेरी करें',
  'Read from a soil sensor': 'मिट्टी के सेंसर से डेटा प्राप्त करें',
  'Reading received. Check the values below, then save them.': 'डेटा प्राप्त हो गया। नीचे दिए मान जांचें और सहेजें।',
  'Ready': 'तैयार',
  'Real-time Agmarknet mandi spot prices • Last synced:': 'वास्तविक समय Agmarknet मंडी हाजिर भाव • अंतिम सिंक:',
  'Real-time atmospheric telemetry, 7-day micro-climate temperature curves, rainfall projection charts, and spray advisories.': 'वास्तविक समय वायुमंडलीय टेलीमेट्री, 7-दिवसीय तापमान वक्र, वर्षा प्रक्षेपण चार्ट और छिड़काव परामर्श।',
  'Real-time NPK Soil Diagnostics': 'वास्तविक समय NPK मिट्टी जांच',
  'Receive automated warnings regarding extreme weather, pest outbreaks, and commodity mandi spikes.': 'चरम मौसम, कीट प्रकोप और कमोडिटी मंडी दरों में उछाल के बारे में स्वचालित चेतावनियाँ प्राप्त करें।',
  'Recent Readings': 'हाल की रीडिंग',
  'Recent Session Scans': 'हालिया सत्र स्कैन',
  'Recent Soil Recordings': 'हालिया मिट्टी परीक्षण रिकॉर्ड',
  'Recommendation': 'सुझाव',
  'Recommended Crop': 'सुझाई गई फ़सल',
  'Recorded': 'दर्ज किया गया',
  'Recorded At': 'रिकॉर्ड समय',
  'Records': 'रिकॉर्ड्स',
  'Red & Yellow Loam': 'लाल एवं पीली दोमट',
  'Red Loam': 'लाल दोमट मिट्टी (Red Loam)',
  'Reference ID:': 'संदर्भ आईडी:',
  'Refresh API': 'एपीआई ताज़ा करें',
  'Refresh Telemetry': 'टेलीमेट्री ताज़ा करें',
  'Refreshing...': 'ताज़ा हो रहा है...',
  'Regional Soil Presets': 'क्षेत्रीय मिट्टी प्रकार (त्वरित प्रीसेट)',
  'Register': 'पंजीकरण',
  'Register acreage and regional district for hyper-local radar telemetry.': 'सटीक रडार टेलीमेट्री के लिए रकबा और क्षेत्रीय जिला पंजीकृत करें।',
  'Register Free': 'निःशुल्क पंजीकरण',
  'Registered Farmer & Plot Profile': 'पंजीकृत किसान एवं खेत प्रोफ़ाइल',
  'Registering Farm Account...': 'किसान खाता पंजीकृत हो रहा है...',
  'Relative Humidity': 'सापेक्ष आर्द्रता',
  'Relative humidity percentage throughout the canopy layer': 'फ़सल के स्तर पर सापेक्ष आर्द्रता प्रतिशत',
  'Relative Humidity:': 'सापेक्ष आर्द्रता:',
  'Remove Specimen': 'नमूना हटाएं',
  'Reporting Mandis': 'रिपोर्टिंग मंडियां',
  'Reset': 'रीसेट',
  'Reset to Maharashtra Onion': 'महाराष्ट्र प्याज पर रीसेट करें',
  'Resistant to drought spells': 'सूखे के प्रति सहनशील',
  'Restores nitrogen reserves': 'नाइट्रोजन भंडार को पुनर्स्थापित करता है',
  'Retry': 'पुनः प्रयास करें',
  'Rice': 'चावल',
  'Rich fertile soil common in river valleys': 'नदी घाटियों में पाई जाने वाली उपजाऊ मिट्टी',
  'Rich reserve. Reduce application to avoid leaching.': 'भरपूर भंडार। बहने से बचाने के लिए अतिरिक्त मात्रा कम करें।',
  'Rows per page:': 'प्रति पृष्ठ पंक्तियाँ:',
  'Rule-Based Agronomy Engine': 'नियम-आधारित कृषि विज्ञान इंजन',
  'Run AI Diagnostic Scan': 'एआई रोग जांच शुरू करें',
  'Run AI Recommendation': 'एआई फ़सल सुझाव लें',
  'Rust': 'गेरुआ/रतुआ रोग (Rust)',
  'Sandy Loam': 'बलुई दोमट',
  'Sarson': 'सरसों',
  'Saturated': 'अत्यधिक गीली',
  'Save Changes': 'परिवर्तन सहेजें',
  'Save IoT Configuration': 'IoT कॉन्फ़िगरेशन सहेजें',
  'Save Notification Rules': 'सूचना नियम सहेजें',
  'Save Profile': 'प्रोफ़ाइल सहेजें',
  'Save Soil Data': 'मिट्टी का डेटा सहेजें',
  'Save Soil Health Profile': 'मिट्टी स्वास्थ्य प्रोफ़ाइल सहेजें',
  'Saving...': 'सहेजा जा रहा है...',
  'Scan Crop Disease': 'फ़सल रोग की जांच करें',
  'Scan leaf imagery to identify fungal spots, bacterial blights, and powdery spores early before crop losses escalate.': 'फ़सल नुकसान बढ़ने से पहले फंगल धब्बों, जीवाणु झुलसा और चूर्णिल बीजाणुओं की पहचान के लिए पत्ती की छवि स्कैन करें।',
  'Scanning Specimen with CNN Computer Vision...': 'सीएनएन कंप्यूटर विज़न से नमूने की जांच हो रही है...',
  'Search by commodity, mandi, market, or district...': 'फ़सल, मंडी, बाज़ार या ज़िले के अनुसार खोजें...',
  'Search Mandi / District': 'मंडी / जिला खोजें',
  'Search...': 'खोजें...',
  'Select a predefined regional soil profile to populate nutrient test values instantly:': 'पोषक तत्वों के मान तुरंत भरने के लिए क्षेत्रीय मिट्टी प्रोफाइल चुनें:',
  'Select Commodity': 'फ़सल / वस्तु चुनें',
  'SELECT CROP TOPIC:': 'फ़सल विषय चुनें:',
  'Select or type your soil type': 'अपनी मिट्टी का प्रकार चुनें या लिखें',
  'Select Previous Crop': 'पिछली फ़सल चुनें',
  'Select State': 'राज्य चुनें',
  'Select the transmission rate specified on your hardware sensor manual.': 'अपने हार्डवेयर सेंसर मैनुअल पर निर्दिष्ट ट्रांसमिशन दर चुनें।',
  'Send': 'भेजें',
  'Send question': 'प्रश्न भेजें',
  'Send Us a Message': 'हमें संदेश भेजें',
  'Serial Port Baud Rate': 'सीरियल पोर्ट बॉड दर',
  'Settings': 'सेटिंग्स',
  'Short duration cash crop': 'कम अवधि की नकदी फ़सल',
  'Short duration rotation': 'कम अवधि का फ़सल चक्र',
  'Sign in': 'साइन इन करें',
  'Sign In to Dashboard': 'डैशबोर्ड में साइन इन करें',
  'Sign in to see your farm insights': 'अपने खेत की जानकारी देखने के लिए साइन इन करें',
  'Sign in to unlock AI crop advisory': 'एआई फ़सल सलाह अनलॉक करने के लिए साइन इन करें',
  'Signing In...': 'साइन इन हो रहा है...',
  'Smart Agriculture System': 'स्मार्ट कृषि प्रणाली',
  'Smart farming, made simple': 'स्मार्ट खेती, अब आसान',
  'Snow': 'बर्फबारी',
  'Soil Acidity (pH)': 'मिट्टी का pH मान',
  'Soil Acidity & Moisture Telemetry': 'मिट्टी अम्लता एवं नमी टेलीमेट्री',
  'Soil Chemistry & Water Saturation': 'मिट्टी रसायन एवं जल संतृप्ति',
  'Soil Chemistry Alignment': 'मिट्टी रसायन मिलान',
  'Soil Chemistry Telemetry': 'मिट्टी रसायन टेलीमेट्री',
  'Soil Data': 'मिट्टी का डेटा',
  'Soil Data & IoT': 'मिट्टी डेटा एवं IoT',
  'Soil data saved. Your dashboard recommendation will now use these values.': 'मिट्टी का डेटा सहेज दिया गया। अब डैशबोर्ड का सुझाव इन्हीं मानों का उपयोग करेगा।',
  'Soil Health': 'मिट्टी का स्वास्थ्य',
  'Soil Health & IoT Telemetry Center': 'मिट्टी स्वास्थ्य एवं IoT टेलीमेट्री केंद्र',
  'Soil Health Overview': 'मिट्टी स्वास्थ्य का सारांश',
  'Soil Health Profile': 'मिट्टी स्वास्थ्य प्रोफ़ाइल',
  'Soil Moisture (%)': 'मिट्टी की नमी (%)',
  'Soil Moisture Content': 'मिट्टी में नमी की मात्रा',
  'Soil Moisture Level': 'मिट्टी की नमी स्तर',
  'Soil pH': 'मिट्टी का pH मान',
  'Soil pH (Scale 0-14)': 'मिट्टी pH मान (पैमाना 0-14)',
  'Soil Reaction (pH)': 'मिट्टी का pH मान',
  'SOIL STATUS': 'मिट्टी स्थिति',
  'Soil Testing & Sensors': 'मिट्टी परीक्षण एवं सेंसर',
  'Soil Texture / Type (optional)': 'मिट्टी की बनावट / प्रकार (वैकल्पिक)',
  'Soil Type': 'मिट्टी का प्रकार',
  'Soil Type (optional)': 'मिट्टी का प्रकार (वैकल्पिक)',
  'Soyabean': 'सोयाबीन',
  'Soybean': 'सोयाबीन',
  'Spice': 'मसाला',
  'Spray 1% Bordeaux mixture or botanical extract of fermented ginger-garlic-chili to suppress bacterial & fungal sporulation.': '1% बोर्डो मिश्रण या अदरक-लहसुन-मिर्च के काढ़े का छिड़काव करें।',
  'Spray Copper Oxychloride 50% WP or Carbendazim 50% WP. Repeat after 12-14 days if wet weather persists.': 'कॉपर ऑक्सीक्लोराइड 50% WP या कार्बेन्डाजिम 50% WP का छिड़काव करें।',
  'Spraying Advisory': 'छिड़काव सलाह',
  'Spraying Suitability': 'छिड़काव उपयुक्तता',
  'Standard micronutrient foliar spray (if needed)': 'मानक सूक्ष्म पोषक तत्व पर्णीय छिड़काव (यदि आवश्यक हो)',
  'State': 'राज्य',
  'State-of-the-art computer vision engine detecting foliar pathogens, blights, and nutrient deficiencies with instant agronomic treatment protocols.': 'पत्तियों के रोग, फफूंद, झुलसा और पोषक तत्वों की कमी की तुरंत पहचान कर उपचार बताने वाला विज़न एआई।',
  'State-wide agricultural mandi prices, real-time commodity price tracking, volume arrivals, and AI market profitability forecasts.': 'राज्य-स्तरीय कृषि मंडी भाव, वास्तविक समय वस्तु मूल्य ट्रैकिंग, आवक और एआई बाज़ार लाभ पूर्वानुमान।',
  'Stimulates root establishment & early flowering.': 'जड़ों के फैलाव और समय पर फूल आने को प्रेरित करता है।',
  'Storm Caution': 'तूफ़ान की चेतावनी',
  'Stream real-time NPK & moisture levels or choose regional presets.': 'वास्तविक समय NPK और नमी का स्तर स्ट्रीम करें या क्षेत्रीय प्रीसेट चुनें।',
  'Strong Agronomic Match': 'मजबूत कृषि मिलान',
  'Subject Summary': 'विषय सारांश',
  'Submit a Support Ticket': 'सहायता अनुरोध दर्ज करें',
  'Submit Another Inquiry': 'एक और अनुरोध दर्ज करें',
  'Submit Support Inquiry': 'सहायता अनुरोध भेजें',
  'Sugarcane': 'गन्ना',
  'Suitability Match': 'अनुकूलता मिलान',
  'Sunny': 'धूप ☀️',
  'SUPPORT & PREFERENCES': 'सहायता एवं प्राथमिकताएं',
  'Supports JPEG, PNG, WEBP (Max 10 MB). Clear close-up of leaf lesions recommended.': 'JPEG, PNG, WEBP (अधिकतम 10 MB) समर्थित। पत्ती के धब्बों की स्पष्ट नज़दीकी तस्वीर सुझाई गई है।',
  'Switch Target Crop': 'फ़सल बदलें',
  'Symptom Manifestation:': 'लक्षण प्रकटीकरण:',
  'Systemic / Contact Fungicides': 'प्रणालीगत / संपर्क कवकनाशी',
  'Table List View': 'तालिका सूची दृश्य',
  'Tamil Nadu': 'तमिलनाडु',
  'Tap any sample to run an instant diagnostic scan': 'तत्काल जांच के लिए किसी भी नमूने पर टैप करें',
  'Targeted Fungicide Spray': 'लक्षित कवकनाशी छिड़काव',
  'Tea': 'चाय',
  'Technical inquiries, sensor issues, and bug reports answered within 4 hours.': 'तकनीकी प्रश्न, सेंसर समस्याएं और तकनीकी सहायता 4 घंटे के भीतर उपलब्ध।',
  'Telangana': 'तेलंगाना',
  'Telemetry': 'टेलीमेट्री',
  'Telemetry Online': 'टेलीमेट्री सक्रिय 🟢',
  'Temperature': 'तापमान',
  'Test live API endpoint directly': 'लाइव एपीआई एंडपॉइंट का सीधे परीक्षण करें',
  'Thermal Swing:': 'दैनिक तापांतर:',
  'Thunderstorm': 'गरज के साथ बारिश',
  'Thursday': 'गुरुवार',
  'Ticket Submitted Successfully!': 'अनुरोध सफलतापूर्वक दर्ज हो गया!',
  'Today': 'आज',
  'Toll-free 24/7 government agriculture helpline in 22 regional languages.': '22 क्षेत्रीय भाषाओं में 24/7 निःशुल्क सरकारी कृषि हेल्पलाइन।',
  'Tomato': 'टमाटर',
  'Tomato Early Blight': 'टमाटर का अगेती झुलसा',
  'Tomorrow': 'कल',
  'Top Crop': 'सर्वश्रेष्ठ फ़सल',
  'Top Gainers 📈': 'शीर्ष वृद्धि फ़सलें 📈',
  'Top rate recorded': 'दर्ज शीर्ष दर',
  'Top Recommended Crop': 'सर्वश्रेष्ठ सुझाई गई फ़सल',
  'Track mandi price trends for major crops so you can plan what to sell and when.': 'प्रमुख फ़सलों के मंडी भाव देखें और सर्वोत्तम लाभ के लिए बिक्री की योजना बनाएं।',
  'Trading Advisory:': 'व्यापार सलाह:',
  'Treatment Copied!': 'उपचार कॉपी किया गया!',
  'Trichoderma formulation @ 5 g/L early morning': 'ट्राइकोडर्मा फॉर्मूलेशन @ 5 ग्राम/लीटर सुबह के समय',
  'Tur': 'तूर दाल',
  'Turmeric': 'हल्दी',
  'Update Profile': 'प्रोफ़ाइल अपडेट करें',
  'Upload Image': 'तस्वीर अपलोड करें',
  'Upload Leaf Image': 'पत्ती की तस्वीर अपलोड करें',
  'Upload or photograph a leaf specimen showing visible symptoms or lesions.': 'लक्षण या धब्बे दिखाने वाली पत्ती का नमूना अपलोड करें या फ़ोटो लें।',
  'Urad': 'उड़द',
  'Urgent Field Issue (Within 4h)': 'अति-आवश्यक (4 घंटे के भीतर)',
  'Uttar Pradesh': 'उत्तर प्रदेश',
  'Uttarakhand': 'उत्तराखंड',
  'UV Index:': 'यूवी इंडेक्स:',
  'Variety': 'किस्म (Variety)',
  'Variety & Grade': 'किस्म एवं श्रेणी',
  'Vegetable': 'सब्जी',
  'Vegetables': 'सब्जियां',
  'Verified Agro Account': 'सत्यापित कृषि खाता',
  'Verified Farmer': 'सत्यापित किसान',
  'View All Mandi Prices': 'सभी मंडी भाव देखें',
  'View Mandi Price Trends': 'मंडी भाव रुझान देखें',
  'Vigorous Growth Practices': 'सक्रिय विकास प्रबंधन',
  'Vision': 'विज़न',
  'Vision AI': 'विज़न एआई',
  'Vision Model Active': 'विज़न मॉडल सक्रिय',
  'Waiting for sensor…': 'सेंसर की प्रतीक्षा हो रही है...',
  'Warm & Bright': 'धूप एवं गर्म',
  'Water & Irrigation': 'सिंचाई एवं जल प्रबंधन',
  'Water Demand': 'पानी की आवश्यकता',
  'Watermelon': 'तरबूज',
  'Weather & Agro Alerts': 'मौसम एवं कृषि अलर्ट',
  'Weather & Climatic Telemetry': 'मौसम एवं जलवायु टेलीमेट्री',
  'Weather & Radar': 'मौसम एवं रडार',
  'Weather Radar': 'मौसम रडार',
  'Web Serial API Supported': 'वेब सीरियल एपीआई समर्थित',
  'Web Serial IoT Soil Probe Hardware': 'वेब सीरियल IoT मृदा जांच हार्डवेयर',
  'Welcome back': 'वापसी पर स्वागत है',
  'Welcome back to your smart farming cockpit': 'अपने स्मार्ट कृषि कॉकपिट में पुनः स्वागत है',
  'Well-aerated root zone.': 'जड़ों के लिए अच्छी हवादार स्थिति।',
  'Well-drained soil rich in iron and minerals': 'लौह और खनिजों से भरपूर जल-निकास वाली मिट्टी',
  'West Bengal': 'पश्चिम बंगाल',
  'Wettable Sulfur @ 3 g/L OR Hexaconazole @ 1 ml/L': 'घुलनशील गंधक @ 3 ग्राम/लीटर या हेक्साकोनाज़ोल @ 1 मिली/लीटर',
  'What are critical watering stages for': 'के लिए सिंचाई के महत्वपूर्ण चरण क्या हैं',
  'What are the benefits of drip irrigation?': 'ड्रिप सिंचाई के क्या लाभ हैं?',
  'What is the fertilizer schedule for': 'के लिए खाद का क्या समय-सारणी है',
  'What should I do if the plant disease scanner indicates an unknown disease?': 'यदि पौधा रोग स्कैनर अज्ञात रोग दिखाता है तो मुझे क्या करना चाहिए?',
  'WhatsApp Advisory': 'व्हाट्सएप कृषि परामर्श',
  'Wheat': 'गेहूँ',
  'Wheat Recommended': 'गेहूं की सलाह',
  'White to grayish flour-like powdery patches on upper and lower foliar surfaces, causing leaf curling, premature drying, and stunted blooms.': 'पत्तियों की दोनों सतहों पर सफेद चूर्ण जैसे धब्बे, जिससे पत्तियां मुड़ती और सूखती हैं।',
  'Wholesale mandi commodity prices are refreshed daily following the morning and afternoon eNAM auction sessions across Indian APMC markets, providing accurate minimum, maximum, and modal price benchmarks.': 'थोक मंडी कमोडिटी की कीमतें देश भर के APMC बाज़ारों में सुबह और दोपहर के eNAM नीलामी सत्रों के बाद प्रतिदिन अपडेट की जाती हैं, जिससे सटीक न्यूनतम, अधिकतम और मॉडल मूल्य प्राप्त होते हैं।',
  'Why are leaves turning yellow?': 'पत्तियां पीली क्यों पड़ रही हैं?',
  'Why this crop is recommended for your land:': 'यह फ़सल आपके खेत के लिए क्यों सुझाई गई है:',
  'Why this crop?': 'यह फ़सल क्यों उपयुक्त है?',
  'Wind Direction': 'हवा की दिशा',
  'Wind Speed': 'हवा की गति',
  'Yellow Leaf Curl': 'पत्ती मरोड़ रोग (Leaf Curl)',
  'Yes! AgroAI natively supports the W3C Web Serial API. When using Chrome or Edge on Windows, Linux, Mac, or Android with USB OTG, you can plug in any standard RS-485 soil sensor probe, select your baud rate (9600 or 115200 bps), and stream live telemetry directly into the Soil Data page without any custom drivers.': 'हाँ! एग्रोएआई वेब सीरियल एपीआई का समर्थन करता है। विंडोज, लिनक्स, मैक या एंड्रॉइड पर क्रोम या एज का उपयोग करते हुए, आप किसी भी मानक RS-485 मिट्टी सेंसर को जोड़ सकते हैं और बिना किसी ड्राइवर के लाइव टेलीमेट्री स्ट्रीम कर सकते हैं।',
  'You can switch languages at any time.': 'आप किसी भी समय भाषा बदल सकते हैं।',
  'Your agricultural data is encrypted and strictly protected. Never shared with third parties.': 'आपका कृषि डेटा एन्क्रिप्टेड और सुरक्षित है। कभी किसी तीसरे पक्ष के साथ साझा नहीं किया जाता।',
  'Your plot coordinates and land size calibrate our multi-variable crop suitability models.': 'आपके खेत के निर्देशांक और भूमि का आकार हमारे बहु-चरणीय फ़सल उपयुक्तता मॉडल को सटीक बनाते हैं।',
  'Your Profile': 'आपकी प्रोफ़ाइल',
  'हिंदी (Hindi)': 'हिन्दी',
}

// Lowercase dictionary for case-insensitive lookup
export const LOWER_HI_DICTIONARY = {}
// Reverse dictionary (Hindi -> English)
export const REVERSE_HI = {}

for (const [en, hi] of Object.entries(HI_DICTIONARY)) {
  LOWER_HI_DICTIONARY[en.toLowerCase()] = hi
  REVERSE_HI[hi] = en
}

// Prefixes requiring dynamic argument preservation
const PREFIX_RULES = [
  { prefix: 'Consulting regarding:', hi: 'परामर्श विषय:' },
  { prefix: 'Farm Location:', hi: 'खेत का स्थान:' },
  { prefix: 'Top Crop:', hi: 'सर्वश्रेष्ठ फ़सल:' },
  { prefix: 'Soil pH:', hi: 'मिट्टी का pH:' },
  { prefix: 'Soil data:', hi: 'मिट्टी का डेटा:' },
  { prefix: 'Weather:', hi: 'मौसम:' },
  { prefix: 'Welcome,', hi: 'स्वागत है,' },
  { prefix: 'Confidence:', hi: 'सटीकता विश्वास:' },
  { prefix: 'Detected:', hi: 'पहचान की गई:' },
  { prefix: 'Result:', hi: 'परिणाम:' },
  { prefix: 'Price:', hi: 'भाव:' },
  { prefix: 'Demand:', hi: 'मांग:' },
  { prefix: 'Match:', hi: 'अनुकूलता:' },
  { prefix: 'Showing prices for', hi: 'के लिए भाव:' },
  { prefix: 'Chat with AI about', hi: 'के बारे में एआई से चैट करें:' },
  { prefix: 'Pathogen:', hi: 'रोगजनक:' },
  { prefix: 'Dosage:', hi: 'मात्रा:' },
  { prefix: 'Grade:', hi: 'श्रेणी:' },
  { prefix: 'Day High:', hi: 'दिन का अधिकतम:' },
  { prefix: 'Low:', hi: 'न्यूनतम:' },
  { prefix: 'Current Rate:', hi: 'वर्तमान दर:' },
  { prefix: '24h Shift:', hi: '24 घंटे का बदलाव:' },
  { prefix: 'Trading Advisory:', hi: 'व्यापार सलाह:' },
  { prefix: 'Reference ID:', hi: 'संदर्भ आईडी:' },
  { prefix: 'Mandi Region:', hi: 'मंडी क्षेत्र:' }
]

// Emoji extraction regex
const EMOJI_PREFIX_REGEX = /^([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|\p{Emoji_Presentation}|\p{Extended_Pictographic}|\s)+/u

// Pre-compiled list of phrases sorted longest to shortest for compound sentence translation
const PHRASE_KEYS = Object.keys(HI_DICTIONARY)
  .filter((k) => k.length > 3 && !k.startsWith('^') && !k.endsWith('$'))
  .sort((a, b) => b.length - a.length)

// Regex patterns for dynamic sentences containing numbers/metrics
const DYNAMIC_PATTERNS = [
  {
    regex: /^Showing (\d+) to (\d+) of (\d+) live mandi entries$/i,
    fn: (_, a, b, c) => `कुल ${c} मंडी प्रविष्टियों में से ${a} से ${b} प्रदर्शित`
  },
  {
    regex: /^Showing (\d+) to (\d+) of (\d+) records$/i,
    fn: (_, a, b, c) => `कुल ${c} रिकॉर्ड में से ${a} से ${b} प्रदर्शित`
  },
  {
    regex: /^Showing (\d+) of (\d+) commodities$/i,
    fn: (_, a, b) => `${b} में से ${a} कमोडिटी प्रदर्शित`
  },
  {
    regex: /^Page (\d+) of (\d+)$/i,
    fn: (_, a, b) => `पृष्ठ ${a} / ${b}`
  },
  {
    regex: /^Recent Session Scans \((\d+)\)$/i,
    fn: (_, a) => `हालिया सत्र स्कैन (${a})`
  },
  {
    regex: /^(\d+)% match$/i,
    fn: (_, a) => `${a}% मिलान`
  },
  {
    regex: /^(\d+) Days$/i,
    fn: (_, a) => `${a} दिन`
  },
  {
    regex: /^(\d+)% moisture$/i,
    fn: (_, a) => `${a}% नमी`
  },
  {
    regex: /^Calm wind velocity \((\d+) km\/h\) minimizes droplet drift\. Optimal for early morning fungicide or foliar micronutrient spraying\.$/i,
    fn: (_, s) => `शांत हवा (${s} किमी/घंटा) छिड़काव बहाव को रोकती है। सुबह के समय फफूंदनाशी या सूक्ष्म पोषक तत्वों के छिड़काव के लिए आदर्श स्थिति।`
  },
  {
    regex: /^Wind speeds reach (\d+) km\/h\. High risk of chemical drift onto adjacent non-target crops\.$/i,
    fn: (_, s) => `हवा की गति ${s} किमी/घंटा तक पहुंच गई है। आसपास की फ़सलों पर दवा बहने का उच्च जोखिम।`
  },
  {
    regex: /^Forecast predicts (\d+) mm rainfall\. You can save water and electricity by pausing drip irrigation for the next 24[–-]48 hours\.$/i,
    fn: (_, r) => `पूर्वानुमान में ${r} मिमी वर्षा का अनुमान है। अगले 24-48 घंटों के लिए ड्रिप सिंचाई रोककर पानी और बिजली की बचत करें।`
  },
  {
    regex: /^Thermal peak of (\d+)°C accelerates soil moisture evaporation\. Run drip irrigation in early dawn or late evening\.$/i,
    fn: (_, t) => `${t}°C का उच्च तापमान नमी के वाष्पीकरण को तेज करता है। सुबह जल्दी या देर शाम को ड्रिप सिंचाई करें।`
  }
]

/**
 * Translates a single text segment or sentence
 */
function translateSegment(trimmed, language) {
  if (!trimmed) return trimmed

  if (language !== 'hi') {
    return REVERSE_HI[trimmed] || trimmed
  }

  // 1. Direct dictionary match
  if (HI_DICTIONARY[trimmed]) {
    return HI_DICTIONARY[trimmed]
  }

  // 2. Case-insensitive dictionary match
  const lower = trimmed.toLowerCase()
  if (LOWER_HI_DICTIONARY[lower]) {
    return LOWER_HI_DICTIONARY[lower]
  }

  // 3. Dynamic Regex Patterns
  for (const pat of DYNAMIC_PATTERNS) {
    const m = trimmed.match(pat.regex)
    if (m) {
      return pat.fn(...m)
    }
  }

  // 4. Emoji prefix match (e.g. "🌾 Wheat", "🍂 Early Blight")
  const emojiMatch = trimmed.match(EMOJI_PREFIX_REGEX)
  if (emojiMatch) {
    const emoji = emojiMatch[0].trim()
    const rest = trimmed.slice(emojiMatch[0].length).trim()
    const restTrans = HI_DICTIONARY[rest] || LOWER_HI_DICTIONARY[rest.toLowerCase()]
    if (restTrans) {
      return emoji + ' ' + restTrans
    }
  }

  // 5. Dynamic Prefixes
  for (const rule of PREFIX_RULES) {
    if (trimmed.startsWith(rule.prefix)) {
      const val = trimmed.slice(rule.prefix.length).trim()
      const translatedVal = HI_DICTIONARY[val] || LOWER_HI_DICTIONARY[val.toLowerCase()] || val
      return rule.hi + ' ' + translatedVal
    }
  }

  // 6. Sub-sentence keyword replacement
  let working = trimmed
  let changed = false

  if (working.includes('/ q') || working.includes('/q')) {
    working = working.replaceAll('/ q', '/ क्विंटल').replaceAll('/q', '/ क्विंटल')
    changed = true
  }
  if (working.includes('/ quintal')) {
    working = working.replaceAll('/ quintal', '/ क्विंटल')
    changed = true
  }
  if (working.includes('kg/ha')) {
    working = working.replaceAll('kg/ha', 'किग्रा/हेक्टेयर')
    changed = true
  }

  for (let i = 0; i < PHRASE_KEYS.length; i++) {
    const phrase = PHRASE_KEYS[i]
    if (working.includes(phrase)) {
      working = working.replaceAll(phrase, HI_DICTIONARY[phrase])
      changed = true
    }
  }

  return changed ? working : trimmed
}

/**
 * Translates a full text string from English to Hindi or restores English.
 * Preserves leading and trailing whitespace and handles multi-sentence paragraphs.
 */
export function translateText(text, language) {
  if (!text || typeof text !== 'string') return text

  const match = text.match(/^(\s*)([\s\S]*?)(\s*)$/)
  if (!match) return text
  const leading = match[1]
  const trimmed = match[2]
  const trailing = match[3]

  if (!trimmed) return text

  // If restoring to English
  if (language !== 'hi') {
    const restored = REVERSE_HI[trimmed] || trimmed
    return leading + restored + trailing
  }

  // Check if trimmed matches directly
  const direct = translateSegment(trimmed, 'hi')
  if (direct !== trimmed) {
    return leading + direct + trailing
  }

  // For multi-sentence paragraphs, split by sentence delimiters and translate segments
  if (trimmed.includes('. ') || trimmed.includes('\n') || trimmed.includes('? ') || trimmed.includes('! ')) {
    const sentences = trimmed.split(/(?<=[.!?\n])\s+/)
    if (sentences.length > 1) {
      let anyChanged = false
      const translatedSentences = sentences.map((s) => {
        const tr = translateSegment(s.trim(), 'hi')
        if (tr !== s.trim()) anyChanged = true
        return tr
      })
      if (anyChanged) {
        return leading + translatedSentences.join(' ') + trailing
      }
    }
  }

  return leading + direct + trailing
}

const ATTRS = ['placeholder', 'title', 'aria-label', 'alt']
const textNodeMap = new WeakMap()
const attrNodeMap = new WeakMap()

function translateNodeAttributes(node, language) {
  let entries = attrNodeMap.get(node)
  if (!entries) {
    entries = {}
    attrNodeMap.set(node, entries)
  }

  for (const a of ATTRS) {
    const now = node.getAttribute(a)
    if (now == null) continue

    if (language === 'hi') {
      let e = entries[a]
      if (!e) {
        e = { original: now, applied: null }
        entries[a] = e
      } else if (now !== e.applied && now !== e.original) {
        e.original = now
        e.applied = null
      }
      const next = translateText(e.original, 'hi')
      if (next !== now) {
        node.setAttribute(a, next)
        e.applied = next
      }
    } else {
      let e = entries[a]
      if (e && e.original && now !== e.original) {
        node.setAttribute(a, e.original)
        e.applied = e.original
      }
    }
  }
}

function translateTextNode(node, language) {
  const now = node.nodeValue
  if (!now || !now.trim()) return

  let e = textNodeMap.get(node)

  if (language === 'hi') {
    if (!e) {
      e = { original: now, applied: null }
      textNodeMap.set(node, e)
    } else if (now !== e.applied && now !== e.original) {
      // React updated the text node
      e.original = now
      e.applied = null
    }

    if (now === e.applied) return

    const next = translateText(e.original, 'hi')
    if (next !== now) {
      node.nodeValue = next
      e.applied = next
    }
  } else {
    // English mode: restore original
    if (e && e.original && now !== e.original) {
      node.nodeValue = e.original
      e.applied = e.original
    }
  }
}

function translateDomTree(node, language) {
  if (!node) return

  if (node.nodeType === Node.ELEMENT_NODE) {
    const tag = node.tagName.toLowerCase()
    if (tag === 'script' || tag === 'style' || tag === 'textarea') return
    if (node.hasAttribute('data-no-translate') || node.classList.contains('no-translate')) return

    // Inputs: translate attributes only, but translate value for button/submit
    if (tag === 'input') {
      const type = (node.type || '').toLowerCase()
      if (type === 'button' || type === 'submit') {
        const val = node.value
        if (val) {
          if (language === 'hi') {
            const next = translateText(val, 'hi')
            if (next !== val) node.value = next
          }
        }
      }
      translateNodeAttributes(node, language)
      return
    }

    translateNodeAttributes(node, language)
  }

  if (node.nodeType === Node.TEXT_NODE) {
    translateTextNode(node, language)
    return
  }

  const children = node.childNodes
  for (let i = 0; i < children.length; i++) {
    translateDomTree(children[i], language)
  }
}

export function LanguageProvider({ children }) {
  const location = useLocation()
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('agroai_language') || 'en'
    } catch {
      return 'en'
    }
  })

  const setLanguage = (value) => {
    setLanguageState(value)
    try {
      localStorage.setItem('agroai_language', value)
    } catch {}
  }

  const isHindi = language === 'hi'

  // Translation helper function
  const t = useMemo(() => {
    return (text) => translateText(text, language)
  }, [language])

  useEffect(() => {
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en'
    if (document.body) {
      document.body.classList.toggle('lang-hi', language === 'hi')
    }

    let isTranslating = false
    let pendingRaf = null

    function performTranslation() {
      if (isTranslating) return
      isTranslating = true
      try {
        translateDomTree(document.body, language)
      } finally {
        isTranslating = false
      }
    }

    const scheduleTranslation = () => {
      if (pendingRaf) return
      pendingRaf = requestAnimationFrame(() => {
        pendingRaf = null
        performTranslation()
      })
    }

    // Initial sweeps on mount or language toggle
    performTranslation()
    const t1 = setTimeout(performTranslation, 60)
    const t2 = setTimeout(performTranslation, 200)
    const t3 = setTimeout(performTranslation, 500)
    const t4 = setTimeout(performTranslation, 1000)
    const t5 = setTimeout(performTranslation, 2000)

    // MutationObserver to capture DOM insertions and text updates
    const observer = new MutationObserver(() => {
      if (isTranslating) return
      scheduleTranslation()
    })

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS
    })

    // Active sweep interval while in Hindi mode (guarantees dynamic route and API data translate cleanly)
    let intervalId = null
    if (language === 'hi') {
      intervalId = setInterval(() => {
        if (!isTranslating) {
          performTranslation()
        }
      }, 500)
    }

    // Intercept client-side route transitions (pushState, replaceState, popstate)
    const handleRouteChange = () => {
      scheduleTranslation()
      setTimeout(performTranslation, 80)
      setTimeout(performTranslation, 300)
    }

    window.addEventListener('popstate', handleRouteChange)
    window.addEventListener('hashchange', handleRouteChange)

    return () => {
      if (pendingRaf) cancelAnimationFrame(pendingRaf)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      if (intervalId) clearInterval(intervalId)
      window.removeEventListener('popstate', handleRouteChange)
      window.removeEventListener('hashchange', handleRouteChange)
      observer.disconnect()
    }
  }, [language])

  // Route change listener: sweeps on every navigation
  useEffect(() => {
    if (language !== 'hi') return
    translateDomTree(document.body, 'hi')
    const r1 = setTimeout(() => translateDomTree(document.body, 'hi'), 80)
    const r2 = setTimeout(() => translateDomTree(document.body, 'hi'), 250)
    const r3 = setTimeout(() => translateDomTree(document.body, 'hi'), 600)
    const r4 = setTimeout(() => translateDomTree(document.body, 'hi'), 1200)
    return () => {
      clearTimeout(r1)
      clearTimeout(r2)
      clearTimeout(r3)
      clearTimeout(r4)
    }
  }, [location.pathname, language])

  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t,
    isHindi
  }), [language, t, isHindi])

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
