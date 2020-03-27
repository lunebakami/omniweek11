const knex = require('knex');
const knexConfig = require('../../knexfile');

const conn = knex(knexConfig.development);

module.exports = conn;
