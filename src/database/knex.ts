import Knex from 'knex';

// @ts-ignore
import * as config from './knexconfig.js';

const knex: Knex = Knex(config as Knex.Config);

export { knex };
