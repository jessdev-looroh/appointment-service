import { ZodError } from 'zod';
import { StatusCodeEnum } from '../enums/statusCode';
import { StatusTextEnum } from '../enums/statusText';
import { Response } from '../interfaces/response/response';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';

export const formatErrorResponse = (err: unknown): Response => {
    if (err instanceof ZodError) {
        return {
            statusCode: StatusCodeEnum.BAD_REQUEST,
            statusText: StatusTextEnum.BAD_REQUEST,
            data: [],
            error: {
                message: 'Validation Error',
                issues: err.errors.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message,
                })),
            },
        };
    }
    if (err instanceof ConditionalCheckFailedException) {
        return {
            statusCode: StatusCodeEnum.CONFLICT,
            statusText: StatusTextEnum.CONFLICT,
            data: [],
            error: {
                message: 'Appointment already exists',
                stack: err.stack,
            },
        };
    }
    return {
        statusCode: StatusCodeEnum.INTERNAL,
        statusText: StatusTextEnum.INTERNAL,
        data: [],
        error: {
            message: err instanceof Error ? err.message : 'Unknown error',
            stack: err instanceof Error ? err.stack : undefined,
        },
    };
};
