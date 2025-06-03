import { StatusCodeEnum } from '../../enums/statusCode';

export interface Response {
    statusCode: StatusCodeEnum;
    statusText: string;
    data: any[];
    error: any;
    message: string;
}
