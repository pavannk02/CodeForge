# 🎓 CampusFind AI — Smart Campus Lost & Found Platform

> **"Lost something? Let AI help you find it."**  
> AI identifies potential matches. Students communicate directly. Humans verify ownership. Campus security ensures safe recovery.

Built for the **CodeForge Hackathon** adhering strictly to `plan.md` specifications and high-fidelity SaaS design principles.

---

## 📸 Design Inspiration & Admin Dashboard

The application features a tailored **Campus Lost & Found Admin Portal** replicating the provided dashboard layout:
- **5 High-Level Metric Tiles**: Total Reports (`+12%`), Lost Reports (`+8%`), Found Reports (`+16%`), Potential Matches, and Pending Requests.
- **TrustLoop Recovery Overview**: Interactive SVG trend curve for weekly recovered items and recovery rate (`67%`).
- **Reports by Category**: Donut breakdown showing Electronics (38%), Accessories (21%), Documents (15%), Bags (13%), Others (13%).
- **Verification Portal**: Confidential private evidence inspection (unrevealed markings/contents) before approving claims.

---

## ⚡ Quick Start

### 1. Run Development Server
```bash
cd campusfind-ai
npm install
npm run dev
```

### 2. Ready-To-Test Demo Credentials
The application operates in **Local Demo Mode** by default when Supabase environment variables are not supplied. You can log in right away with any password (6+ chars):

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Student (Aryan)** | `student@campus.edu` | `password123` | Student Dashboard, Report Lost/Found, Matches, Recovery Claims |
| **Student (Neha)** | `student2@campus.edu` | `password123` | Multi-user TrustLoop testing (Finder role) |
| **Admin / Security** | `admin@campus.edu` | `password123` | Full Campus Security Admin Portal (`/admin/*`) |

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React icons
- **Router**: React Router v7 with protected routes & role-based access
- **AI Matching Engine**: Multi-factor weighted similarity algorithm:
  $$\text{Match Score} = (D \times 0.35) + (C \times 0.25) + (L \times 0.25) + (T \times 0.15)$$
  - **$D$ Description**: Word tokenization, stop-word removal, keyword overlap
  - **$C$ Category**: Exact vs. related category heuristics
  - **$L$ Location**: Campus zones (Library, Canteen, Labs, Hostel, Sports Ground)
  - **$T$ Date**: Temporal decay curve
- **Backend / Database**: **Supabase** (PostgreSQL, Supabase Auth, Storage) + Local In-Memory Fallback
- **Security & Privacy**: Private evidence encryption/isolation preventing unauthorized disclosure of confidential personal identifying marks.

---

## 🗄️ Supabase Setup (When You Are Ready)

To connect your Supabase project:
1. Run the SQL schema in `supabase_schema.sql` inside your **Supabase SQL Editor**.
2. Create a public storage bucket named `item-images`.
3. Create a `.env` file inside `campusfind-ai/`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Restart `npm run dev`.

---

## 📂 Project Structure

```
campusfind-ai/
├── src/
│   ├── components/       # Reusable UI (Navbar, Sidebar, ItemCard, StatusBadge, Spinner, Layout)
│   ├── context/          # AuthContext (Supabase Auth + Demo fallbacks)
│   ├── lib/              # Supabase client, Campus constants
│   ├── pages/
│   │   ├── LandingPage.tsx        # High-converting SaaS landing page
│   │   ├── LoginPage.tsx          # Split login with demo hints
│   │   ├── RegisterPage.tsx       # Student registration
│   │   ├── StudentDashboard.tsx   # Personalized student dashboard
│   │   ├── ExploreItems.tsx       # Search and filter lost & found reports
│   │   ├── ReportLost.tsx         # Report lost item form
│   │   ├── ReportFound.tsx        # Report found item form
│   │   ├── ItemDetails.tsx        # Detailed item view + claim button
│   │   ├── MyReports.tsx          # Manage user's submitted reports
│   │   ├── AIMatches.tsx          # Potential AI match suggestions & score breakdown
│   │   ├── RecoveryRequests.tsx   # TrustLoop person-to-person handover protocol
│   │   ├── NotificationsPage.tsx  # In-app real-time notifications
│   │   ├── Profile.tsx            # Student profile & credentials
│   │   └── admin/                 # Dedicated Campus Security Admin Portal
│   │       ├── AdminDashboard.tsx # Matches WhatsApp reference image
│   │       ├── ManageReports.tsx  # Moderate lost & found submissions
│   │       ├── ManageMatches.tsx  # AI matching oversight
│   │       ├── ManageRecovery.tsx # Handover queue management
│   │       ├── Verification.tsx   # Confidential ownership proof verification
│   │       ├── ReturnedItems.tsx  # Archived reunited items
│   │       ├── ManageUsers.tsx    # Campus user directory
│   │       ├── Analytics.tsx      # Recovery rates & campus zone heatmap
│   │       └── AdminSettings.tsx  # Weight tuning & protocol safeguards
│   ├── services/         # Item & database service layer
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Weighted AI matching engine
├── supabase_schema.sql   # Complete PostgreSQL schema with RLS policies
└── package.json
```

---

## 🏆 Hackathon Demonstration Flow
1. **Aryan** logs in (`student@campus.edu`) and views potential matches for his lost black wallet.
2. The AI algorithm highlights a **95% match** found near the **Library**.
3. Aryan sends a **Recovery Request** through TrustLoop.
4. **Security Admin** logs in (`admin@campus.edu`), reviews the private matching marks in the **Verification Portal**, and schedules an in-person handover.
5. Both parties confirm the physical handover, and the item moves to **Returned Items**.

