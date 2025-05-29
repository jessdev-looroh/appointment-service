import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { AppointmentStatus } from '../../enums/appointmentStatus';
import { Appointment } from '../../interfaces/appointment';
import { IUpdateAdapter } from '../../interfaces/infrastructure';

export class DynamoDBAdapter implements IUpdateAdapter {
    private client: DynamoDBClient;
    private tableName: string;

    constructor(tableName: string, region: string = 'us-east-2') {
        this.client = new DynamoDBClient({ region });
        this.tableName = tableName;
    }
    update = async (appointment: Appointment): Promise<void> => {
        const command = new UpdateItemCommand({
            TableName: this.tableName,
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
            await this.client.send(command);
        } catch (err) {
            console.error('Error (createAppointment): ', err);
            throw err;
        }
    };
}
