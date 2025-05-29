import { MySQLAdapter } from './aws/database';
import { DatabaseConfig } from './interfaces/databaseConfig';
import { AppointmentRepository } from './repositories/appointmentRepository';
import { AppointmentService } from './services/appointmentService';

export function createAppointmentService(): AppointmentService {
    const tableName = process.env.MYSQL_APPOINTMENT_TABLE_NAME!;
    const config: DatabaseConfig = {
        host: process.env.DB_HOST_PE!,
        user: process.env.DB_USER_PE!,
        password: process.env.DB_PASSWORD_PE!,
        database: process.env.DB_NAME_PE!,
    };

    const mysqlAdapter = new MySQLAdapter(config, tableName);
    const appointmentRepository = new AppointmentRepository(mysqlAdapter);
    return new AppointmentService(appointmentRepository);
}
