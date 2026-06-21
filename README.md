<h1 align="center">🛡️ Advisors Alliance Group (AAG) — Secure, Scalable, and Sustainable Advisory Platform</h1>

<p align="center">
  <strong>An AI-powered platform that provides real-time client memory, market updates, and CPD learning journeys to help financial advisors manage relationships and continuous training at scale.</strong>
</p>

<p align="center">
  <em><b>Advisors Alliance Group (AAG)</b> — Prominent financial advisory and wealth management agency group</em><br/>
</p>

<p align="center">
  <b>🚀 <a href="https://aag-platform-811965513037.asia-southeast1.run.app">Live Demo (Deployed Link)</a></b> •
  <b>🎥 <a href="https://youtu.be/qSJBmJ2PFH8">Watch our Pitching Video (YouTube)</a></b>
</p>

<div align="center">
  <h3>🔑 Test Credentials (Demo Accounts)</h3>
  <p>To explore the platform, sign in using these pre-configured credentials:</p>
  <table style="margin: 0 auto; text-align: left; border-collapse: collapse;">
    <thead>
      <tr style="border-bottom: 2px solid #ddd;">
        <th style="padding: 10px 15px;">Role</th>
        <th style="padding: 10px 15px;">Email</th>
        <th style="padding: 10px 15px;">Password</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 15px;">💼 <b>Advisor</b></td>
        <td style="padding: 10px 15px;"><code>advisor@gmail.com</code></td>
        <td style="padding: 10px 15px;"><code>12345678</code></td>
      </tr>
      <tr>
        <td style="padding: 10px 15px;">📈 <b>Manager</b></td>
        <td style="padding: 10px 15px;"><code>manager@gmail.com</code></td>
        <td style="padding: 10px 15px;"><code>12346578</code></td>
      </tr>
    </tbody>
  </table>
</div>

---

## 👥 Team Details & Responsibilities
* **Team Name**: GoodQuestions

| Member | Role | Responsibility |
| :--- | :--- | :--- |
| **Toh Shee Thong** | Leader | **API & Backend Integration**: Developing the API service, connecting Firestore databases, and managing user authentication and state synchronization. |
| **Angela Ngu Xin Yi** | Member | **AI Models & Intelligence**: Developing RAG Chat memory retrieval, health scoring algorithms, and AI recommendation logic. |
| **Chun Yao Ting** | Member | **Frontend & Data Visualization**: Developing the React UI, interactive dashboard widgets, circular KPI tracking, and morning briefings. |
| **Evelyn Ang** | Member | **Backend Architecture & RSS integration**: Developing the Node server endpoints, integrating CNA RSS news crawler, and managing data pipelines. |
| **Teoh Xin Yee** | Member | **Core Logic & Client Management**: Implementing client memory profiles, expense tracker, follow-up management, and profile similarity insights. |

---

## 📋 Project Overview

### Problem Statement
AAG is a prominent financial advisory and wealth management agency group operating in a fast-changing advisory landscape where advisors must manage client relationships, continuous learning, and a broad ecosystem of partners with consistency and care. The challenge is to build a solution that goes beyond one-off productivity tools and instead creates an organisation-wide capability that supports advisors securely, at scale, and over time:
* **Advisor productivity and client attention** — improve how advisors manage calendars, expenses, client memory, morning briefings, and proactive follow-ups.
* **Living learning and development library** — organise learning content into a curated, searchable, and personalised knowledge journey with CPD tracking and recognition.
* **Partnership ecosystem visibility** — surface the right partner at the right moment, track referrals and introductions, and make ecosystem relationships easier to manage.

### Proposed Solution
The **AAG Advisor Intelligence Platform** addresses these three pillars by serving as a unified secure cockpit for advisors:
* **Advisor Productivity Cockpit**: Includes a Circular Client Health Score (visualizing client engagement, upcoming renewals, and tasks), an AI Client Memory Timeline (extracting facts and timelines), and dynamic follow-up systems.
* **RAG Q&A Chat Assistant**: Generates quick answers regarding client history, declarations, policy exceptions, and schedules.
* **Continuous L&D (CPD Tracker)**: Provides interactive learning paths, customized quizzes, and CPD progress tracking (e.g. tracking hours out of 45 hours).
* **Partnership Referrals Ecosystem**: Seamless tracking of external providers (like Lawyers, Mortgage consultants) with automated logs, and a Sector News Drawer parsing real daily CNA news to recommend proactive outbound advice.
* **Profile Similarity Matching**: Designed a weighted demographic matching engine (Occupation, Age, Risk, and Policy overlap) that recommends blueprints and strategy templates based on successful setups of matching profiles.

### 💡 Client-Centric System Features

| Feature | Explanation |
| :--- | :--- |
| **Smart Reminders & Morning Briefing** | Aggregates urgent alerts (e.g. policy expirations, birthdays, uncontacted clients) and compiles them into a clean, audio-narratable morning summary to start the day. |
| **KPI Dashboard & Task Management** | Real-time monitoring of client counts, pipeline milestones, and CPD progress, accompanied by an interactive drag-and-drop Kanban task board. |
| **Client Intelligence & Relationship Memory** | Auto-extracts unstructured facts, family milestones, and timeline entries to build a unified profile memory that persists across chats. |
| **AI Sales Coach** | An AI-powered RAG chat assistant that reads client logs and details to help advisors instantly draft personalized emails, messages, or review proposals. |
| **CPD Learning Hub** | Curated learning paths, interactive reference libraries, customized quizzes, and visual progress trackers to manage and certify Continuing Professional Development (CPD) hours. |
| **Analytics & Reports** | Comprehensive sales metrics, referral pipelines, and partner metrics to audit productivity and performance over time. |
| **Management Dashboard** | Broad oversight cockpit enabling managers to assign training, monitor team-wide CPD completion, and review aggregate referral volume. |

