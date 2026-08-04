export function formatDistance(distanceInKm) {
  if (distanceInKm < 1) {
    return `${(distanceInKm * 1000).toFixed(0)} m`;
  }
  return `${distanceInKm.toFixed(1)} km`;
}

export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}mnt`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}j ${mins}m` : `${hours}j`;
}
