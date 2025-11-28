import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, Tag, TrendingUp, PieChart, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Sidebar() {
    const location = useLocation();
    const { logout, user } = useAuthStore();

    const navItems = [
        { path: '/', icon: Home, label: 'Dashboard' },
        { path: '/accounts', icon: CreditCard, label: 'Accounts' },
        { path: '/transactions', icon: TrendingUp, label: 'Transactions' },
        { path: '/budgets', icon: Tag, label: 'Budgets' },
        { path: '/analytics', icon: PieChart, label: 'Analytics' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-primary-600">Budget Planner</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user?.fullName}</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
