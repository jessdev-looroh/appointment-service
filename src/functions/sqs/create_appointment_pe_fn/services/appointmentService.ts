import { Appointment } from '../interfaces/appointment';
import { AppointmentRepository } from '../repositories/appointmentRepository';
import { AppointmentStatus } from '../enums/appointmentStatus';
import { IEventPublisher } from '../interfaces/eventPublisher';

export class AppointmentService {
    constructor(private appointmentRepository: AppointmentRepository, private eventPublisher: IEventPublisher) {}

    createAppointment = async (appointment: Appointment) => {
        appointment.status = AppointmentStatus.COMPLETED;
        const wasCreated = await this.appointmentRepository.createAppointment(appointment);
        if (wasCreated) await this.eventPublisher.publishAppointmentCreated(appointment)
        else console.log('[INFO] (createAppointmentHandler): appointment was not created!');
    };

}
