import { knex } from 'database/knex';
import Jimp from 'jimp';

export default class MemeTypes {
    public static defineMemetype(path: string) {
        return new Promise(async (resolve, reject) => {
            const distances: Array<{id: number, distance: number}> = [];
            const pathImg = await Jimp.read(path);
            knex.select(['id', 'reference_img_path'])
            .from('types')
            .whereNotNull('reference_img_path')
            .then((data) => {
                const diffPromise: Array<Promise<any>> = [];

                data.forEach((type: any) => {

                    diffPromise.push(
                        Jimp.read(process.env.DATA_TYPES_IMG_REFERENCE_PATH + type.reference_img_path).then((img) => {
                            const distance = Jimp.distance(pathImg, img);
                            distances.push({id: type.id, distance});
                        }).catch((err) => {
                            //
                        })
                    );
                });

                Promise.all(diffPromise).then(() => {
                    function findMin(aDistances: typeof distances) {
                        let minIndex = 0;
                        for (let i = 0, len = aDistances.length; i < len; i++) {
                            minIndex = (aDistances[i].distance < aDistances[minIndex].distance) ? i : minIndex;
                        }
                        return aDistances[minIndex];
                    }
                    resolve(findMin(distances).id);
                });
            });
        });
    }
}