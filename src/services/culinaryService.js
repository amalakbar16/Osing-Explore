import culinaryData from '../data/culinary.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function getCulinaryByCorridor(corridorId) {
  await delay(300);
  return culinaryData.filter(c => c.corridorIds.includes(corridorId));
}

export async function getAllCulinary() {
  await delay(300);
  return culinaryData;
}

export async function getCulinaryById(id) {
  await delay(200);
  return culinaryData.find(c => c.id === id);
}