### SDG Alignment
* **SDG 8: Decent Work and Economic Growth**: Modernizes financial services by boosting advisor productivity and equipping them to offer premium, client-centric guidance.
* **SDG 9: Industry, Innovation, and Infrastructure**: Drives technological transformation within traditional financial advisory sectors.

---

## 🏗️ System Architecture

<p align="center">
  <img src="public/Architecture%20Diagram.png" alt="System Architecture Diagram" width="800" />
</p>

---

## 🛠️ Technologies Used

* **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide Icons, React Router 7.
* **Backend**: Node.js HTTP Server (native modules for lightweight runtime).
* **AI / ML**: Google Vertex AI (Gemini 2.5 Flash API).
* **Database**: Google Firestore (NoSQL database).
* **DevOps & Cloud**: Google Cloud Run, Google Cloud Build, Google Cloud Artifact Registry.

---

## 🧩 Challenges and Approaches

### 1. Incremental AI Memory Synthesis (Context Window Fatigue)
* **Challenge**: Passing full conversation histories or unstructured notes into Vertex AI/Gemini for context during advisor messaging sessions causes rapid "context window fatigue," slow response times, and high token costs as client relationships grow over years.
* **Approach**: Developed an incremental synthesis system in Firestore. Instead of passing historical logs directly, the system passes only the existing `memorySummary` alongside new notes to Gemini, prompting the model to generate structured JSON updates to update the client's timeline entries. This keeps token usage constant and keeps response latency low regardless of client relationship duration.

### 2. Keyless AI Authorization (ADC)
* **Challenge**: Bundling or hardcoding private key service account JSONs (`google.json`) inside Docker images is a severe security vulnerability.
* **Approach**: Configured the code to automatically fall back to Google's **Application Default Credentials (ADC)**. In Cloud Run, the application securely authenticates with Vertex AI using the container's bound service account, eliminating key leaks.

### 3. Smart Profile Similarity Engine
* **Challenge**: Advisors needed a way to identify clients with matching profiles to reuse successful advisory frameworks.
* **Approach**: Designed a client-side utility mapping weights to key fields: Occupation (30%), Age Proximity (20%), Risk Level (25%), and Goals (25%). It matches similar profiles, ranks them, and generates tailored advisory action points.

---

## 💻 Usage Instructions

### 1. Prerequisites
Ensure you have the following installed:
* **Node.js**: Version 18.0.0 or higher.
* **Google Cloud SDK** (Optional): For Cloud Run deployment commands.

---

### 2. Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd aag_platform
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```bash
   # Copy sample env
   cp .env.example .env
   ```
   Open the `.env` file and populate it with your Google Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
   *(Note: The Firebase configuration is already pre-configured inside `src/credentials/firebase.js` and connects automatically to our Firestore database.)*

---

### 3. Running Locally

#### Development Mode (With Hot Reloading)
To start the React development server:
```bash
npm run dev
```
* **Local URL**: `http://localhost:5173`
* The dev server automatically handles hot reloading and communicates with Firestore.
---

## 🌍 Social Impact

The **AAG Advisor Intelligence Platform** is built to create a positive, lasting influence on society by improving the accessibility, quality, and inclusivity of financial literacy and wealth security:

* **Democratizing Financial Security**: By automating tedious administrative tasks (such as client timeline management, daily regulatory reading, and email draft generation), we lower the operational overhead of financial advisory. This cost reduction allows advisors to profitably and comfortably serve lower-income families, young professionals, and mass-market clients who are historically underserved by traditional wealth management firms.
* **Securing Family Legacies & Community Resilience**: By proactively highlighting critical planning deficiencies (such as estate planning, will drafting, or educational endowments), the platform helps advisors identify coverage gaps before a life event occurs. This early intervention helps protect households from sudden insolvency during crises (e.g., loss of a primary breadwinner or high medical bills).
* **Fostering Ethical & Shariah-Compliant Investment**: The platform's dynamic categorization and prompt parsing modules help advisors immediately match clients to moral, environmental, or cultural portfolio choices, encouraging the flow of capital toward ESG (Environmental, Social, and Governance) and Shariah-compliant funds in the Singapore region.
* **Cultivating High-Quality Professional Development**: Transitioning advisors away from disjointed trackers toward a unified, gamified CPD dashboard reduces cognitive fatigue, minimizes burnout, and raises the baseline of ethical compliance and knowledge among financial consultants.

---

## 🔮 Future Improvements

We have mapped out a technical roadmap to scale the platform's capabilities to the next level:

1. **Intelligent PDF policy parsing (OCR + LLM Extraction)**:
   - Introduce an automated upload pipeline where advisors can drag and drop physical policy contracts.
   - The backend will perform OCR and extract policy details, exclusion criteria, premiums, and coverage limits, saving them directly as structured Firestore documents.
2. **Autonomous Multi-Agent Scheduling & Outreach**:
   - Integrate with calendar APIs (Google Calendar, Outlook) and message brokers (WhatsApp/Twilio).
   - Build autonomous sub-agents that email clients regarding renewals, coordinate reviews, and draft message reminders without the advisor needing to check calendars manually.
3. **Advanced Semantic Search with Vector Embeddings**:
   - Implement vector database storage (e.g., Pinecone or Pgvector) for unstructured meeting notes, transcripts, and timeline logs.
   - Enable semantic search (e.g. searching for *"clients expressing anxiety about inflation or housing market stability"*) instead of relying on exact keyword matching.
4. **Offline-First PWA Synchronization**:
   - Build Progressive Web App (PWA) features with service workers to allow advisors to securely access client memory profiles, record meeting notes, and sync changes back to Firestore once connection is re-established.

