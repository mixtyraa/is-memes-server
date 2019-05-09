import { knex } from 'database/knex';
import { Request } from 'express';
import { IResponse } from 'middleware/Response';

export default class TypeController {

    public static getTypes(req: Request, res: IResponse) {
        const knexquery = knex('types').select('id', 'name');
        if (req.query.id) {
            knexquery.where('id', req.query.id);
        } else if (req.query.q) {
            knexquery.where('name', 'like', `%${req.query.q}%`);
        }

        knexquery.then((data) => {
            if (data.length > 0) {
                res.success(data);
            } else {
                res.error(404);
            }
        });
    }

    public static addType(req: Request, res: IResponse) {
        if (req.body.name) {
            knex('types').insert({
                name : req.body.name
            }).then((data) => {
                knex('types').select('id', 'name').where('id', data).then((tag) => {
                    res.success(tag);
                });
            });
        }
    }

}