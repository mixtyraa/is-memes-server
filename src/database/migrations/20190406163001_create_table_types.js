exports.up = function(knex, Promise) {
    return knex.schema.createTable('types', table => {
        table.increments('id').primary();
        table.string('name');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('types');
};
