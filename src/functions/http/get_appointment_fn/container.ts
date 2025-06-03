import { DynamoDBAdapter, Logger, MySQLAdapter } from 'shared';
import { AppointmentRepository } from './repositories/appointmentRepository';
import { AppointmentService } from './services/appointmentService';

export function createAppointmentService(logger: Logger): AppointmentService {
    const tableName = process.env.DYNAMO_APPOINTMENT_TABLE_NAME!;
    const region = process.env.AWS_REGION!;

    const dynamoAdapter = new DynamoDBAdapter(tableName, region);
    const appointmentRepository = new AppointmentRepository(dynamoAdapter, logger);
    return new AppointmentService(appointmentRepository, logger);
}
