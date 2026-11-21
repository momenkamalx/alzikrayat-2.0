import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { getErrors } from '../errors';
import FormErrors from '../components/FormErrors';
import '../forms.css';
import '../detail.css';

const MAX_SIZE = 8 * 1024 * 1024; // 8MB, same limit as the server
const TYPES = ['image/jpeg', 'image/png'];

export default function Upload() {
  const { user, checking } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  // make a small preview of the chosen file, and clean it up afterwards
  useEffect(() => {
    if (!file) {
      setPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (checking) return <p>Checking session...</p>;
  if (!user) return <Navigate to="/login" replace />; // only logged-in users can upload

  const handleFile = (e) => setFile(e.target.files[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problems = [];
    if (!file) problems.push('Please choose a photo');
    else if (!TYPES.includes(file.type)) problems.push('Only JPEG or PNG files are allowed');
    else if (file.size > MAX_SIZE) problems.push('File must be under 8MB');
    if (!title.trim()) problems.push('Title is required');
    if (problems.length) {
      setErrors(problems);
      return;
    }

    setErrors([]);
    setLoading(true);

    // files must be sent as FormData (multipart), not JSON
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const res = await api.post('/photos', formData);
      navigate(`/photos/${res.data.photo._id}`);
    } catch (err) {
      setErrors(getErrors(err));
      setLoading(false);
    }
  };

  return (
    <div className="auth-card upload-card">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Add a photo</h2>
        <FormErrors errors={errors} />

        <label htmlFor="up-file">Photo (JPEG or PNG, max 8MB)</label>
        <input id="up-file" type="file" accept="image/jpeg,image/png" onChange={handleFile} />
        {preview && <img className="upload-preview" src={preview} alt="Preview" />}

        <label htmlFor="up-title">Title</label>
        <input id="up-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />

        <label htmlFor="up-desc">Description (optional)</label>
        <textarea id="up-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} />

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}
