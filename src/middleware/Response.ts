import {Request, Response} from 'express';

interface IResponse extends Response {
    success(data: object): void;
    error(errorCode: number, data?: object): void;
}

export default function(req: Request, res: IResponse, next: CallableFunction): void {
    res.success = (data) => {
        res.json({
            status: 'success',
            data,
        });
    };

    res.error = (errorCode, data) => {
        const response: { status: string, errorCode: number, data?: object } = {
            status: 'error',
            errorCode,
        };

        if (data) {
            response.data = data;
        }

        res.json(response);
    };

    next();
}
