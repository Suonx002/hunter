const Knex = require('knex');

const tableNames = require('../tableNames');

/**
 *
 * @param {Knex} knex
 */

exports.up = (knex) => {
  return knex.schema.createTable(tableNames.users, (table) => {
    table.increments('id').notNullable();
    table.string('name').notNullable();
    table.string('email', 254).notNullable().unique();
    table.string('password', 127).notNullable();
    // table.string('passwordConfirm', 127).notNullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists(tableNames.users);
};
