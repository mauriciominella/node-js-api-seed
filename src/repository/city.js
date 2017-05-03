export default function city ({ mongoContext, logger }) {
  return {
    findCityByName: findCityByName.bind(this, { mongoContext, logger }),
    findNearestCities: findNearestCities.bind(this, { mongoContext, logger }),
    add: add.bind(this, { mongoContext, logger }),
    buildAddBatch: buildAddBatch.bind(this, { mongoContext, logger }),
  };
}

function findCityByName ({ mongoContext }, name) {
  return new Promise((resolve, reject) => {
    return mongoContext.collection('cities').find({ name })
      .toArray((err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result[0]);
      });
  });
}

function findNearestCities ({ mongoContext }, coordinates, radiusInKm) {
  return new Promise((resolve, reject) => {
    const searchCriteria = buildNearestCitiesSearchCriteria(coordinates, radiusInKm);
    return mongoContext.collection('cities').find(searchCriteria)
      .toArray((err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
  });
}

function buildAddBatch ({ logger, mongoContext }) {
  return new AddBatch({ logger, mongoContext });
}

function add ({ mongoContext }, cityRecord) {
  return new Promise((resolve, reject) => {
    return mongoContext.collection('cities').insertOne(cityRecord, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

function buildNearestCitiesSearchCriteria (coordinates, radiusInKm) {
  return {
    coordinates: {
      $geoWithin: { $centerSphere: [coordinates, kmToRadians(radiusInKm)] },
    },
  };
}

function kmToRadians (distanceInKm) {
  return distanceInKm / 6378.1;
}

export class AddBatch {
  constructor ({ mongoContext, logger }) {
    this.mongoContext = mongoContext;
    this.cities = mongoContext.collection('cities');
    this.batch = this.cities.initializeUnorderedBulkOp({ useLegacyOps: true });
    this.logger = logger;
  }

  add (cityRecord) {
    this.batch.insert(cityRecord);
    this.logger.debug(`record inserted to batch ${JSON.stringify(cityRecord)}`);
  }

  async execute () {
    try {
      return await this.batch.execute();
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
