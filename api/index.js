"use strict";
import 'dotenv/config';

import app from './app'
import logger from './libs/logger';

const PORT = process.env.PORT || 80

app.listen(PORT, () => logger.info(`API listening on ${PORT}`));
