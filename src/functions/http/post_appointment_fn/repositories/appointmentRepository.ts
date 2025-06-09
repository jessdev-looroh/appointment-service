import { Logger, Save } from 'shared';
import { AppointmentRepository } from '../interfaces';
import { Appointment } from '../schemas/appointment';

/**
 * Class that provides a repository for appointment operations
 * @param {Save} dbAdapter - The database adapter
 * @param {Logger} logger - The logger instance
 */
export class AppointmentRepositoryImpl implements AppointmentRepository {
    constructor(private readonly dbAdapter: Save, private readonly logger: Logger) {}

    /**
     * Saves an appointment
     * @param {Appointment} appointment - The appointment to save
     * @returns {Promise<boolean>} True if the appointment was saved successfully
     */
    async save(appointment: Appointment): Promise<boolean> {
        this.logger.info('AppointmentRepository', `Saving appointment to ${this.dbAdapter.toString()}`);
        const { status, ...rest } = appointment;
        const data = {
            ...rest,
            appointmentStatus: status,
            PK: `INSURED#${appointment.insuredId}`,
            SK: `SCHEDULE#${appointment.scheduleId}`,
        } as Record<string, any>;
        const conditionExpression = 'attribute_not_exists(PK) AND attribute_not_exists(SK)';
        return this.dbAdapter.save(data, conditionExpression);
    }
}
