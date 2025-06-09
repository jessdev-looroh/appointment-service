import { Appointment, Logger, Update } from 'shared';
import { AppointmentRepository } from '../interfaces';

/**
 * Class that provides a repository for appointment operations
 * @param {Update} dbAdapter - The database adapter
 * @param {Logger} logger - The logger instance
 */
export class AppointmentRepositoryImpl implements AppointmentRepository {
    constructor(private dbAdapter: Update, private logger: Logger) {}

    /**
     * Updates an appointment
     * @param {Appointment} appointment - The appointment to update
     * @returns {Promise<boolean>} True if the appointment was updated successfully
     */
    async update(appointment: Appointment): Promise<boolean> {
        this.logger.info('AppointmentRepositoryImpl', `Updating appointment in ${this.dbAdapter.toString()}`);

        const fields = {
            appointmentStatus: appointment.status,
        };
        const keys = {
            PK: `INSURED#${appointment.insuredId}`,
            SK: `SCHEDULE#${appointment.scheduleId}`,
        };
        return await this.dbAdapter.update(fields, keys);
    }
}
