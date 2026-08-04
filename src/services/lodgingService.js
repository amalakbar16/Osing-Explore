import lodgingData from '../data/lodging.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function getLodgingByCorridor(corridorId) {
  await delay(300);
  return lodgingData.filter(l => l.corridorIds.includes(corridorId));
}

export async function getAllLodging() {
  await delay(300);
  return lodgingData;
}

export async function getLodgingById(id) {
  await delay(200);
  return lodgingData.find(l => l.id === id);
}
