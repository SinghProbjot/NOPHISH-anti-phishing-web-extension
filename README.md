# NOPHISH: Advanced Anti-Phishing Browser Extension

A powerful, multi-layered browser extension designed to detect and block phishing attempts in real-time using static URL analysis, threat intelligence APIs, and SSL certificate inspection.

#🔍 Overview
NOPHISH is a comprehensive browser extension that protects users from phishing attacks by analyzing URLs in real-time, checking against reputable threat databases, and detecting advanced phishing tools like Evilginx. It combines multiple defensive strategies to provide robust protection against both known and emerging phishing threats.

# ✨ Features

Real-time URL scanning using multiple threat intelligence APIs
    
    Static indicator detection: Typosquatting, Punycode, IDN homograph attacks
    
    API integration: Google Safe Browsing, IPQualityScore, PhishTank
    
    Evilginx detection via SSL certificate analysis
    
    Local database caching for efficient reputation checks
    
    User-friendly warnings for suspicious sites
    
    Lightweight and non-intrusive

# 🛠️ Technologies Used

    WebExtensions API (Manifest V2)
    
    JavaScript (ES6+)
    
    HTML/CSS for UI components
    
    IndexedDB for local data storage
    
    Node.js (local server for SSL certificate analysis)
    
    Threat Intelligence APIs:
    
    Google Safe Browsing
    
    IPQualityScore
    
    PhishTank (via public database)

# 📦 Installation

1. From Source:
Clone the repository.
    git clone https://github.com/SinghProbjot/NOPHISH.git
    cd NOPHISH
2. Load the extension in Chrome/Edge:

    Open chrome://extensions
    
    Enable "Developer mode"
    
    Click "Load unpacked" and select the extension folder

3. For SSL analysis, run the local Node.js server:

    cd server
    npm install
    node server.js


# 🚀 How It Works

    URL Interception: Uses webRequest.onBeforeRequest to capture navigation attempts.
    
    Reputation Check:
    
    Checks local database (IndexedDB) for cached reputation
    
    Validates against whitelist/blacklist
    
    Queries APIs for threat intelligence
    
    Score Calculation: Combines scores from multiple sources (syntax, APIs) to determine risk.
    
    Blocking: Blocks malicious URLs and displays a warning page.
    
    Evilginx Detection: Uses a local Node.js server to analyze SSL certificates for suspicious issuers.
# 🔧 Configuration

API Keys (Required)

Google Safe Browsing: Get an API key from Google Cloud Console (https://console.cloud.google.com/).

IPQualityScore: Sign up at IPQualityScore (https://www.ipqualityscore.com/) for an API key.

Add keys to background.js:
    
    const API_KEYS = {
      GOOGLE: 'your_google_api_key',
      IPQUALITY: 'your_ipquality_api_key'
    };
# 🧪 Testing
Tested against:

Known phishing URLs (PhishTank)

Typosquatted domains (e.g., g00gle.com)

Punycode attacks (e.g., xn--ggle-55da.com)

Evilginx phishing proxies

# 📈 Future Enhancements

Machine learning integration for heuristic detection

User reporting system

Enhanced SSL pinning detection

Support for Manifest V3

Expanded API integrations

# 👨‍💻 Author
Probjot Singh

GitHub: SinghProbjot (https://github.com/SinghProbjot)

University of Milano-Bicocca

