# MARVEAN // AI Market & Competitive Intelligence Platform


---

## 1. Project Overview

> **Elevator Pitch:** Centralize market intelligence, track competitive movements, connect research evidence, and turn emerging signals into strategic business insights.

Marvean provides a centralized enterprise platform for managing market intelligence, competitor information, industry observations, commercial signals, and strategic research.

### Core Business Problem
Organizations traditionally gather market and competitor information from disconnected sources, leading to:
- Distributed and unorganized competitor data
- Time-consuming manual and repetitive market research
- Delayed detection of commercial moves and pricing shifts
- Lost historical context and lack of competitor audit trails
- Decisions built on unverified hearsay rather than audited evidence
- Siloed intelligence across Strategy, Sales, Marketing, and BI teams

### Value Proposition
- **Centralizes Market Intelligence**: A unified registry for all competitor dossiers and market observations.
- **Improves Competitor Visibility**: Real-time surveillance of pricing shifts, product launches, and patent filings.
- **Organizes Research Workflows**: Structured evidence verification with primary document provenance.
- **Maintains Historical Intelligence**: Multi-year archives of competitor pricing and strategic pivots.
- **Supports Structured Strategic Analysis**: Executive briefing generation and actionable counter-moves.

---

## 2. Platform Structure

### 2.1 Web Application (Interactive Intelligence Console)
- **Competitor Registry**: Detailed company profiles, products/services taxonomy, market position scorecards, tier classification (Tier 1 Direct, Tier 2 Challenger, Emerging), executive movements, and historical change audits.
- **Market Intelligence Workspace**: Market observations, industry trend tracking across commerce segments, and source attribution.
- **Commercial Signals Feed**: Automated detection of competitor moves (Pricing Shifts, Product Launches, Patent Filings, Leadership Moves) with impact ratings (Critical, Major, Minor) and confidence scoring.
- **Research Governance**: Audited source citations (SEC Edgar, USPTO, direct pricing monitors), cryptographic evidence chains, peer review workflows, and analyst task ownership.
- **Strategic Insights Dashboard**: Real-time executive synthesis, recommended counter-moves, and downloadable briefing decks.

### 2.2 Product Landing Page
- Strategic positioning for enterprise and global commerce
- High-resolution UI showcase graphics
- Continuous multi-source data ingestion pipeline architecture
- Cross-functional enterprise use cases
- Transparent commercial database subscription plans

---

## 3. Technology Stack

- **Frontend**: Responsive, modern HTML5, Vanilla CSS3 (Custom Enterprise Retro-Arcade Command System), and Modular Vanilla JavaScript with Web Audio API synthesizer.
- **Backend**: PHP REST API with PDO/MySQL
- **Database**: MySQL
- **Server**: Zero-dependency Node.js HTTP server with dual-stack binding and automatic port fallback.

---

## 4. Quick Start

Run the local server:
```bash
node server.js
```
Open [http://localhost:3001/](http://localhost:3001/) (or port 3000 if available) in your browser.

### Contact form reCAPTCHA

The contact form uses Google reCAPTCHA. Configure the private verification key in the server environment before starting Node:

PowerShell:
```powershell
$env:RECAPTCHA_SECRET_KEY = "your-secret-key"
node server.js
```

Never place the secret key in HTML or frontend JavaScript. The public site key is configured in the contact form and can be restricted to the production domain in the Google reCAPTCHA console.

## 5. Backend and `dist` deployment

The `dist/` directory contains the static frontend only. The PHP backend must run separately with a PHP-capable web server and a reachable MySQL database.

Start the backend locally with XAMPP:

```powershell
C:\xampp\php\php.exe -S localhost:8000 -t backend\public backend\public\index.php
```

Verify the connection before opening the dashboard:

```powershell
Invoke-WebRequest http://localhost:8000/api/status
Invoke-WebRequest http://localhost:8000/api/stats
```

The status response must contain `"status":"online"` and `"database":"connected"`. The dashboard uses `http://localhost:8000/api` on local development and `/api` when the frontend is hosted in production. If the backend is hosted on a different domain, define `window.MARVEAN_API_BASE` before loading `dashboard.js`, for example:

```html
<script>window.MARVEAN_API_BASE = 'https://api.example.com/api';</script>
<script src="dashboard.js"></script>
```

Do not copy `backend/.env` into `dist/` or expose database credentials. Configure the backend environment on the PHP server instead.
