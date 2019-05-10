exports.up = function(knex, promise) {
    return knex.schema.table('types', function(t) {
        t.string('reference_img_path');
    });
};

exports.down = function(knex, promise) {
    return knex.schema.table('types', function(t) {
        t.dropColumn('reference_img_path');
    });
};