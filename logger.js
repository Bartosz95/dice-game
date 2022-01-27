const winston = require('winston');

const logger = winston.createLogger({
  level: 'INFO',
  transports: [
    new winston.transports.File({ filename: 'logs/out.log'}),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error'})
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger