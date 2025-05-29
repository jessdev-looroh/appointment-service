import { IUpdateAdapter } from '../aws/database';
import { IAppointmentRepository } from '../interfaces/repositories/appointmentRepository';
import { Appointment } from '../interfaces/appointment';

export class AppointmentRepository implements IAppointmentRepository {
    constructor(private dbAdapter: IUpdateAdapter) {}

    updateAppointment = async (appointment: Appointment) => {
        return this.dbAdapter.update(appointment);
    };
}
