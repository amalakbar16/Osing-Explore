import destinationsData from '../data/destinations.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function getMainDestinations() {
  await delay(400);
  return destinationsData.filter(d => d.isMainDestination);
}

export async function getAllDestinations() {
  await delay(300);
  return destinationsData;
}

export async function getDestinationsByCorridor(corridorId) {
  await delay(400);
  return destinationsData.filter(d => d.corridorIds.includes(corridorId));
}

export async function getDestinationById(id) {
  await delay(200);
  return destinationsData.find(d => d.id === id);
}
