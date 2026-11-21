// "19 Nov 2026, 17:44" style date for photos and comments
export function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// "Momen Kamal" from a populated user object (safe if the user is missing)
export function fullName(user) {
  if (!user || typeof user !== 'object') return 'Unknown';
  return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown';
}
