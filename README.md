# VoteRemote — Full-Stack Digital Remote Voting Platform
### *Academic & Research Prototype for Secure Remote Civic Participation*

---

## 🌟 Executive Overview

**VoteRemote** is a full-stack MERN platform built to demonstrate how eligible voters who are temporarily away from their registered home constituency (e.g. students, relocated professionals, migrant workers) can securely participate in elections remotely without traveling back.

Unlike generic CRUD apps, **VoteRemote** implements a dedicated **Ballot Secrecy Architecture** that cryptographically decouples voter identity from the anonymous encrypted ballot vault.

---

## 🛡️ Core Security & Privacy Architecture

```
                      VOTER IDENTITY LAYER (Identity Vault)
                                  │
    1. Authenticate Voter & Verify Remote Eligibility Pass
                                  │
    2. Issue Single-Use One-Time Anonymous Credential Token
                                  ▼
      ══════════════════════════════════════════════════════════
               ANONYMIZATION BOUNDARY (User JWT Discarded)
      ══════════════════════════════════════════════════════════
                                  │
    3. Retrieve Randomized Constituency Ballot (Token Header Only)
                                  │
    4. Seal Candidate Choice with AES-256-GCM Encryption
                                  │
    5. Invalidate One-Time Credential (Prevents Double-Voting)
                                  ▼
                       ANONYMOUS BALLOT VAULT
                     (Zero Linkage to User Identity)
```

1. **Ballot Secrecy Guarantee**: The system never maintains a `User ➔ VotedFor ➔ Candidate` database relationship.
2. **One-Time Anonymous Voting Token**: Single-use high-entropy token valid for 30 minutes.
3. **AES-256-GCM Encryption**: Vote choices are sealed with authenticated encryption before insertion into the database.
4. **Tamper-Evident Hash Chain**: Every security-critical action is appended to a cryptographic SHA-256 hash-chain verifiable from the admin audit explorer.
5. **Mobility Impact Module**: Estimates travel distance avoided, time saved, and CO₂ emissions offset by remote voting.

---

## 🚀 Quick Setup Guide

### 1. MongoDB Atlas Connection Setup

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Free Shared Cluster (M0).
3. Under **Security ➔ Network Access**, click **Add IP Address** and select **Allow Access from Anywhere (`0.0.0.0/0`)** for development.
4. Under **Security ➔ Database Access**, create a user (e.g., `admin`) and set a secure password.
5. Click **Connect ➔ Drivers ➔ Node.js** and copy your connection string:
   ```env
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/voteremote?retryWrites=true&w=majority
   ```
6. Open `backend/.env` and update `MONGODB_URI`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string_here
   ```

---

### 2. Seed Demo Dataset

Run the automated seeder to populate sample constituencies, parties, candidates, elections, and pre-configured demo accounts:

```bash
# From project root
npm run seed
```

---

### 3. Start Backend & Frontend

Open two terminal windows:

#### Terminal 1 — Backend API:
```bash
cd backend
npm run dev
# Server running at http://localhost:5000
```

#### Terminal 2 — Frontend App:
```bash
cd frontend
npm run dev
# React Vite App running at http://localhost:5173
```

---

## 👥 Pre-Configured Demo Accounts (1-Click Switcher)

The platform UI includes an **Instant Demo Switcher** in the top navigation bar, or you can log in manually:

| Role | Email | Password | Persona & Status |
|---|---|---|---|
| **Remote Voter** | `voter@voteremote.org` | `Voter@2026` | Registered in Visakhapatnam, living in Bengaluru. Pre-approved remote pass. |
| **Election Admin** | `admin@voteremote.org` | `Admin@2026` | Full administrative access, remote pass review, live tally, audit explorer. |
| **Election Officer** | `officer@voteremote.org` | `Officer@2026` | Request verification and clearance approval. |

---

## 🗳️ How to Test the 4-Stage Secure Voting Flow

1. Click **Demo Switcher ➔ Remote Voter** (or log in as `voter@voteremote.org`).
2. On the **Voter Dashboard**, observe your registered home constituency (**Visakhapatnam Parliamentary**) vs. your declared remote location (**Bengaluru, Karnataka**).
3. Click **Enter Secure Ballot Session**.
4. **Stage 1 (Identity Check)**: Confirm your eligibility clearance.
5. **Stage 2 (Token Generation)**: Click **Generate Anonymous Token**. The system decouples your identity and enters the anonymized session.
6. **Stage 3 (Ballot Choice)**: Review candidates presented in randomized order. Select your candidate.
7. **Stage 4 (Sealed Receipt)**: Click **Seal & Submit Encrypted Ballot**. The vote is encrypted with AES-256-GCM, the one-time token is destroyed, and an official confirmation code (e.g. `VR-A78B3F90E12C`) is generated.
8. Switch to **Election Admin** via the Demo Switcher, navigate to **Live Results & Candidate Tally** to see real-time vote counts and audit logs.

---

## 🧪 Cryptographic Audit Hash-Chain Explorer

To verify that the audit trail has not been tampered with:
1. Log in as **Election Admin** (`admin@voteremote.org`).
2. Open the **Cryptographic Audit Trail** tab.
3. Click **Run Integrity Verification**.
4. The system recalculates SHA-256 hashes across every log block from the Genesis Block to the tip and displays confirmation.

---

## ⚖️ Academic / Research Disclaimer

> **Notice**: This platform is a **research and academic prototype** developed to investigate the cryptographic feasibility and user experience of remote digital voting for displaced citizens. It uses synthetic voter IDs and synthetic electoral rolls. It is **not** an official government voting platform.
