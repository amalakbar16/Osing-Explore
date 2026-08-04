import { useState, useEffect } from 'react';
import { getLodgingByCorridor, getAllLodging } from '../services/lodgingService';

export function useLodgingByRoute(corridorId) {
  const [data, setData] = useState([]);
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
