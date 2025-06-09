import { Appointment, AppointmentStatus, EventPublisher, Logger } from 'shared';
import { CountryAppointmentStrategy } from '../interfaces';
import { AppointmentRepositoryImpl } from '../repositories/appointmentRepository';

/**
 * Class that provides a strategy for creating appointments in Peru
 * @param {AppointmentRepositoryImpl} appointmentRepository - The appointment repository
 * @param {Logger} logger - The logger instance
 * @param {EventPublisher} eventPublisher - The event publisher
 */
export class PeruAppointmentStrategy implements CountryAppointmentStrategy {
    constructor(
        private appointmentRepository: AppointmentRepositoryImpl,
        private logger: Logger,
        private eventPublisher: EventPublisher,
    ) {}

    /**
     * Creates an appointment
     * @param {Appointment} appointment - The appointment to create
     * @returns {Promise<void>}
     */
    async create(appointment: Appointment): Promise<void> {
        this.logger.info('PeruAppointmentStrategy', `Creating appointment in Peru`);
        appointment.status = AppointmentStatus.COMPLETED;
        const wasCreated = await this.appointmentRepository.create(appointment);
        this.logger.info('PeruAppointmentStrategy', `Appointment created: ${wasCreated ? 'Success' : 'Failed'}`);
        if (wasCreated) {
            await this.eventPublisher.publishAppointmentCreated(appointment);
        }
    }
}
