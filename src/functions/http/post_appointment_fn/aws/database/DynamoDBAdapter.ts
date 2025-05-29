import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { FullDatabaseAdapter } from './DatabaseAdapter';
import { AppointmentStatus } from '../../enums/appointmentStatus';
import { Appointment } from '../../schemas/appointment';

export class DynamoDBAdapter implements FullDatabaseAdapter {
    private client: DynamoDBClient;
    private tableName: string;

    constructor(tableName: string, region: string = 'us-east-2') {
        this.client = new DynamoDBClient({ region });
        this.tableName = tableName;
    }

    async getAllByInsuredId(insuredId: string): Promise<Appointment[]> {
        try {
            const command = new QueryCommand({
                TableName: this.tableName,
                KeyConditionExpression: 'PK = :pk',
                ExpressionAttributeValues: {
                    ':pk': { S: `INSURED#${insuredId}` },
                },
            });

            const result = await this.client.send(command);
            // return result.Items as T[] || null;
        } catch (error) {
            console.error('DynamoDB getAllByInsuredId error:', error);
            // return null;
        }
        return [];
    }

    async save(appointment: Appointment): Promise<boolean> {
        try {
            const command = new PutItemCommand({
                TableName: this.tableName,
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

            const resp = await this.client.send(command);
            return resp.$metadata.httpStatusCode == 200;
        } catch (err) {
            console.error('Error (createAppointment): ', err);
            throw err; 
        }
    }
}
