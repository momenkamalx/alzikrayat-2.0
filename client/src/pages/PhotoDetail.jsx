import { useParams } from 'react-router-dom';

export default function PhotoDetail() {
  const { id } = useParams();
  return <h1>Photo {id} (built in Step 9)</h1>;
}
