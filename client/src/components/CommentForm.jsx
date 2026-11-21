import { useState } from 'react';
import api from '../api';
import { getErrors } from '../errors';
import FormErrors from './FormErrors';

const MAX = 500;

// Props:
//   photoId  -> which photo this comment belongs to
//   onAdded  -> function called with the new comment (parent adds it to the list)
export default function CommentForm({ photoId, onAdded }) {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (!text.trim()) {
      setErrors(['Please write a comment first']);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/photos/${photoId}/comments`, { comment: text });
      onAdded(res.data.comment); // shows up immediately, no page reload
      setText('');
    } catch (err) {
      setErrors(getErrors(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <FormErrors errors={errors} />
      <label htmlFor="comment-text">Add a comment</label>
      <textarea
        id="comment-text"
        rows={3}
        maxLength={MAX}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write something nice..."
      />
      <div className="comment-form-footer">
        <span className="char-count">{text.length}/{MAX}</span>
        <button type="submit" className="btn btn-small" disabled={loading}>
          {loading ? 'Posting...' : 'Post comment'}
        </button>
      </div>
    </form>
  );
}
