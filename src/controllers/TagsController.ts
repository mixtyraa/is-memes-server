import {Request, Response} from 'express';

export default class TagsController {

    public static getTags(req: Request, res: Response) {
        res.json('get Tags');
    }

    public static addTag(req: Request, res: Response) {
        res.json('add Tag');
    }

}