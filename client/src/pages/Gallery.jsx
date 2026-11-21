import { useEffect, useState } from 'react';
import api from '../api';
import { getErrors } from '../errors';
import PhotoCard from '../components/PhotoCard';
import usePageTitle from '../usePageTitle';
import '../gallery.css';

// remember the chosen layout between visits
const readView = () => {
  try {
    return localStorage.getItem('galleryView') === 'list' ? 'list' : 'grid';
  } catch {
    return 'grid';
  }
};

export default function Gallery() {
  usePageTitle('Gallery');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState(readView);
  const [reloadKey, setReloadKey] = useState(0); // bump to fetch again

  // fetch photos when the page opens (and again on Retry)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    api
      .get('/photos')
      .then((res) => {
        if (!cancelled) setPhotos(res.data.photos);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrors(err)[0]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const changeView = (next) => {
    setView(next);
    try {
      localStorage.setItem('galleryView', next);
    } catch {
      /* storage unavailable: ignore */
    }
  };

  return (
    <section>
      <div className="gallery-header">
        <h1>Gallery</h1>
        <div className="view-toggle" role="group" aria-label="Display style">
          <button
            type="button"
            className={view === 'grid' ? 'active' : ''}
            aria-pressed={view === 'grid'}
            onClick={() => changeView('grid')}
          >
            Grid
          </button>
          <button
            type="button"
            className={view === 'list' ? 'active' : ''}
            aria-pressed={view === 'list'}
            onClick={() => changeView('list')}
          >
            List
          </button>
        </div>
      </div>

      {loading && <p className="status">Loading photos...</p>}

      {error && (
        <div className="status status-error" role="alert">
          <p>{error}</p>
          <button type="button" className="btn btn-small" onClick={() => setReloadKey((k) => k + 1)}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && photos.length === 0 && (
        <p className="status">No photos yet. Log in and be the first to add one!</p>
      )}

      {!loading && !error && photos.length > 0 && (
        <>
          <p className="photo-count">{photos.length} {photos.length === 1 ? 'photo' : 'photos'}</p>
          <div className={view === 'grid' ? 'photo-grid' : 'photo-list'}>
            {photos.map((photo) => (
              <PhotoCard key={photo._id} photo={photo} view={view} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
