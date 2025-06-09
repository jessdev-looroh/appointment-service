import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { StatusCodeEnum } from '../enums/statusCode';
import { StatusTextEnum } from '../enums/statusText';
import { Response } from '../interfaces/response/response';

export const formatErrorResponse = (err: any): Response => {
    let code = err?.$metadata?.httpStatusCode ?? StatusCodeEnum.INTERNAL;
    let message = err instanceof Error ? err.message : 'Unknown error';

    if (err instanceof ConditionalCheckFailedException) {
        code = StatusCodeEnum.CONFLICT;
        message = 'Appointment already exists';
    }

    return {
        statusCode: code,
        statusText: StatusTextEnum[code],
        data: [],
        message,
        error: err,
    };
};
