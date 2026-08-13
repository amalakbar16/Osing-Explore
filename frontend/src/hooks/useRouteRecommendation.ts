import { useState, useEffect } from 'react';
import { getDestinationsByCorridor } from '../services/destinationService';
import type { Destination } from '../types';

export function useRouteRecommendation(corridorId: string | null | undefined) {
  const [data, setData] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!corridorId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    getDestinationsByCorridor(corridorId)
      .then(res => {
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
