import { AppointmentStatus } from '../enums/appointmentStatus';
import { Appointment } from '../interfaces/appointment';
import { IAppointmentRepository } from '../interfaces/repositories';

export class AppointmentService {
    constructor(
        private appointmentRepository: IAppointmentRepository,
    ) {}

    updateAppointmentStatus = async (appointment: Appointment) => {
        appointment.status = AppointmentStatus.COMPLETED;
        await this.appointmentRepository.updateAppointment(appointment);
    };
}
