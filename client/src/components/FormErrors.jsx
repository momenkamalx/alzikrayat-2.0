// Shows a red box with a list of error messages (renders nothing if empty)
export default function FormErrors({ errors }) {
  if (!errors || errors.length === 0) return null;
  return (
    <ul className="form-errors" role="alert">
      {errors.map((msg, i) => (
        <li key={i}>{msg}</li>
      ))}
    </ul>
  );
}
