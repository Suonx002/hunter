const Knex = require('knex');

const tableNames = require('../tableNames');

/**
 *
 * @param {Knex} knex
 */

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.users, (table) => {
    table.increments('id').notNullable();
    table.string('name').notNullable();
    table.string('email', 254).notNullable().unique();
    table.string('password', 127).notNullable();
    table.string('passwordConfirm', 127).notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists(tableNames.users);
};
