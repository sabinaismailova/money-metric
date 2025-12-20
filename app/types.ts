export type User = {
  _id: string;
  googleId: string;
  displayName?: string;
  email?: string;
  photo?: string;
  createdAt: string;
};

export type TransactionType = "Income" | "Expense";

export type RecurrenceInterval =
  | "Daily"
  | "Weekly"
  | "Biweekly"
  | "Monthly"
  | "Yearly"
  | "";

export type Transaction = {
  _id: string;
  userId: string;

  type: TransactionType;
  category: string;
  amount: number;

  date: string;
  note?: string;

  isRecurring: boolean;
  recurrenceInterval: RecurrenceInterval;
  nextRecurrence?: string;

  timezone?: string;

  createdAt: string;
  updatedAt: string;
};

export type CategoryColor = {
  _id: string;
  userId: string;
  category: string;
  color: string;
};

export type TransactionTypeColor = {
  _id: string;
  userId: string;
  type: TransactionType;
  color: string;
};

export type SummaryTotals = {
  income: number;
  expenses: number;
  net: number;
};

export type CategoryBreakdown = {
  category: string;
  amount: number;
  pct: number;
};

export type CategoryChange = {
  category: string;
  changePct: number;
};

export type SummaryComparison = {
  expensesChangePct: number;
  incomeChangePct: number;
  categoryChanges: CategoryChange[];
};

export type UserSummaryMode = "monthly" | "yearly";

export type UserSummary = {
  _id: string;
  userId: string;

  year: number;
  month?: number;
  mode: UserSummaryMode;

  totals: SummaryTotals;
  breakdown: CategoryBreakdown[];
  comparison?: SummaryComparison;

  summaryText?: string;
  lastUpdated?: string;
};
