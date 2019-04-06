import {Request, Response} from 'express';

export default function(req: Request, res: Response, next: CallableFunction): void {
    res.header('Access-Control-Allow-Origin', '*');
    next();
}
