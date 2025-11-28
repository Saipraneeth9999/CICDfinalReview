import { useAuthStore } from '../store/authStore';

export default function SettingsPage() {
    const user = useAuthStore((state) => state.user);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Settings</h1>

            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            value={user?.fullName || ''}
                            className="input-field"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            className="input-field"
                            disabled
                        />
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Default Currency</label>
                        <select className="input-field">
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="INR">INR - Indian Rupee</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Language</label>
                        <select className="input-field">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
