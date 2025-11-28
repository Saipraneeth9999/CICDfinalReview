import { useEffect, useState } from 'react';
import api from '../api/client';
import { Transaction, Account, Category } from '../types';
import toast from 'react-hot-toast';
import { Plus, Trash2, Filter } from 'lucide-react';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        accountId: '',
        categoryId: '',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'EXPENSE' as Transaction['type'],
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [transRes, accRes, catRes] = await Promise.all([
                api.get('/transactions?size=50'),
                api.get('/accounts'),
                api.get('/categories'),
            ]);
            setTransactions(transRes.data.content || []);
            setAccounts(accRes.data);
            setCategories(catRes.data);
        } catch (error) {
            toast.error('Failed to load data');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/transactions', formData);
            toast.success('Transaction created successfully');
            setShowForm(false);
            setFormData({
                accountId: '',
                categoryId: '',
                amount: 0,
                description: '',
                date: new Date().toISOString().split('T')[0],
                type: 'EXPENSE',
            });
            loadData();
        } catch (error) {
            toast.error('Failed to create transaction');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;

        try {
            await api.delete(`/transactions/${id}`);
            toast.success('Transaction deleted');
            loadData();
        } catch (error) {
            toast.error('Failed to delete transaction');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                    <Plus className="w-5 h-5 inline mr-2" />
                    Add Transaction
                </button>
            </div>

            {showForm && (
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Create New Transaction</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Transaction['type'] })}
                                    className="input-field"
                                >
                                    <option value="INCOME">Income</option>
                                    <option value="EXPENSE">Expense</option>
                                    <option value="TRANSFER">Transfer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Account</label>
                                <select
                                    value={formData.accountId}
                                    onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                                    className="input-field"
                                    required
                                >
                                    <option value="">Select Account</option>
                                    {accounts.map((acc) => (
                                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="">Select Category</option>
                                    {categories
                                        .filter(cat => cat.type === formData.type || formData.type === 'TRANSFER')
                                        .map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-field"
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button type="submit" className="btn-primary">Create Transaction</button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 font-semibold">Date</th>
                                <th className="text-left py-3 px-4 font-semibold">Description</th>
                                <th className="text-left py-3 px-4 font-semibold">Category</th>
                                <th className="text-left py-3 px-4 font-semibold">Account</th>
                                <th className="text-right py-3 px-4 font-semibold">Amount</th>
                                <th className="text-right py-3 px-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="py-3 px-4">{new Date(transaction.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">{transaction.description || '-'}</td>
                                    <td className="py-3 px-4">
                                        {transaction.categoryName && (
                                            <span className="inline-flex items-center gap-1">
                                                {transaction.categoryColor && (
                                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: transaction.categoryColor }}></span>
                                                )}
                                                {transaction.categoryName}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">{transaction.accountName}</td>
                                    <td className={`py-3 px-4 text-right font-semibold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {transaction.type === 'INCOME' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button
                                            onClick={() => handleDelete(transaction.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {transactions.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No transactions yet. Create your first transaction!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
