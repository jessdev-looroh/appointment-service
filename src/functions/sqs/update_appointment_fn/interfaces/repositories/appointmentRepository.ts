import { Appointment } from 'shared';

export interface AppointmentRepository {
    update(appointment: Appointment): Promise<boolean>;
}
