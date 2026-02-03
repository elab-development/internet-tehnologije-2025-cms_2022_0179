import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pagesAPI } from '../utils/api';

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
        setSaving(true);

        try {
            await pagesAPI.update(id, formData);
            alert('Page saved successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        try {
            await pagesAPI.publish(id);
            setFormData({ ...formData, status: 'published' });
            alert('Page published!');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUnpublish = async () => {
        try {
            await pagesAPI.update(id, { ...formData, status: 'draft' });
            setFormData({ ...formData, status: 'draft' });
            alert('Page unpublished!');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div className="text-center mt-20">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Edit Page</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                    {formData.status === 'draft' ? (
                        <button
                            onClick={handlePublish}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Publish
                        </button>
                    ) : (
                        <button
                            onClick={handleUnpublish}
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                            Unpublish
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
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
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300"
                            >
                                Back
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preview */}
                {showPreview && (
                    <div className="border rounded-lg p-6 bg-white">
                        <h2 className="text-2xl font-bold mb-4 text-gray-700">Preview</h2>
                        <div className="border-t pt-4">
                            <h1 className="text-3xl font-bold mb-4">{formData.title}</h1>
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: formData.content }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditPage;