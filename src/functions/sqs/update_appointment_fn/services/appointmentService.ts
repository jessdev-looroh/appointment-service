import { Appointment, AppointmentStatus, Logger } from 'shared';
import { AppointmentRepository } from '../interfaces';

/**
 * Class that provides a service for appointment operations
 * @param {AppointmentRepository} appointmentRepository - The appointment repository
 * @param {Logger} logger - The logger instance
 */
export class AppointmentService {
    constructor(private appointmentRepository: AppointmentRepository, private logger: Logger) {}

    /**
     * Updates an appointment
     * @param {Appointment} appointment - The appointment to update
     * @returns {Promise<void>}
     */
    update = async (appointment: Appointment): Promise<void> => {
        this.logger.info('AppointmentService', `Updating appointment`);
        appointment.status = AppointmentStatus.COMPLETED;
        this.logger.info('AppointmentService', `status changed to ${appointment.status}`);
        const result = await this.appointmentRepository.update(appointment);
        this.logger.info('AppointmentService', `Updated appointment: ${result ? 'Success' : 'Failed'}`);
    };
}
