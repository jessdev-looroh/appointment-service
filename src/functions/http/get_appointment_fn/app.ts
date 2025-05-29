import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatErrorResponse } from './utils/errorResponse';
import { createAppointmentService } from './container';

const appointmentService = createAppointmentService();
const headers =  JSON.parse(process.env.CORS_HEADERS!);

export const getAppointmentsByInsuredIdHandler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    let apiResponse: APIGatewayProxyResult;

    try {
        const id = event.pathParameters?.insuredId;
        
        if (!id) throw new Error('The insuredId is required');

        const resp = await appointmentService.getAppointmentsByInsuredId(id);
        apiResponse = {
            statusCode: resp.statusCode,
            headers,
            body: JSON.stringify(resp),
        };
    } catch (err: unknown) {
        console.error('Error (getAppointmentsByInsuredIdHandler): ', err);
        const resp = formatErrorResponse(err);
        apiResponse = {
            statusCode: resp.statusCode,
            headers,
            body: JSON.stringify(resp),
        };
    }

    return apiResponse;
};
