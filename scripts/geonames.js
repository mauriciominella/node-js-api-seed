// Script based on: https://bl.ocks.org/mpmckenna8/10899328

const fs = require('fs');
// const mongoClient = require('mongodb').MongoClient;
// const config = require('../config');

const filename = process.argv[2];
if (!filename) {
  console.log('File not found'); // eslint-disable-line
  process.exit(1);
}

// function getMongoConnection (configuration) {
//   const uriConnection = `mongodb://${configuration.mongo.host}:${configuration.mongo.port}/${configuration.mongo.database}`;
//   const mongoConnection = mongoClient.connect(uriConnection);
//
//   return mongoConnection;
// }

function converRawDataToJson (rawData) {
  const data = rawData.split('\t');
  const population = Number(data[14]);
  const names = data[3].split(',');

  const cityRecord = {
    _id: Number(data[0]),
    name: data[1],
    alternate_names: names.map((name) => {
      return name.toLowerCase();
    }),
    coordinates: [Number(data[4]), Number(data[5])],
    population: population, // eslint-disable-line
  };

  return cityRecord;
}

const cities = fs.readFileSync(filename).toString().split('\n');
cities.pop(); // empty element
const processedCities = cities.reduce((citiesWithPopulation, city) => {
  const cityRecord = converRawDataToJson(city);

  if (cityRecord.population <= 0) {
    return citiesWithPopulation;
  }

  citiesWithPopulation.push(cityRecord);

  return citiesWithPopulation;
}, []);

fs.writeFileSync('./data/cities.json', JSON.stringify(processedCities));
