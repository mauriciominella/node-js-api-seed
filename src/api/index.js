import meaningError from 'meaning-error-middleware';

import * as population from './population';
import * as countries from './countries';
const wrap = fn => (...args) => fn(...args).catch(args[2]);

export default (app) => {
  app.get('/population/compute', wrap(population.compute));
  app.post('/countries/add/:countryCode', wrap(countries.add));
  app.post('/countries/addAsync/:countryCode', wrap(countries.addAsync));
  app.get('/_ping', (req, res) => {
    res.status(200).end();
  });

  app.use(meaningError);

  app.use((req, res) => {
    res.status(404).end();
  });
};
