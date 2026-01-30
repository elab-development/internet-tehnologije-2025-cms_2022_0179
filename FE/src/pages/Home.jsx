import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sitesAPI } from '../utils/api';

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
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Sites</h1>

      {sites.length === 0 ? (
        <p className="text-gray-600">No sites yet. Be the first to create one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <Link
              key={site.id}
              to={`/sites/${site.slug}`}
              className="border rounded-lg p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold mb-2">{site.name}</h2>
              <p className="text-gray-600 text-sm mb-2">
                Template: {site.template}
              </p>
              <p className="text-gray-500 text-sm">
                By {site.owner_name || 'Unknown'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;