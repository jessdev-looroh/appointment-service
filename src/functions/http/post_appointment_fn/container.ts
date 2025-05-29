import { DynamoDBAdapter } from './aws/database';
import { SNSNotificationPublisherAdapter } from './aws/snsNotificationPublisherAdapter';
import { AppointmentRepository } from './repositories/appointmentRepository';
import { AppointmentService } from './services/appointmentService';


export function createAppointmentService(): AppointmentService {
    
    const tableName = process.env.DYNAMO_APPOINTMENT_TABLE_NAME!;
    const topicName = process.env.EVENT_NEW_APPOINTMENT_TOPIC!;
    const region = process.env.AWS_REGION!;

    const dynamoAdapter = new DynamoDBAdapter(tableName, region);
    const publisher = new SNSNotificationPublisherAdapter(topicName, region);
    
    const appointmentRepository = new AppointmentRepository(dynamoAdapter);

    return new AppointmentService(appointmentRepository, publisher);
}
