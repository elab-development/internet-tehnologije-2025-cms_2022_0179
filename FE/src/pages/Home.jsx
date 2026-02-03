import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sitesAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

function Home() {
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSites();
    }, []);

    const loadSites = async () => {
        try {
            const data = await sitesAPI.getAll();
            setSites(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading sites..." />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4">Explore Sites</h1>
                <p className="text-xl text-gray-600">
                    Discover websites created by our community
                </p>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            {sites.length === 0 ? (
                <EmptyState
                    icon="🌍"
                    title="No sites yet"
                    message="Be the first to create a site and share your story with the world!"
                    actionText="Create Your First Site"
                    actionLink="/register"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sites.map((site) => (
                        <Link
                            key={site.id}
                            to={`/sites/${site.slug}`}
                            className="block border rounded-lg p-6 bg-white hover:shadow-xl transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h2 className="text-xl font-bold">{site.name}</h2>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {site.template}
                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">
                                By {site.owner_name || 'Anonymous'}
                            </p>
                            <p className="text-gray-500 text-sm">
                                Created {new Date(site.created_at).toLocaleDateString()}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;