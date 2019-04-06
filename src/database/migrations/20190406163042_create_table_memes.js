exports.up = function(knex, Promise) {
    return knex.schema.createTable('memes', table => {
        table.increments('id').primary();
        table.integer('idTypes').unsigned().notNullable();
        table.string('name');
        table.string('link');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.foreign('idTypes').references('id').inTable('types');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('memes');
};
