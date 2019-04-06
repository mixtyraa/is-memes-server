exports.up = function(knex, Promise) {
    return knex.schema.createTable('tags_memes', table => {
        table.integer('idMemes').unsigned().notNullable();
        table.integer('idTags').unsigned().notNullable();
        table.foreign('idTags').references('id').inTable('tags');
        table.foreign('idMemes').references('id').inTable('memes');
        table.primary(['idMemes', 'idTags']);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('tags_memes');
};