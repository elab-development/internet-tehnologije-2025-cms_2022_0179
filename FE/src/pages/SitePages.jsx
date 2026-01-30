import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sitesAPI, pagesAPI } from '../utils/api';

function SitePages({ user }) {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    if (!window.confirm('Are you sure you want to delete this site? This cannot be undone.')) {
      return;
    }

    try {
      await sitesAPI.delete(siteId);
      navigate('/dashboard');
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
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">Manage Pages</h1>
            <p className="text-gray-600 mt-1">Site ID: {siteId}</p>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/pages/new?siteId=${siteId}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create New Page
            </Link>
            <button
              onClick={handleDeleteSite}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Site
            </button>
          </div>
        </div>
        <Link to="/dashboard" className="text-blue-500 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {pages.length === 0 ? (
        <div className="text-center text-gray-600 mt-20">
          <p className="mb-4">No pages yet.</p>
          <Link
            to={`/pages/new?siteId=${siteId}`}
            className="text-blue-500 hover:underline"
          >
            Create your first page
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pages.map((page) => (
            <div key={page.id} className="border rounded-lg p-6 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-1">{page.title}</h2>
                  <p className="text-gray-600 text-sm mb-2">
                    Slug: {page.slug}
                  </p>
                  <div className="flex gap-2 items-center">
                    <span className={`text-sm px-2 py-1 rounded ${
                      page.status === 'published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {page.status}
                    </span>
                    {page.page_type && (
                      <span className="text-sm text-gray-500">
                        Type: {page.page_type}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/pages/${page.id}/edit`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeletePage(page.id)}
                    className="text-red-500 hover:underline text-sm"
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