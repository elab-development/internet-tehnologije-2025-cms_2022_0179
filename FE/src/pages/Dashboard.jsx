import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sitesAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

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
            // Filter to show only user's sites
            const userSites = data.filter(site => site.owner_id === user.id);
            setSites(userSites);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading your sites..." />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">My Sites</h1>
                    <p className="text-gray-600 mt-1">Welcome back, {user.username}!</p>
                </div>
                <Link
                    to="/sites/new"
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                >
                    + Create New Site
                </Link>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            {sites.length === 0 ? (
                <EmptyState
                    icon="🌐"
                    title="No sites yet"
                    message="Create your first site to get started with building your online presence."
                    actionText="Create Your First Site"
                    actionLink="/sites/new"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sites.map((site) => (
                        <div
                            key={site.id}
                            className="border rounded-lg p-6 bg-white hover:shadow-lg transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h2 className="text-xl font-bold">{site.name}</h2>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {site.template}
                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                Created {new Date(site.created_at).toLocaleDateString()}
                            </p>
                            <div className="flex gap-3 flex-wrap">
                                <Link
                                    to={`/sites/${site.id}/pages`}
                                    className="text-blue-500 hover:underline text-sm font-medium"
                                >
                                    Manage Pages
                                </Link>
                                <span className="text-gray-300">•</span>
                                <Link
                                    to={`/sites/${site.slug}`}
                                    className="text-blue-500 hover:underline text-sm font-medium"
                                >
                                    View Site
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;