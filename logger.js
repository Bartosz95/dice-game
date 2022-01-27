import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.prettyPrint()
    
  ),
  transports: [
    new transports.File({ filename: 'logs/out.log'}),
    new transports.File({ filename: 'logs/error.log', level: 'error'})
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console());
}

export default logger