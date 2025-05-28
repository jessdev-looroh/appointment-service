import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as dynamoDB from './aws/dynamo';
import { formatErrorResponse } from './utils/errorResponse';

export const getAppointmentsByInsuredIdHandler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    let apiResponse: APIGatewayProxyResult;

    try {
        const id = event.pathParameters?.insuredId;
        console.log({id});
        if (!id) throw new Error('The insuredId is required');

        const resp = await dynamoDB.listAppointmentsByInsuredId(id);
        apiResponse = {
            statusCode: resp.statusCode,
            body: JSON.stringify(resp),
        };
    } catch (err: unknown) {
        console.error('Error (getAppointmentsByInsuredIdHandler): ', err);
        const resp = formatErrorResponse(err);
        apiResponse = {
            statusCode: resp.statusCode,
            body: JSON.stringify(resp),
        };
    }

    return apiResponse;
};
