import { Appointment, AppointmentStatus, EventPublisher, Logger } from 'shared';
import { CountryAppointmentStrategy } from '../interfaces';
import { AppointmentRepositoryImpl } from '../repositories/appointmentRepository';

export class ChileAppointmentStrategy implements CountryAppointmentStrategy {
    constructor(
        private appointmentRepository: AppointmentRepositoryImpl,
        private logger: Logger,
        private eventPublisher: EventPublisher,
    ) {}
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
