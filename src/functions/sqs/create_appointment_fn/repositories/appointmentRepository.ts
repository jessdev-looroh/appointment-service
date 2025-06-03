import { Appointment, Logger, Save } from 'shared';
import { AppointmentRepository } from '../interfaces/appointmentRepository';

export class AppointmentRepositoryImpl implements AppointmentRepository {
    constructor(private dbAdapter: Save, private logger: Logger) {}

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
