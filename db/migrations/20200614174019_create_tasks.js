const Knex = require('knex');

const tableNames = require('../tableNames');

/**
 *
 * @param {Knex} knex
 */

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.tasks, (table) => {
    table.increments('id').notNullable();
    table.string('company_name').notNullable();
    table.string('job_title').notNullable();
    table.string('description', 2000);
    table.string('location');
    table.string('salary');
    table.string('post_url');
    table.foreign('user_id').references('id').inTable(tableNames.users);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists(tableNames.tasks);
};
