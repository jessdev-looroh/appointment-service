import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Appointment } from '../schemas/appointment';
import { AppointmentStatus } from '../enums/appointmentStatus';
import { Response } from '../interfaces/response/response';
import { StatusCodeEnum } from '../enums/statusCode';
import { StatusTextEnum } from '../enums/statusText';
import { publishToNewAppointmentTopic } from './sns';
import { formatErrorResponse } from '../utils/errorResponse';

const ddbClient: DynamoDBClient = new DynamoDBClient({});

const APPOINTMENT_TABLE = process.env.DYNAMO_APPOINTMENT_TABLE_NAME ?? '';

if (!APPOINTMENT_TABLE) {
    throw new Error('DYNAMO_APPOINTMENT_TABLE_NAME is not defined in environment variables');
}

export const createAppointment = async (appointment: Appointment) => {
    let appointmentResponse: Response;
    const command = new PutItemCommand({
        TableName: APPOINTMENT_TABLE,
        Item: {
            PK: { S: `INSURED#${appointment.insuredId}` },
            SK: { S: `SCHEDULE#${appointment.scheduleId}` },
            insuredId: { S: appointment.insuredId },
            scheduleId: { N: `${appointment.scheduleId}` },
            countryISO: { S: appointment.countryISO },
            appointmentStatus: { S: AppointmentStatus.PENDING },
        },
        ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)',
    });

    try {
        const resp = await ddbClient.send(command);
        const wasCreated = resp.$metadata.httpStatusCode == 200;

        appointmentResponse = {
            statusCode: wasCreated ? StatusCodeEnum.CREATED : StatusCodeEnum.INTERNAL,
            statusText: wasCreated ? StatusTextEnum.CREATED : StatusTextEnum.INTERNAL,
            data: [appointment],
            error: {},
        };
    } catch (err) {
        console.error('Error (createAppointment): ', err);
        appointmentResponse = formatErrorResponse(err);
    }
    return appointmentResponse;
};
