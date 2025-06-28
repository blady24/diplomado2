import 'dotenv/config'
import app from './app.js';
import logger from './logs/logger.js';
import config  from './config/env.js';
import { sequelize } from './database/database.js';

async function main() {
  await sequelize.sync({ force: false });
  const port = config.PORT || 3000;
  app.listen(' ' + port);
  console.log('Server on port: ' + process.env.PORT);
  logger.info('Server on port: ' + process.env.PORT);
  logger.error('Server on port:' + process.env.PORT);
  logger.warn('Server on port: ' + process.env.PORT);
  logger.fatal('Server on port: ' + process.env.PORT);
}
main();