import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sitesAPI, pagesAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import SuccessMessage from '../components/SuccessMessage';

function SitePages({ user }) {
    const { siteId } = useParams();
    const navigate = useNavigate();
    const [site, setSite] = useState(null);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadSiteAndPages();
    }, [siteId]);

    const loadSiteAndPages = async () => {
        try {
            setLoading(true);
            const pagesData = await pagesAPI.getBySite(siteId);
            setPages(pagesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSite = async () => {
        if (!window.confirm('⚠️ Are you sure you want to delete this entire site? This action cannot be undone and will delete all pages.')) {
            return;
        }

        try {
            await sitesAPI.delete(siteId);
            setSuccess('Site deleted successfully!');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeletePage = async (pageId) => {
        if (!window.confirm('Are you sure you want to delete this page?')) {
            return;
        }

        try {
            await pagesAPI.delete(pageId);
            setPages(pages.filter(p => p.id !== pageId));
            setSuccess('Page deleted successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading pages..." />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-3xl font-bold">Manage Pages</h1>
                        <p className="text-gray-600 mt-1">Site ID: {siteId}</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            to={`/pages/new?siteId=${siteId}`}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                            + Create Page
                        </Link>
                        <button
                            onClick={handleDeleteSite}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Delete Site
                        </button>
                    </div>
                </div>
                <Link to="/dashboard" className="text-blue-500 hover:underline">
                    ← Back to Dashboard
                </Link>
            </div>

            <SuccessMessage message={success} onClose={() => setSuccess('')} />
            <ErrorMessage message={error} onClose={() => setError('')} />

            {pages.length === 0 ? (
                <EmptyState
                    icon="📄"
                    title="No pages yet"
                    message="Start building your site by creating your first page."
                    actionText="Create Your First Page"
                    actionLink={`/pages/new?siteId=${siteId}`}
                />
            ) : (
                <div className="space-y-4">
                    {pages.map((page) => (
                        <div key={page.id} className="border rounded-lg p-6 bg-white hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold mb-2">{page.title}</h2>
                                    <p className="text-gray-600 text-sm mb-3">
                                        <span className="font-medium">Slug:</span> {page.slug}
                                    </p>
                                    <div className="flex gap-3 items-center flex-wrap">
                    <span className={`text-sm px-3 py-1 rounded font-medium ${
                        page.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                    }`}>
                      {page.status === 'published' ? '✓ Published' : 'Draft'}
                    </span>
                                        {page.page_type && (
                                            <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        {page.page_type}
                      </span>
                                        )}
                                        <span className="text-sm text-gray-400">
                      Updated {new Date(page.updated_at).toLocaleDateString()}
                    </span>
                                    </div>
                                </div>
                                <div className="flex gap-3 ml-4">
                                    <Link
                                        to={`/pages/${page.id}/edit`}
                                        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDeletePage(page.id)}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SitePages;