import { Appointment } from '../../appointment';

export interface EventPublisher {
    publishAppointmentCreated(appointment: Appointment): Promise<void>;
}
