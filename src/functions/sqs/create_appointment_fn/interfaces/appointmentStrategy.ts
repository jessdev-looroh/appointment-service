import { Appointment } from 'shared';

export interface CountryAppointmentStrategy {
    create(appointment: Appointment): Promise<void>;
}
