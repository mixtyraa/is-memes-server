import {Request, Response} from 'express';

export default  class MemesController {

    public static getMeme(req: Request, res: Response) {
        res.json('get Meme');
    }

    public static addMeme(req: Request, res: Response) {
        res.json('add Memes');
    }

}