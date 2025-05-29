import { MySQLAdapter } from './aws/database';
import { EventBridgePublisher } from './aws/eventbridgePublisher';
import { DatabaseConfig } from './interfaces/databaseConfig';
import { AppointmentRepository } from './repositories/appointmentRepository';
import { AppointmentService } from './services/appointmentService';

export function createAppointmentService(): AppointmentService {
    const tableName = process.env.MYSQL_APPOINTMENT_TABLE_NAME!;
    const config: DatabaseConfig = {
        host: process.env.DB_HOST_CL!,
        user: process.env.DB_USER_CL!,
        password: process.env.DB_PASSWORD_CL!,
        database: process.env.DB_NAME_CL!,
    };
    const sourceName = process.env.SOURCE!;
    const mysqlAdapter = new MySQLAdapter(config, tableName);
    const eventPublisher = new EventBridgePublisher(sourceName);
    const appointmentRepository = new AppointmentRepository(mysqlAdapter);
    return new AppointmentService(appointmentRepository, eventPublisher);
}
