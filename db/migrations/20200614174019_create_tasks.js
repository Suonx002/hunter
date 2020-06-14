const Knex = require('knex');

const tableNames = require('../tableNames');

/**
 *
 * @param {Knex} knex
 */

exports.up = (knex) => {
  return knex.schema.createTable(tableNames.tasks, (table) => {
    table.increments('id').notNullable();
    table.string('company_name').notNullable();
    table.string('job_title').notNullable();
    table.string('description', 2000);
    table.string('location');
    table.string('salary');
    table.string('post_url');
    table.integer('user_id').unsigned().notNullable();
    table
      .foreign('user_id')
      .references('id')
      .inTable(tableNames.users)
      .onDelete('cascade');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists(tableNames.tasks);
};
