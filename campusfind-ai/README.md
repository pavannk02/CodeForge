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
- **Backend / Database**: **Supabase** (PostgreSQL, Supabase Auth, Storage) + Local In-Memory Fallback
- **Security & Privacy**: Private evidence encryption/isolation preventing unauthorized disclosure of confidential personal identifying marks.
