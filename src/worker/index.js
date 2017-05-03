import RSMQWorker from 'rsmq-worker';
import configureContainer from '../configureContainer';

const QUEUE_NAME = 'addnewcountry';

export function startWorker ({ logger, queueContext, addNewCountryJob }) {
  const worker = new RSMQWorker(QUEUE_NAME, { rsmq: queueContext });

  worker.on('message', async (msg, next, id) => {
    const message = JSON.parse(msg);
    logger.info(`new queue message sent ${id}`);
    worker.del(id);
    try {
      logger.info('message', message.source);
      const addCountry = await addNewCountryJob.addCountryFromCode(message);
      logger.info(`add country from code ${addCountry.status}`);
    } catch (err) {
      logger.error('error adding country from code', err);
    }
    next();
  });

  // optional error listeners
  worker.on('error', (err, msg) => {
    logger.error('error', err, msg.id);
  });

  worker.on('exceeded', (msg) => {
    logger.info('exceeded', msg.id);
  });

  worker.on('timeout', (msg) => {
    logger.info('timeout', msg.id, msg.rc);
  });

  worker.start();
}

export function start (config) {
  let logger;
  configureContainer(config).then((container) => {
    startWorker(container.cradle);
    ({ logger } = container.cradle);
    logger.info('worker started...');
  }).catch((err) => {
    logger.error('error', err.stack || err);
  });
}
