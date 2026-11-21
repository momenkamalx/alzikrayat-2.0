import { formatDate, fullName } from '../format';

// Props: comments -> array of comments from the API (oldest first)
export default function CommentList({ comments }) {
  if (comments.length === 0) {
    return <p className="status">No comments yet. Be the first!</p>;
  }

  return (
    <ul className="comment-list">
      {comments.map((c) => (
        <li key={c._id} className="comment">
          <div className="comment-head">
            <strong>{fullName(c.userId)}</strong>
            <span className="comment-date">{formatDate(c.dateTime)}</span>
          </div>
          <p className="comment-text">{c.comment}</p>
        </li>
      ))}
    </ul>
  );
}
