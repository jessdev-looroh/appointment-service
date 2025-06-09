import { Appointment } from 'shared';

export interface AppointmentRepository {
    create(appointment: Appointment): Promise<boolean>;
}
