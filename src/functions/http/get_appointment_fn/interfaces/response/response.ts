import { StatusCodeEnum } from "../../enums/statusCode";
import { StatusTextEnum } from "../../enums/statusText";

export interface Response {
    statusCode: StatusCodeEnum;
    statusText: StatusTextEnum;
    data: any[];
    error: any;
}
