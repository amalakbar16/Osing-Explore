const fs = require('fs');

const processFile = (file, prefix) => {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.forEach(item => {
      // Mengubah URL images menjadi format lokal berdasarkan ID
      item.images = [`/images/${prefix}/${item.id}.jpg`];
    });
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Berhasil memodifikasi ${file}`);
  } catch (err) {
    console.error(`Gagal memodifikasi ${file}:`, err);
  }
};

processFile('./src/data/destinations.json', 'destinasi');
processFile('./src/data/culinary.json', 'kuliner');
processFile('./src/data/lodging.json', 'penginapan');
