import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatErrorResponse } from './utils/errorResponse';
import { Appointment, AppointmentSchema } from './schemas/appointment';
import { createAppointmentService } from './container';

export const createAppointmentHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let apiResponse: APIGatewayProxyResult;

    try {
        const body = JSON.parse(event.body || '{}');
        const appointment: Appointment = AppointmentSchema.parse(body);

        const appointmentService = createAppointmentService();
        const resp = await appointmentService.createAppointment(appointment);

        apiResponse = {
            statusCode: resp.statusCode,
            body: JSON.stringify(resp),
        };
    } catch (err) {
        console.error('Error (createAppointmentHandler): ', err);
        const resp = formatErrorResponse(err);
        apiResponse = {
            statusCode: resp.statusCode,
            body: JSON.stringify(resp),
        };
    }

    return apiResponse;
};
