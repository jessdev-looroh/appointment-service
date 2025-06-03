import { Appointment, AppointmentStatus, Logger } from 'shared';
import { AppointmentRepository } from '../interfaces';

export class AppointmentService {
    constructor(private appointmentRepository: AppointmentRepository, private logger: Logger) {}

    update = async (appointment: Appointment) : Promise<void> => {
        this.logger.info('AppointmentService', `Updating appointment`);
        appointment.status = AppointmentStatus.COMPLETED;
        this.logger.info('AppointmentService', `status changed to ${appointment.status}`);
        const result = await this.appointmentRepository.update(appointment);
        this.logger.info('AppointmentService', `Updated appointment: ${result ? 'Success' : 'Failed'}`);
    };
}
