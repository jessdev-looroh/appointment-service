import { Appointment } from "../../interfaces/appointment";

export interface IAppointmentRepository {
    updateAppointment(appointment: Appointment): Promise<void>;
}