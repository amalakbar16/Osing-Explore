import routeCorridorsData from '../data/routeCorridors.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function getCorridors() {
  await delay(200);
  return routeCorridorsData;
}

export async function getCorridorById(id) {
  await delay(200);
  return routeCorridorsData.find(c => c.id === id);
}
