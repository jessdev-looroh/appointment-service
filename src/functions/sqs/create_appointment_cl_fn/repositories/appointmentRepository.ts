import { FullDatabaseAdapter, SaveAdapter } from "../aws/database";
import { Appointment } from "../interfaces/appointment";

export class AppointmentRepository {
    constructor(private dbAdapter: SaveAdapter) {}

    async createAppointment(appointment: Appointment) {
        return this.dbAdapter.save(appointment);
    }
}
