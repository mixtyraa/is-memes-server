import { knex } from 'database/knex';
import { Request } from 'express';
import { IResponse } from 'middleware/Response';

export default class TagsController {

    public static getTags(req: Request, res: IResponse) {
        const knexquery = knex('tags').select('id', 'name');
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

    public static addTag(req: Request, res: IResponse) {
        if (req.body.name) {
            knex('tags').select('id', 'name').where('name', 'LIKE', req.body.name).then((data) => {
                if (data.length > 0) {
                    res.success({
                        ...data[0],
                        isNew: false
                    });
                } else {
                    knex('tags').insert({
                        name : req.body.name
                    }).then((newDate) => {
                        knex('tags').select('id', 'name').where('id', newDate).then((tag) => {
                            res.success({
                                ...tag[0],
                                isNew: true,
                            });
                        });
                    });
                }
            });

        }
    }

}
