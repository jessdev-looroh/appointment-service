import { DynamoDBAdapter, Logger, NotificationPublisherAdapterImpl } from 'shared';
import { AppointmentRepositoryImpl } from './repositories/appointmentRepository';
import { AppointmentService } from './services/appointmentService';

/**
 * Creates an instance of AppointmentService
 * @param {Logger} logger - The logger instance
 * @returns {AppointmentService} The appointment service instance
 */
export function createAppointmentService(logger: Logger): AppointmentService {
    const tableName = process.env.DYNAMO_APPOINTMENT_TABLE_NAME ?? '';
    const topicName = process.env.EVENT_NEW_APPOINTMENT_TOPIC ?? '';
    const region = process.env.AWS_REGION ?? '';

    const dynamoAdapter = new DynamoDBAdapter(tableName, region);
    const publisher = new NotificationPublisherAdapterImpl(topicName, region, logger);
    const appointmentRepository = new AppointmentRepositoryImpl(dynamoAdapter, logger);

    return new AppointmentService(appointmentRepository, publisher, logger);
}
