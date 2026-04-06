export const TRANSACTIONS = [
  { id: 1,  date: '2024-07-19', description: 'Salary Deposit',       category: 'Income',            type: 'income',  amount: 5000.00 },
  { id: 2,  date: '2024-07-18', description: 'Netflix Subscription',  category: 'Entertainment',     type: 'expense', amount: -15.99  },
  { id: 3,  date: '2024-07-17', description: 'Whole Foods Market',    category: 'Food & Groceries',  type: 'expense', amount: -124.50 },
  { id: 4,  date: '2024-07-16', description: 'Freelance Payment',     category: 'Income',            type: 'income',  amount: 1200.00 },
  { id: 5,  date: '2024-07-15', description: 'Electricity Bill',      category: 'Rent',              type: 'expense', amount: -98.00  },
  { id: 6,  date: '2024-07-14', description: 'Cafe Latte',            category: 'Cafe & Restaurants',type: 'expense', amount: -6.50   },
  { id: 7,  date: '2024-07-13', description: 'Amazon Purchase',       category: 'Others',            type: 'expense', amount: -67.30  },
  { id: 8,  date: '2024-07-12', description: 'Uber Ride',             category: 'Others',            type: 'expense', amount: -22.40  },
  { id: 9,  date: '2024-07-11', description: 'Dividend Income',       category: 'Income',            type: 'income',  amount: 340.00  },
  { id: 10, date: '2024-07-10', description: 'Gym Membership',        category: 'Education',         type: 'expense', amount: -45.00  },
  { id: 11, date: '2024-07-09', description: 'Bank Transfer',         category: 'Money Transfer',    type: 'expense', amount: -500.00 },
  { id: 12, date: '2024-07-08', description: 'Spotify Premium',       category: 'Entertainment',     type: 'expense', amount: -9.99   },
  { id: 13, date: '2024-07-07', description: 'Restaurant Dinner',     category: 'Cafe & Restaurants',type: 'expense', amount: -78.20  },
  { id: 14, date: '2024-07-06', description: 'Online Course',         category: 'Education',         type: 'expense', amount: -199.00 },
  { id: 15, date: '2024-07-05', description: 'Rent Payment',          category: 'Rent',              type: 'expense', amount: -1500.00},
  { id: 16, date: '2024-07-04', description: 'Consulting Fee',        category: 'Income',            type: 'income',  amount: 2000.00 },
  { id: 17, date: '2024-07-03', description: 'Pharmacy',              category: 'Others',            type: 'expense', amount: -32.80  },
  { id: 18, date: '2024-07-02', description: 'Coffee Shop',           category: 'Cafe & Restaurants',type: 'expense', amount: -14.00  },
  { id: 19, date: '2024-07-01', description: 'Internet Bill',         category: 'Rent',              type: 'expense', amount: -59.99  },
  { id: 20, date: '2024-06-30', description: 'Supermarket',           category: 'Food & Groceries',  type: 'expense', amount: -210.40 },
  { id: 21, date: '2024-06-28', description: 'Bonus Payment',         category: 'Income',            type: 'income',  amount: 1500.00 },
  { id: 22, date: '2024-06-25', description: 'Taxi',                  category: 'Others',            type: 'expense', amount: -18.60  },
  { id: 23, date: '2024-06-22', description: 'Wire Transfer',         category: 'Money Transfer',    type: 'expense', amount: -300.00 },
  { id: 24, date: '2024-06-18', description: 'Lunch Meeting',         category: 'Cafe & Restaurants',type: 'expense', amount: -56.90  },
  { id: 25, date: '2024-06-15', description: 'Rent Payment',          category: 'Rent',              type: 'expense', amount: -1500.00},
];

