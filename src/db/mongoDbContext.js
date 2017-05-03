import { MongoClient } from 'mongodb';
import config from '../../config/env';

let connection;

export default function (req, res, next) {
  if (!connection) {
    connection = getMongoClient(config);
  }

  connection
    .then((database) => {
      req.mongoContext = database; // eslint-disable-line no-param-reassign
      next();
    })
    .catch((err) => {
      connection = undefined;
      next(err);
    });
}

export function getMongoClient (configuration) {
  const uriConnection = `mongodb://${configuration.mongo.host}:${configuration.mongo.port}/${configuration.mongo.database}`;
  const mongoConnection = MongoClient.connect(uriConnection,
    {
      connectTimeoutMS: parseInt(configuration.mongo.timeout, 10),
    }
  );

  return mongoConnection;
}
