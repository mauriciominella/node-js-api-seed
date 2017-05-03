import config from '../../config';
import configureContainer from '../configureContainer';

const countryFilePath = process.argv[2];

configureContainer(config).then(async (container) => {
  const { countriesService } = container.cradle;
  process.send(`processing ${countryFilePath}`);
  await countriesService.addFromFile(countryFilePath);
  process.send(`data loaded for ${countryFilePath}`);
  process.exit(0);
}).catch((err) => {
  console.error('error', err.stack || err);
  process.exit(1);
});
