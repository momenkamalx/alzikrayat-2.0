import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import PhotoDetail from './pages/PhotoDetail';
import LoginRegister from './pages/LoginRegister';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/photos/:id" element={<PhotoDetail />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route
            path="*"
            element={
              <div>
                <h1>Page not found</h1>
                <Link to="/">Go home</Link>
              </div>
            }
          />
        </Routes>
      </main>
    </>
  );
}
