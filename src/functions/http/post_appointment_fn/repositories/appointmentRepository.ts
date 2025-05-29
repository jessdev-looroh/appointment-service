import { SaveAdapter } from "../aws/database";
import { Appointment } from "../schemas/appointment";

export class AppointmentRepository {
    constructor(private dbAdapter: SaveAdapter) {}

    async createAppointment(appointment: Appointment) {
        return this.dbAdapter.save(appointment);
    }
}
