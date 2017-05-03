export default {
  environment: process.env.NODE_ENV || 'development',
  http: {
    host: process.env.HTTP_HOST || '0.0.0.0',
    port: process.env.HTTP_PORT || '8080',
  },
  mongo: {
    host: process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost',
    port: process.env.MONGO_PORT_27017_TCP_PORT || '27017',
    timeout: process.env.DB_TIMEOUT || 30000,
    database: process.env.DB_DATABASE || 'local',
  },
  redis: {
    host: process.env.REDIS_1_PORT_6379_TCP_ADDR || 'localhost',
    port: process.env.REDIS_1_PORT_6379_TCP_PORT || '6379',
  },
  log: {
    level: process.env.LOG_LEVEL || 'error',
  },
};
