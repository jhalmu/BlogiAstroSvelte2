import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_activities', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('action').notNullable();
    table.string('details').nullable();
    table.string('ip_address').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Add password reset token to users table
  await knex.schema.alterTable('users', (table) => {
    table.string('reset_token').nullable();
    table.timestamp('reset_token_expires').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('reset_token');
    table.dropColumn('reset_token_expires');
  });
  await knex.schema.dropTableIfExists('user_activities');
}
