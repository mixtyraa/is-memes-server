import bodyParser from 'body-parser';
import Express from 'express';
import cross from './middleware/AllowCrossDomain';
import response from './middleware/Response';

import MemesController from 'controllers/MemesController';
import TagsController from 'controllers/TagsController';
import TypesController from 'controllers/TypesController';

const express: Express.Application = Express();

express.use(response);
express.use(cross);
express.use(bodyParser.json());

express.get('/types', TypesController.getTypes);
express.post('/types', TypesController.addType);

express.get('/tags', TagsController.getTags);
express.post('/tags', TagsController.addTag);

express.get('/memes', MemesController.getMeme);
express.post('/memes', MemesController.addMeme);

express.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening on port ${process.env.SERVER_PORT}`);
});