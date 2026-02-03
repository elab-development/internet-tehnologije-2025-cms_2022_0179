import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sitesAPI, pagesAPI } from '../utils/api';

function PublicSite() {
    const { slug } = useParams();
    const [site, setSite] = useState(null);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSite();
    }, [slug]);

    const loadSite = async () => {
        try {
            const siteData = await sitesAPI.getBySlug(slug);
            setSite(siteData);

            const pagesData = await pagesAPI.getPublished(slug);
            setPages(pagesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center mt-20">Loading...</div>;
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
                <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
                    ← Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Site Header */}
            <div className="mb-12 text-center">
                <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
                    ← Back to Home
                </Link>
                <h1 className="text-5xl font-bold mb-3 mt-4">{site.name}</h1>
                <p className="text-gray-600 text-lg">
                    {site.template === 'blog' ? '📝 Blog' : '💼 Portfolio'}
                </p>
            </div>

            {/* Pages List */}
            {pages.length === 0 ? (
                <div className="text-center text-gray-600 bg-gray-50 rounded-lg p-12">
                    <p className="text-xl">No published pages yet.</p>
                    <p className="mt-2">Check back soon!</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {pages.map((page) => (
                        <article key={page.id} className="border rounded-lg p-6 bg-white hover:shadow-lg transition">
                            <h2 className="text-3xl font-bold mb-3">
                                <Link
                                    to={`/sites/${slug}/${page.slug}`}
                                    className="hover:text-blue-600 transition"
                                >
                                    {page.title}
                                </Link>
                            </h2>

                            <div className="text-gray-600 text-sm mb-4">
                                {new Date(page.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>

                            <div
                                className="prose max-w-none mb-4 line-clamp-3"
                                dangerouslySetInnerHTML={{
                                    __html: page.content ? page.content.substring(0, 200) + '...' : '<p>No content</p>'
                                }}
                            />

                            <Link
                                to={`/sites/${slug}/${page.slug}`}
                                className="text-blue-500 hover:underline font-medium"
                            >
                                Read more →
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PublicSite;