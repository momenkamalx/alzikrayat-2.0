import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { getErrors } from '../errors';
import { formatDate, fullName } from '../format';
import socket from '../socket';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import '../detail.css';

export default function PhotoDetail() {
  const { id } = useParams(); // the :id from /photos/:id
  const { user } = useAuth();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [live, setLive] = useState(socket.connected); // is the real-time link up?

  // load the photo + its comments whenever the id in the address changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    setPhoto(null);

    api
      .get(`/photos/${id}`)
      .then((res) => {
        if (cancelled) return;
        setPhoto(res.data.photo);
        setComments(res.data.comments);
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
  }, [id]);

  // Real-time: join this photo's room and listen for new comments
  useEffect(() => {
    socket.connect(); // does nothing if already connected

    const join = () => socket.emit('photo:join', id);

    const handleConnect = () => {
      setLive(true);
      join(); // (re)join after every connect, because rooms are lost on reconnect
    };
    const handleDisconnect = () => setLive(false);

    const handleNewComment = (comment) => {
      if (String(comment.photoId) !== String(id)) return; // not for this photo
      // add it unless we already have it (the poster gets it from REST too)
      setComments((prev) => (prev.some((c) => c._id === comment._id) ? prev : [...prev, comment]));
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('comment:new', handleNewComment);
    if (socket.connected) join();

    // cleanup when leaving the page (or opening another photo)
    return () => {
      socket.emit('photo:leave', id);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('comment:new', handleNewComment);
    };
  }, [id]);

  // only the owner sees the Delete button (the server checks again)
  const isOwner = Boolean(user && photo && String(photo.userId?._id) === String(user.id));

  const handleDelete = async () => {
    if (!window.confirm('Delete this photo and its comments?')) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await api.delete(`/photos/${id}`);
      navigate('/gallery');
    } catch (err) {
      setDeleteError(getErrors(err)[0]);
      setDeleting(false);
    }
  };

  // new comment from CommentForm -> add to the end of the list
  const handleCommentAdded = (comment) =>
    setComments((prev) => (prev.some((c) => c._id === comment._id) ? prev : [...prev, comment]));

  if (loading) return <p className="status">Loading photo...</p>;

  if (error) {
    return (
      <div className="status status-error" role="alert">
        <p>{error}</p>
        <Link to="/gallery">Back to the gallery</Link>
      </div>
    );
  }

  return (
    <article className="detail">
      <Link to="/gallery" className="back-link">&larr; Back to gallery</Link>

      <div className="detail-main">
        <img className="detail-image" src={`/uploads/${photo.fileName}`} alt={photo.title} />

        <div className="detail-info">
          <h1>{photo.title}</h1>
          <p className="photo-meta">
            by {fullName(photo.userId)} &middot; {formatDate(photo.dateTime)}
          </p>
          {photo.description && <p className="detail-desc">{photo.description}</p>}

          {isOwner && (
            <div>
              <button type="button" className="btn btn-danger btn-small" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete photo'}
              </button>
              {deleteError && <p className="inline-error" role="alert">{deleteError}</p>}
            </div>
          )}
        </div>
      </div>

      <section className="comments">
        <h2>
          Comments ({comments.length}){' '}
          <span className={live ? 'live-badge live-on' : 'live-badge'}>
            {live ? '● Live' : '○ Offline'}
          </span>
        </h2>
        <CommentList comments={comments} />

        {user ? (
          <CommentForm photoId={photo._id} onAdded={handleCommentAdded} />
        ) : (
          <p className="status">
            <Link to="/login">Please login</Link> to leave a comment.
          </p>
        )}
      </section>
    </article>
  );
}
