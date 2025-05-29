import { Appointment } from '../interfaces/appointment';

export interface IEventPublisher {
  publishAppointmentCreated(appointment: Appointment): Promise<void>;
}