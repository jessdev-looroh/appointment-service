import { Appointment, Logger, Save } from 'shared';
import { AppointmentRepository } from '../interfaces/appointmentRepository';

/**
 * Class that provides a repository for appointment operations
 * @param {Save} dbAdapter - The database adapter
 * @param {Logger} logger - The logger instance
 */
export class AppointmentRepositoryImpl implements AppointmentRepository {
    constructor(private dbAdapter: Save, private logger: Logger) {}

    /**
     * Creates an appointment
     * @param {Appointment} appointment - The appointment to create
     * @returns {Promise<boolean>} True if the appointment was created successfully
     */
    async create(appointment: Appointment) {
        this.logger.info('AppointmentRepository', `Creating appointment in database ${this.dbAdapter.toString()}`);

        const dbItem = {
            insured_id: appointment.insuredId,
            country_iso: appointment.countryISO,
            schedule_id: appointment.scheduleId,
            status: appointment.status,
        };
        return this.dbAdapter.save(dbItem);
    }
}
