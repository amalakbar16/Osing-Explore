import { useState, useEffect } from 'react';
import { getCulinaryByCorridor, getAllCulinary } from '../services/culinaryService';
import type { Culinary } from '../types';

export function useCulinaryByRoute(corridorId: string | null | undefined) {
  const [data, setData] = useState<Culinary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (corridorId) {
      getCulinaryByCorridor(corridorId).then(res => {
        setData(res.sort((a, b) => a.distanceFromRouteKm - b.distanceFromRouteKm));
        setLoading(false);
      });
    } else {
      getAllCulinary().then(res => {
        setData(res);
        setLoading(false);
      });
    }
  }, [corridorId]);

  return { data, loading };
}
