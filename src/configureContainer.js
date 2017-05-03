import { createContainer, asFunction, asValue } from 'awilix';
import { getMongoClient } from './db/mongoDbContext';
import { getQueueClient } from './db/queueContext';
import countriesService from './services/countries';
import countriesRepository from './repository/countries';
import citiesRepository from './repository/city';
import citiesService from './services/cities';
import queueRepository from './repository/queue';
import { addNewCountryJob } from './worker/jobs';
import getLogger from './log';

export default function configureContainer (config) {
  return new Promise(async (resolve) => {
    const container = createContainer();

    const mongoContext = await getMongoClient(config.env);
    const queueContext = getQueueClient(config.env);
    const logger = getLogger(config);
    // Ordering does not matter.
    container.register({
      // Notice the scoped() at the end - this signals
      // Awilix that we are gonna want a new instance per "scope"
      countriesService: asFunction(countriesService).scoped(),
      citiesService: asFunction(citiesService).scoped(),

      // We only want a single instance of this
      // for the apps lifetime (it does not deal with user context),
      // so we can reuse it!
      countriesRepository: asFunction(countriesRepository).singleton(),

      citiesRepository: asFunction(citiesRepository).singleton(),

      queueRepository: asFunction(queueRepository).singleton(),
      addNewCountryJob: asFunction(addNewCountryJob).singleton(),

      mongoContext: asValue(mongoContext),
      queueContext: asValue(queueContext),
      logger: asValue(logger),
    });

    resolve(container);
  });
}
