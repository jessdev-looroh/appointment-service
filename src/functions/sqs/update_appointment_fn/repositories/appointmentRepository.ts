import { Appointment, Logger, Update } from 'shared'; 
import { AppointmentRepository } from '../interfaces';


export class AppointmentRepositoryImpl implements AppointmentRepository {
    constructor(private dbAdapter: Update, private logger: Logger) {}
    async update(appointment: Appointment): Promise<boolean> {
        this.logger.info('AppointmentRepositoryImpl', `Updating appointment in ${this.dbAdapter.toString()}`);

        const fields = {
            appointmentStatus: appointment.status,
        }
        const keys = {
            PK: `INSURED#${appointment.insuredId}`,
            SK: `SCHEDULE#${appointment.scheduleId}`,
        }   
        return await this.dbAdapter.update(fields, keys);
    }
}
