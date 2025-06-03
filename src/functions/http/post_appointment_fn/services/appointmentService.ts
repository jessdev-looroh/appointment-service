import { Appointment } from '../schemas/appointment';

import { AppointmentRepository } from '../interfaces';
import { NotificationPublisherAdapter, Logger, Response, StatusCodeEnum, StatusTextEnum } from 'shared';

export class AppointmentService {
    constructor(
        private appointmentRepository: AppointmentRepository,
        private notificationPublisher: NotificationPublisherAdapter,
        private logger: Logger,
    ) {}

    createAppointment = async (appointment: Appointment) => {
        this.logger.info('AppointmentService', `Creating appointment`);

        this.logger.info('AppointmentService', `Appointment: ${JSON.stringify(appointment)}`);
        const wasCreated = await this.appointmentRepository.save(appointment);

        this.logger.info('AppointmentService', `Appointment created: ${wasCreated ? 'Success' : 'Failed'}`);

        if (wasCreated) {
            await this.notificationPublisher.publishNewAppointment(appointment);
        }

        const code = wasCreated ? StatusCodeEnum.CREATED : StatusCodeEnum.INTERNAL;
        const appointmentResponse: Response = {
            statusCode: code,
            statusText: StatusTextEnum[code],
            data: wasCreated ? [appointment] : [],
            message: wasCreated ? 'El agendamiento está en proceso' : 'Ocurrió un error al registrar',
            error: {},
        };

        return appointmentResponse;
    };
}
