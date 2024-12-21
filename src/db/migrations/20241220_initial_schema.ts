import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create posts table
  await knex.schema.createTable('posts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('title').notNullable();
    table.text('content').notNullable();
    table.text('excerpt').nullable();
    table.string('slug').unique().notNullable();
    table.timestamp('date').notNullable();
    table.timestamp('updated').nullable();
    table.boolean('draft').defaultTo(false);
    table.json('tags').nullable();
    table.string('image').nullable();
    table.timestamps(true, true);
  });

  // Create tags table for better querying
  await knex.schema.createTable('tags', (table) => {
    table.increments('id').primary();
    table.string('name').unique().notNullable();
    table.timestamps(true, true);
  });

  // Create posts_tags junction table
  await knex.schema.createTable('posts_tags', (table) => {
    table.uuid('post_id').references('id').inTable('posts').onDelete('CASCADE');
    table.integer('tag_id').references('id').inTable('tags').onDelete('CASCADE');
    table.primary(['post_id', 'tag_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('posts_tags');
  await knex.schema.dropTableIfExists('tags');
  await knex.schema.dropTableIfExists('posts');
}
