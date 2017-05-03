import supertest from 'supertest';
import fs from 'fs';
import chai from 'chai';
import Joi from 'joi';
import JoiAssert from 'joi-assert';
import nock from 'nock';
import chaiAsPromised from 'chai-as-promised';
import configureContainer from '../../src/configureContainer';
import config from '../../config';
import { application } from '../../src';
import { getMongoClient } from '../../src/db/mongoDbContext';
import { getQueueClient } from '../../src/db/queueContext';
import data from './data';

chai.use(chaiAsPromised);

configureContainer(config).then(async (container) => {
  const app = application({ container, config });
  global.app = app;
  global.container = container;
  global.nock = nock;
  global.request = supertest(app);
  global.expect = chai.expect;
  global.assert = chai.assert;
  global.data = data;
  global.Joi = Joi;
  global.joiAssert = JoiAssert;
  global.queue = getQueueClient(config.env);
  global.clearMongo = () => {
    global.mongo.collection('cities').remove();
  };
  global.restoreFiles = () => {
    Object.keys(global.data.files).forEach((key) => {
      const file = global.data.files[key];
      fs.writeFileSync(file.tmp, fs.readFileSync(file.original));
    });
  };

  try {
    const database = await getMongoClient(config.env);
    global.mongo = database;
  } catch (err) {
    console.error(err);
  }
}).catch((err) => {
  console.log('Error initialising app for integration tests');
  throw err;
});
