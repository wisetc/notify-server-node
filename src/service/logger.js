const winston = require('winston');
const { combine, timestamp, prettyPrint } = winston.format;

const logger = winston.createLogger({
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

module.exports = logger;
