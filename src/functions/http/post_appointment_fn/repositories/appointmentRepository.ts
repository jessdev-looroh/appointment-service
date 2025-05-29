import { ISaveAdapter } from "../aws/database";
import { IAppointmentRepository } from "../interfaces/repositories/appointmentRepository";
import { Appointment } from "../schemas/appointment";

export class AppointmentRepository implements IAppointmentRepository{
    constructor(private dbAdapter: ISaveAdapter) {}

    async createAppointment(appointment: Appointment) {
        return this.dbAdapter.save(appointment);
    }
}
