

import { DynamoDBAdapter, Logger } from 'shared';
import { AppointmentService } from './services/appointmentService';
import { AppointmentRepositoryImpl } from './repositories/appointmentRepository';

export function createAppointmentService(logger: Logger): AppointmentService {
    
    const tableName = process.env.DYNAMO_APPOINTMENT_TABLE_NAME!;
    const region = process.env.AWS_REGION!;

    const dynamoAdapter = new DynamoDBAdapter(tableName, region);
    
    const appointmentRepository = new AppointmentRepositoryImpl(dynamoAdapter, logger);

    return new AppointmentService(appointmentRepository, logger);
}
