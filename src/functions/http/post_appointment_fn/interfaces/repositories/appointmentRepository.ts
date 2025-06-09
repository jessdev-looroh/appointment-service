import { Appointment } from "../../schemas/appointment";

export interface AppointmentRepository {
    save(appointment: Appointment): Promise<boolean>;
}
