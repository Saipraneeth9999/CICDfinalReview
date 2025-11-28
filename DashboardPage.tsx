import { useEffect, useState } from 'react';
import api from '../api/client';
import { Account, Transaction } from '../types';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function DashboardPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [accountsRes, transactionsRes] = await Promise.all([
                api.get('/accounts'),
                api.get('/transactions?size=10'),
            ]);
            setAccounts(accountsRes.data);
            setTransactions(transactionsRes.data.content || []);
        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const income = transactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown for pie chart
    const categoryData = transactions
        .filter(t => t.type === 'EXPENSE' && t.categoryName)
        .reduce((acc, t) => {
            const existing = acc.find(item => item.name === t.categoryName);
            if (existing) {
                existing.value += t.amount;
            } else {
                acc.push({ name: t.categoryName!, value: t.amount });
            }
            return acc;
        }, [] as { name: string; value: number }[]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
                            <p className="text-2xl font-bold mt-1">${totalBalance.toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-full">
                            <Wallet className="w-6 h-6 text-primary-600" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
                            <p className="text-2xl font-bold mt-1 text-green-600">${income.toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
                            <p className="text-2xl font-bold mt-1 text-red-600">${expenses.toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                            <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Net Savings</p>
                            <p className="text-2xl font-bold mt-1">${(income - expenses).toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
                    {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500 py-12">No expense data available</p>
                    )}
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                    <div className="space-y-3">
                        {transactions.slice(0, 5).map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                <div>
                                    <p className="font-medium">{transaction.description || transaction.categoryName || 'Transaction'}</p>
                                    <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                                </div>
                                <span className={`font-semibold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                    {transaction.type === 'INCOME' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                </span>
                            </div>
                        ))}
                        {transactions.length === 0 && (
                            <p className="text-center text-gray-500 py-8">No transactions yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Accounts */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Your Accounts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {accounts.map((account) => (
                        <div key={account.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{account.type}</span>
                                <Wallet className="w-4 h-4 text-gray-400" />
                            </div>
                            <p className="font-semibold">{account.name}</p>
                            <p className="text-xl font-bold mt-2">${account.balance.toFixed(2)}</p>
                        </div>
                    ))}
                    {accounts.length === 0 && (
                        <p className="text-gray-500 col-span-full text-center py-8">No accounts yet. Create one to get started!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
