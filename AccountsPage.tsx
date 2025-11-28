import { useEffect, useState } from 'react';
import api from '../api/client';
import { Account } from '../types';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'CHECKING' as Account['type'],
        currency: 'USD',
        balance: 0,
    });

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            const response = await api.get('/accounts');
            setAccounts(response.data);
        } catch (error) {
            toast.error('Failed to load accounts');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/accounts', formData);
            toast.success('Account created successfully');
            setShowForm(false);
            setFormData({ name: '', type: 'CHECKING', currency: 'USD', balance: 0 });
            loadAccounts();
        } catch (error) {
            toast.error('Failed to create account');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this account?')) return;

        try {
            await api.delete(`/accounts/${id}`);
            toast.success('Account deleted');
            loadAccounts();
        } catch (error) {
            toast.error('Failed to delete account');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Accounts</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                    <Plus className="w-5 h-5 inline mr-2" />
                    Add Account
                </button>
            </div>

            {showForm && (
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Create New Account</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Account Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                    required
                                    placeholder="My Checking Account"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Account Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Account['type'] })}
                                    className="input-field"
                                >
                                    <option value="CHECKING">Checking</option>
                                    <option value="SAVINGS">Savings</option>
                                    <option value="CREDIT">Credit Card</option>
                                    <option value="CASH">Cash</option>
                                    <option value="WALLET">Wallet</option>
                                    <option value="INVESTMENT">Investment</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Currency</label>
                                <input
                                    type="text"
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="input-field"
                                    required
                                    maxLength={3}
                                    placeholder="USD"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Initial Balance</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.balance}
                                    onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button type="submit" className="btn-primary">Create Account</button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                    <div key={account.id} className="card">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{account.type}</span>
                                <h3 className="text-lg font-semibold mt-1">{account.name}</h3>
                            </div>
                            <button
                                onClick={() => handleDelete(account.id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                            <p className="text-2xl font-bold mt-1">
                                {account.currency} {account.balance.toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {accounts.length === 0 && !showForm && (
                <div className="card text-center py-12">
                    <p className="text-gray-500">No accounts yet. Create your first account to get started!</p>
                </div>
            )}
        </div>
    );
}
