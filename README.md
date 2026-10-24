# Aawaz: Safe Reporting and Evidence Vault

> **Private Harassment Reporting That Links Repeat Offenders**  
> *"Harassment isn't a one-off. It's a pattern that silence hides. Aawaz lets survivors speak without going first."*

---

## Overview

Harassment is rarely a one-time event; it is usually a pattern hidden by silence. Many people hesitate to report alone out of fear of retaliation, disbelief, or "he said, she said" dismissals.

**Aawaz** solves this by letting survivors speak without having to go first:

- **Private & Sealed**: Your report is encrypted directly on your device. No one can read your story.
- **Smart Matching**: The system quietly checks if anyone else reported the same person at your organization.
- **You Are Not Alone**: When an independent match is found, both people are privately alerted.
- **Mutual Control**: You both decide what to do next—from simply knowing a match exists, to comparing timelines, to filing an official joint complaint together.

---

## Safety & Disguise

- **Study Notes Disguise**: A discreet student revision screen (**"Computer Science & Data Structures Notes"**) that can be opened anytime to hide what you are doing.
- **Quick Exit**: A persistent one-click button in the navigation bar that immediately switches to the Notes disguise and clears sensitive screen data, with an emergency leave button to Google.
- **No Personal Details Required**: No phone number, email address, or real name needed. Your account is protected by an anonymous pseudonym and a private 12-word recovery phrase.

---

## Core Features

### 1. Dynamic Anonymous Vaults
- Create fresh anonymous accounts with private recovery phrases anytime.
- Switch between different vaults to easily test and demonstrate multi-user reporting without fixed or hardcoded profiles.

### 2. Guided 5-Step Incident Builder
- **Step 1: Incident Story** — Type freely or record using built-in voice dictation.
- **Step 2: AI Timeline** — Structures free-form text into clear, chronological events with behavior tags.
- **Step 3: Person Details** — Enter the person and workplace for private sound-based matching.
- **Step 4: Evidence Locker** — Attach files with cryptographic integrity hashes.
- **Step 5: Seal & Encrypt** — Sealed client-side with AES-256-GCM encryption before saving.

### 3. Private Match Radar
- Real-time animated radar that scans for matching reports.
- Smart sound-based matching that catches misspelled or differently-formatted names.
- Instant visual and audio notification when another person reports the same individual.

### 4. Two-Party Mutual Consent Ladder
Information only reveals when **both people agree** to that step:
- **Step 1: Know Someone Else Reported** — Confirms a match without revealing names, dates, or stories.
- **Step 2: Share Incident Timelines** — Unlocks dates and events when both agree, proving repeated behavior.
- **Step 3: File Complaint Together** — Unlocks the joint filing agreement when both accounts sign.
- **Peer Response Simulator** — Interactive controls (`Step 1`, `Step 2`, `Step 3`) to test how mutual consent works in real time.

### 5. Joint Complaint Agreement
Shows clearly how two survivors combine forces for safety and strength:
- **Combined Proof**: Merges both timelines into one case, eliminating "he said, she said" dismissals.
- **Safety at Work**: Jointly asks for immediate protection (moving the accused person away during inquiry).
- **Strict Privacy**: Mutual non-disclosure agreement to protect both identities.
- **Digital Signatures**: Confirmed and signed with both anonymous vault keys.
- **Combined Timeline**: Displays both reports chronologically to show repeated patterns over time.

### 6. Official Complaint PDF & Committee Reviewer Portal
- **Download Stamped PDF**: Generates a structured formal complaint document ready for committee submission.
- **Committee Reviewer Portal**: An administrative view for committee members to review incoming joint cases and immutable audit logs.

---

## Project Structure

```
Aawaz/
├── client/                     # Frontend Application (React + Vite + TypeScript)
│   ├── public/                 # Static assets (icons, manifest)
│   ├── src/
│   │   ├── components/         # All user interface screens and widgets
│   │   │   ├── Dashboard.tsx            # Main vault overview & account manager modal
│   │   │   ├── ReportBuilder.tsx        # 5-step guided incident form with voice input
│   │   │   ├── MatchesHub.tsx           # Two-party consent ladder & joint complaint pact
│   │   │   ├── PatternRadarVisualizer.tsx # Animated sonar radar with audio alert
│   │   │   ├── ReviewerConsole.tsx      # Committee reviewer portal with PIN access
│   │   │   ├── RightsExplainer.tsx      # POSH Act legal guide & helpline directory
│   │   │   ├── DisguiseOverlay.tsx      # Study Notes cover screen (PIN: 2026)
│   │   │   └── Navbar.tsx               # Top navigation with instant Quick Exit
│   │   ├── context/
│   │   │   └── AppContext.tsx           # Global state, multi-vault storage & matching logic
│   │   ├── utils/
│   │   │   ├── crypto.ts                # Client-side AES-256-GCM encryption & PBKDF2 keys
│   │   │   ├── hasher.ts                # HMAC-SHA256 & Metaphone sound matching
│   │   │   ├── aiStructuring.ts         # Automated chronological event timeline parser
│   │   │   ├── pdfGenerator.ts          # jsPDF formal complaint document generator
│   │   │   └── translations.ts          # Multilingual text support
│   │   ├── types/
│   │   │   └── index.ts                 # TypeScript data contracts (Reports, Vaults, Matches)
│   │   ├── App.tsx                      # Main application view router
│   │   ├── main.tsx                     # React root entry point
│   │   └── index.css                    # Tailwind CSS custom themes & animations
│   ├── package.json            # Client dependencies and build scripts
│   └── vite.config.ts          # Vite bundler configuration
│
└── server/                     # Backend Matching Service (FastAPI / Python)
    ├── main.py                 # FastAPI matching server endpoints
    ├── requirements.txt         # Python dependencies
    └── test_matching.py        # Automated test suite for phonetic token matching
```

### What Each Folder is About:
- **client/src/components/**: Contains all interactive user-facing screens: the private incident builder, the match radar, the two-party consent ladder, the committee review portal, and the Study Notes disguise.
- **client/src/context/**: Manages the local application state (`AppContext.tsx`), handling multi-user account switching, client-side encrypted vault storage, and instant peer match simulations.
- **client/src/utils/**: Core security and utility functions including browser Web Crypto encryption (AES-256-GCM), sound-based phonetic matching (Metaphone), AI event structuring, and official PDF generation.
- **client/src/types/**: Strict TypeScript interfaces defining the shapes of incident reports, match records, consent levels, and user accounts.
- **server/**: A lightweight Python / FastAPI backend microservice demonstrating server-side blind HMAC matching and phonetic token indexing for enterprise deployments.

---

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS
- **Security & Cryptography**: Native Web Crypto API (AES-256-GCM, PBKDF2, HMAC-SHA256)
- **Matching Algorithms**: Metaphone & Soundex phonetic algorithms
- **Document Export**: jsPDF + html2canvas
- **Icons**: Lucide React

---

## Getting Started

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## License

This project is open-source under the **MIT License**.
