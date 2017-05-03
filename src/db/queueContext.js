import RedisSMQ from 'rsmq';
import config from '../../config/env';

let rsmp;

export default function (req, res, next) {
  if (!rsmp) {
    rsmp = getQueueClient(config);
  }

  rsmp.createQueue({ qname: 'addnewcountry' }, (err, resp) => {
    if (resp === 1) {
      console.log('queue created'); // eslint-disable-line
    }
  });
  req.queueContext = rsmp; // eslint-disable-line
  next();
}

export function getQueueClient (configuration) {
  const { host, port } = configuration.redis;
  return new RedisSMQ({ host, port, ns: 'rsmq' });
}
