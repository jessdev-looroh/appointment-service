import { createAppointmentService } from './container';
import { formatErrorResponse, Logger } from 'shared';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const headers = JSON.parse(process.env.CORS_HEADERS!);

export const getAppointmentsByInsuredIdHandler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    const logger = new Logger();
    const appointmentService = createAppointmentService(logger);
    
    let apiResponse: APIGatewayProxyResult;

    try {
        const id = event.pathParameters?.insuredId;

        if (!id) throw new Error('The insuredId is required');

        logger.info('Handler', ` Request accepted with parameter id = ${id}` )
        const resp = await appointmentService.getAppointmentsByInsuredId(id);
        apiResponse = {
            statusCode: resp.statusCode,
            headers,
            body: JSON.stringify(resp),
        };
    } catch (err: any) {
        logger.error('Handler', err?.message ?? '' , err);

        const resp = formatErrorResponse(err);

        apiResponse = {
            statusCode: resp.statusCode,
            headers,
            body: JSON.stringify(resp),
        };
    }

    return apiResponse;
};
