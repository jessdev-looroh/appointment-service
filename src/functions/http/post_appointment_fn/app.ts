import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Appointment, AppointmentSchema } from './schemas/appointment';
import { createAppointmentService } from './container';
import { formatErrorResponse, Logger } from 'shared';

const headers = JSON.parse(process.env.CORS_HEADERS!);

export const createAppointmentHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = new Logger();
    const appointmentService = createAppointmentService(logger);

    let apiResponse: APIGatewayProxyResult;

    try {
        const body = JSON.parse(event.body || '{}');
        const appointment: Appointment = AppointmentSchema.parse(body);

        logger.info('Handler', `Request accepted with body: ${JSON.stringify(body)}`);
        const resp = await appointmentService.createAppointment(appointment);

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
