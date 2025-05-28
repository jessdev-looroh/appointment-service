import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Appointment, AppointmentSchema } from './schemas/appointment';
import * as dynamoDB from './aws/dynamo';
import { formatErrorResponse } from './utils/errorResponse';
import { StatusCodeEnum } from './enums/statusCode';
import { publishToNewAppointmentTopic } from './aws/sns';

export const createAppointmentHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let apiResponse: APIGatewayProxyResult;

    try {
        const body = JSON.parse(event.body || '{}');
        const appointment: Appointment = AppointmentSchema.parse(body);
        
        const resp = await dynamoDB.createAppointment(appointment);

        if (resp.statusCode == StatusCodeEnum.CREATED) await publishToNewAppointmentTopic(appointment);

        apiResponse = {
            statusCode: resp.statusCode,
            body: JSON.stringify(resp),
        };
    } catch (err: unknown) {
        console.error('Error (createAppointmentHandler): ', err);
        const resp = formatErrorResponse(err);
        apiResponse = {
            statusCode: resp.statusCode,
            body: JSON.stringify(resp),
        };
    }

    return apiResponse;
};
