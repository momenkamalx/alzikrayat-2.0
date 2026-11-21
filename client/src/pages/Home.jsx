import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../usePageTitle';
import '../home.css';

export default function Home() {
  const { user } = useAuth();
  usePageTitle('Home');

  return (
    <div>
      <section className="hero">
        <h1>Alzikrayat</h1>
        <p className="hero-tagline">Share your memories</p>
        <p>
          Alzikrayat is a place to keep your photos and share it with friends
          
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
