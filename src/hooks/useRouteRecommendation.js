import { useState, useEffect } from 'react';
import { getDestinationsByCorridor } from '../services/destinationService';

export function useRouteRecommendation(corridorId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!corridorId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    getDestinationsByCorridor(corridorId)
      .then(res => {
        // Urutkan berdasarkan jarak dari rute secara dummy
        const sorted = res.sort((a, b) => a.distanceFromRouteKm - b.distanceFromRouteKm);
        setData(sorted);
        setError(null);
      })
      .catch(err => {
        console.error("Error fetching route recommendations:", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [corridorId]);

  return { data, loading, error };
}
