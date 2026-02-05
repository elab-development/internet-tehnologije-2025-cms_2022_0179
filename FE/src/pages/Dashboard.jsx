import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sitesAPI } from '../utils/api';

function Dashboard({ user }) {
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSites();
    }, []);

    const loadSites = async () => {
        try {
            const data = await sitesAPI.getAll();
            const userSites = data.filter(site => site.owner_id === user.id);
            setSites(userSites);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">Loading your sites...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">My Sites</h1>
                            <p className="text-gray-600 mt-2">Welcome back, <span className="font-semibold">{user.username}</span>! 👋</p>
                        </div>
                        <Link
                            to="/sites/new"
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                        >
                            + Create New Site
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {sites.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-7xl mb-6">🌐</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No sites yet</h3>
                        <p className="text-gray-600 mb-6">Create your first site to get started!</p>
                        <Link
                            to="/sites/new"
                            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
                        >
                            Create Your First Site
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sites.map((site) => (
                            <div
                                key={site.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
                            >
                                {/* Colored header */}
                                <div className={`h-32 ${
                                    site.template === 'blog'
                                        ? 'bg-gradient-to-br from-green-400 to-blue-500'
                                        : 'bg-gradient-to-br from-purple-400 to-pink-500'
                                } relative`}>
                                    <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                      {site.template}
                    </span>
                                    </div>
                                </div>

                                {/* Card content */}
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                                        {site.name}
                                    </h2>
                                    <p className="text-gray-500 text-sm mb-4">
                                        Created {new Date(site.created_at).toLocaleDateString()}
                                    </p>

                                    {/* Action buttons */}
                                    <div className="flex gap-3">
                                        <Link
                                            to={`/sites/${site.id}/pages`}
                                            className="flex-1 text-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition font-medium text-sm"
                                        >
                                            Manage Pages
                                        </Link>
                                        <Link
                                            to={`/sites/${site.slug}`}
                                            className="flex-1 text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                                        >
                                            View Site
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;