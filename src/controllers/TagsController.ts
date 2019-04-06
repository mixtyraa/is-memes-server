import { knex } from 'database/knex';
import { Request } from 'express';
import { IResponse } from 'middleware/Response';

export default class TagsController {

    public static getTags(req: Request, res: IResponse) {
        const knexquery = knex('tags').select('id', 'name');
        if (req.query.id) {
            knexquery.where('id', req.query.id);
        }
        knexquery.then((data) => {
            if (data.length > 0) {
                res.success(data);
            } else {
                res.error(404);
            }
        });
    }

    public static addTag(req: Request, res: IResponse) {
        if (req.body.name) {
            knex('tags').insert({
                name : req.body.name
            }).then((data) => {
                knex('tags').select('id', 'name').where('id', data).then((tag) => {
                    res.success(tag);
                });
            });
        }
    }

}
