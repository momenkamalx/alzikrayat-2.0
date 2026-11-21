import { useEffect } from 'react';

// Sets the browser tab title, e.g. usePageTitle('Gallery') -> "Gallery | Alzikrayat"
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Alzikrayat` : 'Alzikrayat';
  }, [title]);
}
