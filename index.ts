export interface Account {
    id: string;
    name: string;
    type: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'CASH' | 'WALLET' | 'INVESTMENT';
    currency: string;
    balance: number;
}

export interface Category {
    id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE';
    color?: string;
    icon?: string;
}

export interface Transaction {
    id: string;
    accountId: string;
    accountName: string;
    categoryId?: string;
    categoryName?: string;
    categoryColor?: string;
    categoryIcon?: string;
    amount: number;
    currency: string;
    description?: string;
    date: string;
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
}

export interface BudgetItem {
    id?: string;
    categoryId: string;
    categoryName?: string;
    categoryColor?: string;
    amount: number;
    spent: number;
}

export interface Budget {
    id?: string;
    name: string;
    month: number;
    year: number;
    totalAmount: number;
    currency: string;
    items: BudgetItem[];
}
