import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pagesAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

function EditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        page_type: 'post',
        status: 'draft'
    });
    const [showPreview, setShowPreview] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadPage();
    }, [id]);

    const loadPage = async () => {
        try {
            const page = await pagesAPI.getById(id);
            setFormData({
                title: page.title,
                slug: page.slug,
                content: page.content || '',
                page_type: page.page_type || 'post',
                status: page.status || 'draft'
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            await pagesAPI.update(id, formData);
            setSuccess('✓ Changes saved successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        setError('');
        setSuccess('');

        try {
            await pagesAPI.publish(id);
            setFormData({ ...formData, status: 'published' });
            setSuccess('✓ Page published successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUnpublish = async () => {
        setError('');
        setSuccess('');

        try {
            await pagesAPI.update(id, { ...formData, status: 'draft' });
            setFormData({ ...formData, status: 'draft' });
            setSuccess('✓ Page unpublished successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading page..." />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Edit Page</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
                    >
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                    {formData.status === 'draft' ? (
                        <button
                            onClick={handlePublish}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                            Publish
                        </button>
                    ) : (
                        <button
                            onClick={handleUnpublish}
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                        >
                            Unpublish
                        </button>
                    )}
                </div>
            </div>

            <SuccessMessage message={success} onClose={() => setSuccess('')} />
            <ErrorMessage message={error} onClose={() => setError('')} />

            <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
                {/* Editor */}
                <div>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Page Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
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
                            <label className="block text-sm font-medium mb-1">
                                Content (HTML)
                                <span className={`ml-2 text-xs px-2 py-1 rounded ${
                                    formData.status === 'published'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                }`}>
                  {formData.status}
                </span>
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows="20"
                                placeholder="<h1>Your content here</h1><p>Write HTML...</p>"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition"
                            >
                                {saving ? 'Saving...' : '💾 Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300 transition"
                            >
                                ← Back
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preview */}
                {showPreview && (
                    <div className="border rounded-lg p-6 bg-white sticky top-4" style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
                        <h2 className="text-lg font-bold mb-4 text-gray-700 border-b pb-2">
                            Live Preview
                        </h2>
                        <div className="border-t pt-4">
                            <h1 className="text-3xl font-bold mb-4">{formData.title || 'Untitled'}</h1>
                            {formData.content ? (
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: formData.content }}
                                />
                            ) : (
                                <p className="text-gray-400 italic">No content yet. Start writing to see preview.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditPage;