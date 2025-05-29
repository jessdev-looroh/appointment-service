import { Appointment } from "../../schemas/appointment";

export interface IAppointmentRepository {
    createAppointment(appointment: Appointment): Promise<boolean>;
}