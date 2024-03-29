import { createLogger, format, transports } from 'winston';


const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const logger = createLogger({
  level: LOG_LEVEL,
  format: format.combine(
    format.timestamp(),
    format.prettyPrint()
  )
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console())
  logger.add(new transports.File({ filename: `${__dirname}/logs/out.log`}))
  logger.add(new transports.File({ filename: `${__dirname}/logs/error.log`, level: 'error'}))
} else {
  logger.add(new transports.Console())
  logger.add(new transports.File({ filename: '/var/log/dice-game-api/out.log'}))
  logger.add(new transports.File({ filename: '/var/log/dice-game-api/error.log', level: 'error'}))
}

logger.info(`Logger run in ${LOG_LEVEL} mode`)

export default logger