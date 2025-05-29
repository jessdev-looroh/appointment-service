import { Appointment } from '../../schemas/appointment';

export interface INotificationPublisherAdapter {
    publishNewAppointment(appointment: Appointment): Promise<void>;
}
