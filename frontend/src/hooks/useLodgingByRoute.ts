import { useState, useEffect } from 'react';
import { getLodgingByCorridor, getAllLodging } from '../services/lodgingService';
import type { Lodging } from '../types';

export function useLodgingByRoute(corridorId: string | null | undefined) {
  const [data, setData] = useState<Lodging[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (corridorId) {
      getLodgingByCorridor(corridorId).then(res => {
        setData(res.sort((a, b) => a.distanceFromRouteKm - b.distanceFromRouteKm));
        setLoading(false);
      });
    } else {
      getAllLodging().then(res => {
        setData(res);
        setLoading(false);
      });
    }
  }, [corridorId]);

  return { data, loading };
}
