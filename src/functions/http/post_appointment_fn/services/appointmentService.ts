import { Appointment } from '../schemas/appointment';
import { StatusTextEnum, StatusCodeEnum } from '../enums';
import { IAppointmentRepository, INotificationPublisherAdapter, Response } from '../interfaces';

export class AppointmentService {
    constructor(
        private appointmentRepository: IAppointmentRepository,
        private notificationPublisher: INotificationPublisherAdapter,
    ) {}

    createAppointment = async (appointment: Appointment) => {
        const wasCreated = await this.appointmentRepository.createAppointment(appointment);

        if (wasCreated) {
            await this.notificationPublisher.publishNewAppointment(appointment);
        }

        const appointmentResponse: Response = {
            statusCode: wasCreated ? StatusCodeEnum.CREATED : StatusCodeEnum.INTERNAL,
            statusText: wasCreated ? StatusTextEnum.CREATED : StatusTextEnum.INTERNAL,
            data: wasCreated ? [appointment] : [],
            message: wasCreated ? 'El agendamiento está en proceso' : 'Ocurrió un error al registrar',
            error: {},
        };

        return appointmentResponse;
    };

}
