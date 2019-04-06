import bodyParser from 'body-parser';
import Express from 'express';
import response from './middleware/Response';

import Express from 'express';
const express: Express.Application = Express();
express.use(response);
express.use(bodyParser.json());
express.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening on port ${process.env.SERVER_PORT}`);
});