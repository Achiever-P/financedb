# FinSet – Financial Dashboard

Built a responsive finance dashboard using React, Tailwind CSS, and Recharts to track income, expenses, and financial insights. Implemented interactive charts, transaction management (CRUD), role-based access control, dark mode, and localStorage-based persistence, with advanced filtering, sorting, and CSV export features.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Tailwind CSS 3 | Utility-first styling |
| Recharts | Charts (area, bar, pie/donut) |
| Lucide React | Icons |
| Vite | Build tool & dev server |

---

## ✨ Features

### 1. Dashboard Overview
- Summary cards: **Total Balance**, **Income**, **Expenses** with percentage change, transaction count, category count
- Balance trend area chart (this month vs last month)
- Recent transactions table

### 2. Analytics Page (matches screenshot)
- Period selector + widget controls
- 3 summary cards
- **Total Balance Overview** – dual-line area chart with peak annotation
- **Statistics** – interactive donut chart with category legend
- **Budget vs Expense** – grouped bar chart with "exceeded" callout

### 3. Transactions Page
- **Search** by description
- **Filter** by type (income/expense) and category
- **Sort** by date, description, or amount (asc/desc)
- **Export CSV** button
- **Add / Edit / Delete** transactions (Admin role only)
- Empty state when no results

### 4. Insights Page
- 4 insight cards: highest category, monthly comparison, savings rate, average transaction
- Horizontal bar chart of spending by category with color coding
- Financial health summary grid

### 5. Role-Based UI
Switch roles via the dropdown in the header:
- **Admin** – can add, edit, delete transactions
- **Viewer** – read-only; add/edit/delete buttons hidden

### 6. Dark Mode
Toggle via the sun/moon buttons at the bottom of the sidebar. Preference persisted in `localStorage`.

### 7. Data Persistence
All transactions and role/theme preferences are saved to `localStorage` and restored on reload.

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx        # Left navigation
│   ├── Header.jsx         # Top bar with role switcher & avatar
│   ├── SummaryCard.jsx    # Reusable stat card
│   ├── BalanceChart.jsx   # Area chart (Recharts)
│   ├── BudgetChart.jsx    # Grouped bar chart (Recharts)
│   ├── StatisticsChart.jsx# Donut chart (Recharts)
│   └── TxModal.jsx        # Add/Edit transaction modal
├── context/
│   └── AppContext.jsx     # Global state (useReducer + localStorage)
├── data/
│   └── mockData.js        # Mock transactions & chart data
├── pages/
│   ├── Analytics.jsx      # Main analytics view (matches design)
│   ├── Dashboard.jsx      # Overview with recent transactions
│   ├── Transactions.jsx   # Full transaction list with CRUD
│   └── Insights.jsx       # Spending insights & health summary
├── App.jsx
├── main.jsx
└── index.css              # Tailwind directives + custom scrollbar
```

---

## 🎨 Design Notes

- **Font**: DM Sans (body) + DM Mono (numbers)
- **Accent color**: Violet-600 (`#7c3aed`) throughout
- **Border radius**: 2xl (16px) on cards, xl on controls
- **Hover states**: subtle lift (`-translate-y-0.5`) + shadow upgrade
- **Responsive**: collapses to single-column on mobile; sidebar narrows

---
