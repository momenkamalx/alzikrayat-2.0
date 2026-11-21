import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../home.css';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <section className="hero">
        <h1>Alzikrayat</h1>
        <p className="hero-tagline">Share your memories</p>
        <p>
          Alzikrayat is a place to keep your photos and share them with friends
          Upload a picture and tell the story about it
        </p>
        <div className="hero-actions">
          <Link to="/gallery" className="btn">Browse the gallery</Link>
          {user ? (
            <Link to="/upload" className="btn btn-outline">Add a photo</Link>
          ) : (
            <Link to="/login" className="btn btn-outline">Login / Register</Link>
          )}
        </div>
      </section>
    </div>
  );
}
