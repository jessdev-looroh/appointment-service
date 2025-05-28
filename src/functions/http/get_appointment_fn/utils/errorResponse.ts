import { StatusCodeEnum } from '../enums/statusCode';
import { StatusTextEnum } from '../enums/statusText';
import { Response } from '../interfaces/response/response';

export const formatErrorResponse = (err: unknown): Response => {
    return {
        statusCode: StatusCodeEnum.INTERNAL,
        statusText: StatusTextEnum.INTERNAL,
        data: [],
        error: {
            message: err instanceof Error ? err.message : 'Unknown error',
        },
    };
};
