import { Appointment, AppointmentStatus, EventPublisher, Logger } from 'shared';
import { AppointmentRepository, CountryAppointmentStrategy } from '../interfaces';

/**
 * Class that provides a strategy for creating appointments in Chile
 * @param {AppointmentRepository} appointmentRepository - The appointment repository
 * @param {Logger} logger - The logger instance
 * @param {EventPublisher} eventPublisher - The event publisher
 */
export class ChileAppointmentStrategy implements CountryAppointmentStrategy {
    constructor(
        private appointmentRepository: AppointmentRepository,
        private logger: Logger,
        private eventPublisher: EventPublisher,
    ) {}

    /**
     * Creates an appointment
     * @param {Appointment} appointment - The appointment to create
     * @returns {Promise<void>}
     */
    async create(appointment: Appointment): Promise<void> {
        this.logger.info('ChileAppointmentStrategy', `Creating appointment in Chile`);
        appointment.status = AppointmentStatus.COMPLETED;
        const wasCreated = await this.appointmentRepository.create(appointment);
        this.logger.info('ChileAppointmentStrategy', `Appointment created: ${wasCreated ? 'Success' : 'Failed'}`);
        if (wasCreated) {
            await this.eventPublisher.publishAppointmentCreated(appointment);
        }
    }
}
