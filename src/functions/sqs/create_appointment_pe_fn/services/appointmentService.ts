import { Appointment } from '../interfaces/appointment';
import { AppointmentRepository } from '../repositories/appointmentRepository';
import * as eventBridge from '../aws/eventbridge';
import { AppointmentStatus } from '../enums/appointmentStatus';

export class AppointmentService {
    constructor(private appointmentRepository: AppointmentRepository) {}

    createAppointment = async (appointment: Appointment) => {
        appointment.status = AppointmentStatus.COMPLETED;
        return await this.appointmentRepository.createAppointment(appointment);
    };

    emitAppointmentCreated = async (appointment: Appointment) => {
        await eventBridge.emitAppointmentCreated(appointment);
    };
}
