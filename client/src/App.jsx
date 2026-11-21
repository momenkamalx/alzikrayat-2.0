import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import PhotoDetail from './pages/PhotoDetail';
import LoginRegister from './pages/LoginRegister';
import Upload from './pages/Upload';
import usePageTitle from './usePageTitle';

function NotFound() {
  usePageTitle('Page not found');
  return (
    <div>
      <h1>Page not found</h1>
      <Link to="/">Go home</Link>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/photos/:id" element={<PhotoDetail />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
