import mysql from 'serverless-mysql';
import { SaveAdapter } from '../database/DatabaseAdapter';
import { DatabaseConfig } from '../../interfaces/databaseConfig';
import { Appointment } from '../../interfaces/appointment';
import { ResultSetHeader } from 'mysql2';

export class MySQLAdapter implements SaveAdapter {
    private db: ReturnType<typeof mysql>;
    private tableName: string;

    constructor(config: DatabaseConfig, tableName: string) {
        this.db = mysql({
            config: {
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database,
            },
        });
        this.tableName = tableName;
    }

    async save(appointment: Appointment): Promise<boolean> {
        try {
            
            const result: ResultSetHeader = await this.db.query(
                `INSERT INTO \`${this.tableName}\` SET ?`,
                this.toSnakeCaseAppointment(appointment),
            );

            const wasCreated = result?.affectedRows > 0;
            return wasCreated;
        } catch (error) {
            console.error('Error (createAppointment) :', error);
            throw error;
        } finally {
            await this.db.end();
        }
    }

    private toSnakeCaseAppointment(appointment: Appointment): Record<string, any> {
        return {
            insured_id: appointment.insuredId,
            country_iso: appointment.countryISO,
            schedule_id: appointment.scheduleId,
            status: appointment.status,
        };
    }
}
