import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import api from './api';
import configureContainer from './configureContainer';

export function application ({ container, config }) {
  const app = express();
  app.use((req, res, next) => {
    // We want a new scope for each request!
    req.container = container.createScope(); // eslint-disable-line
    return next();
  });

  app.set('config', config);
  app.use(bodyParser.json());
  app.use(cors());
  api(app);

  return app;
}

export function start (config) {
  let logger;
  configureContainer(config).then((container) => {
    ({ logger } = container.cradle);
    const app = application({ container, config });
    app.listen(config.env.http.port, config.env.http.host, () => {
      /* eslint no-console:0 */
      logger.info(`Server started at http://${config.env.http.host}:${config.env.http.port}`);
    });
  }).catch((err) => {
    logger.error('error', err.stack || err);
  });

  process.on('uncaughtException', (err) => {
    logger.error('uncaught exception', err.message);
    logger.error(err.stack);
    process.exit(1);
  });
}
