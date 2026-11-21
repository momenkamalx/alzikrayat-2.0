import { Link } from 'react-router-dom';
import { formatDate, fullName } from '../format';
import '../gallery.css';

// Props:
//   photo -> one photo object from the API
//   view  -> 'grid' or 'list' (changes the layout through CSS)
export default function PhotoCard({ photo, view = 'grid' }) {
  return (
    <article className={`photo-card photo-card-${view}`}>
      <Link to={`/photos/${photo._id}`} className="photo-thumb">
        <img src={`/uploads/${photo.fileName}`} alt={photo.title} loading="lazy" />
      </Link>

      <div className="photo-info">
        <h3>
          <Link to={`/photos/${photo._id}`}>{photo.title}</Link>
        </h3>
        {view === 'list' && photo.description && (
          <p className="photo-desc">{photo.description}</p>
        )}
        <p className="photo-meta">
          by {fullName(photo.userId)} &middot; {formatDate(photo.dateTime)}
        </p>
      </div>
    </article>
  );
}
