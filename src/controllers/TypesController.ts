import {Request, Response} from 'express';

export default class TypeController {

    public static getTypes(req: Request, res: Response) {
        res.json('get types');
    }

    public static addType(req: Request, res: Response) {
        res.json('add type');
    }

}