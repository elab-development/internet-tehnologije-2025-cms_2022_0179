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
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Sites</h1>
        <Link
          to="/sites/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Site
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {sites.length === 0 ? (
        <div className="text-center text-gray-600 mt-20">
          <p className="mb-4">You don't have any sites yet.</p>
          <Link
            to="/sites/new"
            className="text-blue-500 hover:underline"
          >
            Create your first site
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <div key={site.id} className="border rounded-lg p-6 bg-white hover:shadow-lg transition">
              <h2 className="text-xl font-bold mb-2">{site.name}</h2>
              <p className="text-gray-600 text-sm mb-4">
                Template: {site.template}
              </p>
              <div className="flex gap-2">
                <Link
                  to={`/sites/${site.id}/pages`}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Manage Pages
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to={`/sites/${site.slug}`}
                  className="text-blue-500 hover:underline text-sm"
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