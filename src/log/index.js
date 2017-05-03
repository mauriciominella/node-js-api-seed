import winston from 'winston';

export default function getLogger (config) {
  const transports = getTransports(config);
  const logger = new (winston.Logger)({ transports });
  return logger;
}

export function getTransports (config) {
  const transports = getTestLogTransports(config);
  if (config.environment !== 'TEST') {
    transports.push(new (winston.transports.Console)());
  }

  return transports;
}

export function getTestLogTransports (config) {
  const transports = [];
  if (config.env.environment === 'TEST') {
    const fileTransport = new (winston.transports.File)({
      level: 'debug',
      filename: 'test.log',
      json: false,
    });
    transports.push(fileTransport);
  }
  return transports;
}
