import { Appointment } from '../../appointment';

export interface NotificationPublisherAdapter {
    publishNewAppointment(appointment: Appointment): Promise<void>;
} 
