import { useEffect, useState } from 'react';
import api from '../api/client';
import { Transaction } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AnalyticsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const response = await api.get('/transactions?size=100');
            setTransactions(response.data.content || []);
        } catch (error) {
            console.error('Failed to load transactions');
        }
    };

    // Monthly trend data
    const monthlyData = transactions.reduce((acc, t) => {
        const month = new Date(t.date).toLocaleString('default', { month: 'short' });
        const existing = acc.find(item => item.month === month);

        if (existing) {
            if (t.type === 'INCOME') existing.income += t.amount;
            if (t.type === 'EXPENSE') existing.expenses += t.amount;
        } else {
            acc.push({
                month,
                income: t.type === 'INCOME' ? t.amount : 0,
                expenses: t.type === 'EXPENSE' ? t.amount : 0,
            });
        }
        return acc;
    }, [] as { month: string; income: number; expenses: number }[]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Analytics</h1>

            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Monthly Income vs Expenses</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="income" fill="#10b981" name="Income" />
                        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Spending Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
