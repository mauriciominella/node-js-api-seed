import { InternalServerError } from 'meaning-error';

export default function cities ({ citiesRepository, logger }) {
  return {
    processRawLine: processRawLine.bind(this, { citiesRepository, logger }),
    convertRawLineToJson: convertRawLineToJson.bind(this, { logger }),
    addBatch: addBatch.bind(this, { citiesRepository, logger }),
  };
}

export function processRawLine ({ citiesRepository, logger }, rawLine) {
  const cityRecord = convertRawLineToJson(rawLine);
  return citiesRepository.add(cityRecord)
    .catch((err) => {
      logger.error(err);
    });
}

export async function addBatch ({ citiesRepository, logger }, parsedFile) {
  try {
    const batch = citiesRepository.buildAddBatch();
    parsedFile.parsedLines.forEach((item) => {
      batch.add(item);
    });
    return await batch.execute();
  } catch (err) {
    logger.error(err);
    throw new InternalServerError(err);
  }
}

export function convertRawLineToJson ({ logger }, rawLine) {
  try {
    const data = rawLine.split('\t');
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
  } catch (e) {
    throw new Error(`error converting raw line to json: ${rawLine}`, e);
  }
}
