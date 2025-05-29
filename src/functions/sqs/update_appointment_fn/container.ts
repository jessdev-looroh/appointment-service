import { DynamoDBAdapter } from './aws/database';
import { AppointmentRepository } from './repositories/appointmentRepository';
import { AppointmentService } from './services/appointmentService';


export function createAppointmentService(): AppointmentService {
    
    const tableName = process.env.DYNAMO_APPOINTMENT_TABLE_NAME!;
    const region = process.env.AWS_REGION!;

    const dynamoAdapter = new DynamoDBAdapter(tableName, region);
    
    const appointmentRepository = new AppointmentRepository(dynamoAdapter);

    return new AppointmentService(appointmentRepository);
}
