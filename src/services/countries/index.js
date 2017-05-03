import { BadRequestError } from 'meaning-error';

export default function countries ({ logger, countriesRepository, queueRepository, citiesService }) {
  return {
    add: add.bind(this, { logger, countriesRepository, citiesService }),
    addAsync: addAsync.bind(this, { logger, queueRepository }),
    addFromFile: addFromFile.bind(this, { logger, countriesRepository, citiesService }),
  };
}

export async function add ({ logger, countriesRepository, citiesService }, countryCode) {
  if (!countryCode) {
    const error = [{ field: 'countryCode', message: 'Country code cannot be empty' }];
    throw new BadRequestError('input data is not valid', error);
  }

  let bulkWriteResult;
  let totalLines = 0;

  try {
    const parsedFile = await countriesRepository.getFileAndProcess(countryCode, citiesService.convertRawLineToJson);
    totalLines = parsedFile.parsedLines.length;
    bulkWriteResult = await citiesService.addBatch(parsedFile);
    logger.info(`${countryCode} sucessfully processed!`);
  } catch (e) {
    throw new BadRequestError(`error when processing country: ${countryCode}. ${e.message}`);
  }

  return { nInserted: bulkWriteResult.nInserted, totalLines, errors: bulkWriteResult.getWriteErrors() };
}

export async function addFromFile ({ logger, countriesRepository, citiesService }, filePath) {
  if (!filePath) {
    const error = [{ field: 'filePath', message: 'filePath cannot be empty' }];
    throw new BadRequestError('input data is not valid', error);
  }

  let bulkWriteResult;
  let totalLines = 0;

  try {
    const parsedFile = await countriesRepository.unzipAndProcessFile(filePath, citiesService.convertRawLineToJson);
    totalLines = parsedFile.parsedLines.length;
    bulkWriteResult = await citiesService.addBatch(parsedFile);
  } catch (e) {
    throw new BadRequestError(`error when processing country from file: ${filePath}. ${e.message}`);
  }

  return { nInserted: bulkWriteResult.nInserted, totalLines, errors: bulkWriteResult.getWriteErrors() };
}

export async function addAsync ({ logger, queueRepository }, countryCode) {
  if (!countryCode) {
    throw new BadRequestError(`Invalid value for country code: ${countryCode}`);
  }

  let result;

  try {
    const queueMessage = { source: 'code', data: countryCode };
    result = await queueRepository.send('addnewcountry', queueMessage);
  } catch (e) {
    throw new BadRequestError(`error when adding async country: ${countryCode}. ${e.message}`);
  }

  return { messageKey: result };
}
