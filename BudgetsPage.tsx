import { useEffect, useState } from 'react';
import api from '../api/client';
import { Budget, Category } from '../types';
import toast from 'react-hot-toast';
import { Plus, Target } from 'lucide-react';

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        totalAmount: 0,
        currency: 'USD',
        items: [] as { categoryId: string; amount: number }[],
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [budgetsRes, categoriesRes] = await Promise.all([
                api.get('/budgets'),
                api.get('/categories'),
            ]);
            setBudgets(budgetsRes.data);
            setCategories(categoriesRes.data.filter((c: Category) => c.type === 'EXPENSE'));
        } catch (error) {
            toast.error('Failed to load budgets');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/budgets', formData);
            toast.success('Budget created successfully');
            setShowForm(false);
            setFormData({
                name: '',
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                totalAmount: 0,
                currency: 'USD',
                items: [],
            });
            loadData();
        } catch (error) {
            toast.error('Failed to create budget');
        }
    };

    const addBudgetItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { categoryId: '', amount: 0 }],
        });
    };

    const updateBudgetItem = (index: number, field: string, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, items: newItems });
    };

    const removeBudgetItem = (index: number) => {
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Budgets</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                    <Plus className="w-5 h-5 inline mr-2" />
                    Create Budget
                </button>
            </div>

            {showForm && (
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Create New Budget</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Budget Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                    required
                                    placeholder="Monthly Budget"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Month</label>
                                <select
                                    value={formData.month}
                                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                                    className="input-field"
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Year</label>
                                <input
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium">Budget Items</label>
                                <button type="button" onClick={addBudgetItem} className="text-sm text-primary-600 hover:text-primary-700">
                                    + Add Category
                                </button>
                            </div>

                            {formData.items.map((item, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <select
                                        value={item.categoryId}
                                        onChange={(e) => updateBudgetItem(index, 'categoryId', e.target.value)}
                                        className="input-field flex-1"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={item.amount}
                                        onChange={(e) => updateBudgetItem(index, 'amount', parseFloat(e.target.value))}
                                        className="input-field w-32"
                                        placeholder="Amount"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeBudgetItem(index)}
                                        className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <button type="submit" className="btn-primary">Create Budget</button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {budgets.map((budget) => (
                    <div key={budget.id} className="card">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">{budget.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(budget.year, budget.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Budget</p>
                                <p className="text-xl font-bold">${budget.totalAmount.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {budget.items.map((item) => {
                                const percentage = (item.spent / item.amount) * 100;
                                const isOverBudget = percentage > 100;

                                return (
                                    <div key={item.id} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">{item.categoryName}</span>
                                            <span className={isOverBudget ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}>
                                                ${item.spent.toFixed(2)} / ${item.amount.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${isOverBudget ? 'bg-red-600' : 'bg-primary-600'
                                                    }`}
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {budgets.length === 0 && !showForm && (
                <div className="card text-center py-12">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No budgets yet. Create your first budget to track spending!</p>
                </div>
            )}
        </div>
    );
}
