import { Appointment, GetAllById, Logger } from 'shared';

/**
 * Class that provides a repository for appointment operations
 * @param {GetAllById} database - The database adapter
 * @param {Logger} logger - The logger instance
 */
export class AppointmentRepository {
    constructor(private database: GetAllById, private logger: Logger) {}

    /**
     * Gets appointments by insured id
     * @param {string} insuredId - The insured id
     * @returns {Promise<Appointment[]>} The appointments
     */
    async getAppointmentsByInsuredId(insuredId: string) {
        this.logger.info('AppointmentRepository', `Query sent to database database`);
        return this.database.getAllById<Appointment>('PK', `INSURED#${insuredId}`, ['PK', 'SK']);
    }
}
