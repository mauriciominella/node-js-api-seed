import { BadRequestError, NotFoundError } from 'meaning-error';
import validator from 'validator';

export default function population ({ citiesRepository }) {
  return {
    compute: compute.bind(this, { citiesRepository }),
  };
}

async function compute ({ citiesRepository }, { cityName, radiusInKm }) {
  if (!cityName || cityName.length === 0) {
    throw new BadRequestError(`Invalid value for cityName: ${cityName}`);
  }

  if (!radiusInKm || !validator.isNumeric(radiusInKm)) {
    throw new BadRequestError(`Invalid value for radiusInKm: ${cityName}`);
  }

  const searchedCity = await citiesRepository.findCityByName(cityName);

  if (!searchedCity) {
    throw new NotFoundError(`Invalid city name: ${cityName}`);
  }

  const nearestCities = await citiesRepository.findNearestCities(searchedCity.coordinates, radiusInKm);
  const populationSum = sumPopulation(nearestCities);
  return { cityName, radiusInKm, population: populationSum, numberOfCities: nearestCities.length };
}


function sumPopulation (cities) {
  return cities.reduce((totalPopulation, city) => {
    return totalPopulation + city.population;
  }, 0);
}
