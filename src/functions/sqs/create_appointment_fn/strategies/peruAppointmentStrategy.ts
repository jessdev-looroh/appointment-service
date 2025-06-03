import { Appointment, AppointmentStatus, EventPublisher, Logger } from 'shared';
import { CountryAppointmentStrategy } from '../interfaces';
import { AppointmentRepositoryImpl } from '../repositories/appointmentRepository';

export class PeruAppointmentStrategy implements CountryAppointmentStrategy {
    constructor(
        private appointmentRepository: AppointmentRepositoryImpl,
        private logger: Logger,
        private eventPublisher: EventPublisher,
    ) {}

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