export const BALANCE_TREND = [
  { date: '1 Jul',  thisMonth: 12000, lastMonth: 10000 },
  { date: '3 Jul',  thisMonth: 13200, lastMonth: 11500 },
  { date: '5 Jul',  thisMonth: 12800, lastMonth: 10800 },
  { date: '7 Jul',  thisMonth: 14500, lastMonth: 12000 },
  { date: '9 Jul',  thisMonth: 13900, lastMonth: 11200 },
  { date: '11 Jul', thisMonth: 15000, lastMonth: 13000 },
  { date: '13 Jul', thisMonth: 14200, lastMonth: 12200 },
  { date: '15 Jul', thisMonth: 13600, lastMonth: 11800 },
  { date: '17 Jul', thisMonth: 15700, lastMonth: 13500 },
  { date: '19 Jul', thisMonth: 15700, lastMonth: 13200 },
];

export const BUDGET_VS_EXPENSE = [
  { month: 'Jan', expense: 5500, budget: 6000 },
  { month: 'Feb', expense: 6500, budget: 6000 },
  { month: 'Mar', expense: 5800, budget: 6000 },
  { month: 'Apr', expense: 4900, budget: 6000 },
  { month: 'May', expense: 5200, budget: 6000 },
  { month: 'Jun', expense: 5700, budget: 6000 },
  { month: 'Jul', expense: 6222, budget: 6000 },
];

export const CATEGORY_COLORS = {
  'Money Transfer':    '#4F46E5',
  'Cafe & Restaurants':'#7C3AED',
  'Rent':              '#A78BFA',
  'Education':         '#C4B5FD',
  'Food & Groceries':  '#DDD6FE',
  'Entertainment':     '#EDE9FE',
  'Others':            '#8B5CF6',
  'Income':            '#10B981',
};

export const CATEGORIES = [
  'Food & Groceries', 'Cafe & Restaurants', 'Rent',
  'Entertainment', 'Education', 'Money Transfer', 'Others', 'Income',
];

// Extended time-series data for period switching
export const BALANCE_BY_WEEK = [
  { date: 'W1', thisMonth: 11200, lastMonth: 9800 },
  { date: 'W2', thisMonth: 12800, lastMonth: 11000 },
  { date: 'W3', thisMonth: 14100, lastMonth: 12400 },
  { date: 'W4', thisMonth: 15700, lastMonth: 13200 },
];

export const BALANCE_BY_QUARTER = [
  { date: 'Q1', thisMonth: 38000, lastMonth: 32000 },
  { date: 'Q2', thisMonth: 42500, lastMonth: 37000 },
  { date: 'Q3', thisMonth: 47200, lastMonth: 41000 },
  { date: 'Q4', thisMonth: 15700, lastMonth: 13200 },
];

export const BALANCE_BY_YEAR = [
  { date: '2021', thisMonth: 28000, lastMonth: 22000 },
  { date: '2022', thisMonth: 35000, lastMonth: 28000 },
  { date: '2023', thisMonth: 42000, lastMonth: 35000 },
  { date: '2024', thisMonth: 15700, lastMonth: 42000 },
];

export const BUDGET_BY_MONTH = [
  { month: 'Jan', expense: 5500, budget: 6000 },
  { month: 'Feb', expense: 6500, budget: 6000 },
  { month: 'Mar', expense: 5800, budget: 6000 },
  { month: 'Apr', expense: 4900, budget: 6000 },
  { month: 'May', expense: 5200, budget: 6000 },
  { month: 'Jun', expense: 5700, budget: 6000 },
  { month: 'Jul', expense: 6222, budget: 6000 },
];

export const BUDGET_BY_QUARTER = [
  { month: 'Q1', expense: 17800, budget: 18000 },
  { month: 'Q2', expense: 15800, budget: 18000 },
  { month: 'Q3', expense: 17122, budget: 18000 },
  { month: 'Q4', expense: 6222,  budget: 18000 },
];

export const BUDGET_BY_WEEK = [
  { month: 'W1', expense: 1200, budget: 1500 },
  { month: 'W2', expense: 1800, budget: 1500 },
  { month: 'W3', expense: 1400, budget: 1500 },
  { month: 'W4', expense: 1822, budget: 1500 },
];

export const CURRENCY_RATES = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, JPY: 149.2, CAD: 1.36, AUD: 1.53 };
