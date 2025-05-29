import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { Appointment } from '../interfaces/appointment';
import { AppointmentStatus } from '../enums/appointmentStatus';

const ddbClient: DynamoDBClient = new DynamoDBClient({});

const APPOINTMENT_TABLE = process.env.DYNAMO_APPOINTMENT_TABLE_NAME ?? '';

if (!APPOINTMENT_TABLE) {
    throw new Error('DYNAMO_APPOINTMENT_TABLE_NAME is not defined in environment variables');
}

export const updateAppointmentStatus = async (appointment: Appointment) => {
    const command = new UpdateItemCommand({
        TableName: APPOINTMENT_TABLE,
        Key: {
            PK: { S: `INSURED#${appointment.insuredId}` },
            SK: { S: `SCHEDULE#${appointment.scheduleId}` },
        },
        UpdateExpression: 'SET appointmentStatus = :status',
        ExpressionAttributeValues: {
            ':status': { S: AppointmentStatus.COMPLETED },
        },
        ReturnValues: 'ALL_NEW',
    });

    try {
        const resp = await ddbClient.send(command);
    } catch (err) {
        console.error('Error (createAppointment): ', err);
    }
};
