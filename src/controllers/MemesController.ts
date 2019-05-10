import MemeTypes from 'app/MemeTypes';
import { knex } from 'database/knex';
import { Request } from 'express';
import * as fs from 'fs';
import { IResponse } from 'middleware/Response';
import VK from 'vk-io';

export default  class MemesController {

    public static loadImg(req: Request, res: IResponse) {
        console.log(req.file);
        if (req.file.mimetype.split('/')[0] !== 'image') {
            res.error(401, {message: 'Format error'});
            return;
        }

        const file = process.env.UPLOAD_PATH
            + '/'
            + req.file.filename
            + '.'
            + req.file.originalname.split('.').slice(-1)[0];

        fs.rename(req.file.path, file, async (err) => {
            if (err) {
                res.error(500);
                return;
            }

            const vk = new VK();
            vk.token = process.env.VK_TOKEN;
            const vkUrl = await vk.upload.messagePhoto({
                source: fs.createReadStream(file)
            });

            const idType = await MemeTypes.defineMemetype(file);

            res.success({
                type: idType,
                url: vkUrl.largePhoto
            });
            fs.unlinkSync(file);
        });
    }

    public static getMeme(req: Request, res: IResponse) {
        const knexquery = knex('memes').select(
            'memes.id',
            'memes.name',
            'memes.link',
            'types.id as type'
            ).join('types', 'types.id', 'memes.idTypes');
        if (req.query.id) {
            knexquery.where('id', req.query.id);
        }

        const requestKnex: Array<Promise<any>> = [];
        knexquery.then(async (data) => {
            await data.forEach(( meme: any ) => {
                console.log(`start foreach ${meme.id}`);
                requestKnex.push(
                    (knex('tags_memes')
                    .select('tags.id', 'tags.name')
                    .where('tags_memes.idMemes', meme.id)
                    .join('tags', 'tags_memes.idTags', 'tags.id')
                    .then((tags) => {
                        console.log('knex finish');
                        meme.tags = tags;
                        console.log(data);
                    })) as unknown as Promise<any>
                );
            });
            Promise.all(requestKnex).then(() => {
                console.log('end foreach');
                if (data.length > 0) {
                    res.success(data);
                } else {
                    res.error(404);
                }
            });

        });
    }

    public static addMeme(req: Request, res: IResponse) {
        const reqData = req.body;
        const errorList = [];

        if (!reqData.name) {
            errorList.push({
                errCode: 'NameRequired',
                message: 'Name is required'
            });
        }

        if (!reqData.type) {
            errorList.push({
                errCode: 'TypeRequired',
                message: 'Type is required'
            });
        }

        if (!reqData.link) {
            errorList.push({
                errCode: 'LinkRequired',
                message: 'Link is required'
            });
        } else {
            const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            const regex = new RegExp(expression);

            if (!reqData.link.match(regex)) {
                errorList.push({
                    errCode: 'LinkInvalid',
                    message: 'Link is invalid'
                });
            }
        }

        if (!reqData.tags && (reqData.tags || []).length === 0) {
            errorList.push({
                errCode: 'TagsRequired',
                message: 'Tags is required'
            });
        }

        if (errorList.length > 0) {
            res.error(400, errorList);
            return;
        }

        // Добавляем мем в бд
        knex('memes').insert({
            name : reqData.name,
            idTypes: reqData.type,
            link: reqData.link
        }).then((memeId) => {
            // Устанавливаем связи теги -> мем
            knex('tags_memes').insert(
                reqData.tags.map((tagId: number) => ({
                    idTags: tagId,
                    idMemes: memeId
                    })
                )
            ).then(() => {
                // Получаем записанный мем
                const requestKnex: Array<Promise<any>> = [];
                knex('memes')
                    .select(
                        'memes.id',
                        'memes.name',
                        'memes.link',
                        'types.id as type'
                    )
                    .where('memes.id', memeId)
                    .join('types', 'types.id', 'memes.idTypes')
                    .then( (data) => {
                        data.forEach(( meme: any ) => {
                            console.log(`start foreach ${meme.id}`);
                            requestKnex.push(
                                (knex('tags_memes')
                                .select('tags.id', 'tags.name')
                                .where('tags_memes.idMemes', meme.id)
                                .join('tags', 'tags_memes.idTags', 'tags.id')
                                .then((tags) => {
                                    console.log('knex finish');
                                    meme.tags = tags;
                                    console.log(data);
                                })) as unknown as Promise<any>
                            );
                    });

                        Promise.all(requestKnex).then(() => {
                            if (data.length > 0) {
                                res.success(data);
                            } else {
                                res.error(500);
                            }
                    });
                });
            }).catch((err) => {
                console.log(err);
            });

        });

    }
}
