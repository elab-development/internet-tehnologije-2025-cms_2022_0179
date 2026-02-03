import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pagesAPI } from '../utils/api';

function CreatePage() {
    const [searchParams] = useSearchParams();
    const siteId = searchParams.get('siteId');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        site_id: siteId,
        title: '',
        slug: '',
        content: '',
        page_type: 'post',
        status: 'draft'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!siteId) {
            setError('Site ID is required');
        }
    }, [siteId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'title') {
            const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await pagesAPI.create(formData);
            navigate(`/sites/${siteId}/pages`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!siteId) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error: Site ID is missing
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Create New Page</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Page Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="About Us"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">URL Slug</label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                        placeholder="about-us"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Page Type</label>
                    <select
                        name="page_type"
                        value={formData.page_type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="post">Post</option>
                        <option value="home">Home</option>
                        <option value="about">About</option>
                        <option value="contact">Contact</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Content (HTML)</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows="15"
                        placeholder="<h1>Welcome</h1><p>Your content here...</p>"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Write HTML directly. You can add tags like &lt;h1&gt;, &lt;p&gt;, &lt;img&gt;, etc.
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? 'Creating...' : 'Create Page'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/sites/${siteId}/pages`)}
                        className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreatePage;