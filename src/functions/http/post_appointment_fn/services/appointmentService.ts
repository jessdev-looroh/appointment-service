import { Appointment } from '../schemas/appointment';
import { AppointmentRepository } from '../repositories/appointmentRepository';
import { StatusCodeEnum } from '../enums/statusCode';
import { StatusTextEnum } from '../enums/statusText';
import { Response } from '../interfaces/response/response';
import * as SNS from '../aws/sns';

export class AppointmentService {
    constructor(private appointmentRepository: AppointmentRepository) {}

    createAppointment = async (appointment: Appointment) => {
        const wasCreated = await this.appointmentRepository.createAppointment(appointment);

        const appointmentResponse: Response = {
            statusCode: wasCreated ? StatusCodeEnum.CREATED : StatusCodeEnum.INTERNAL,
            statusText: wasCreated ? StatusTextEnum.CREATED : StatusTextEnum.INTERNAL,
            data: wasCreated ? [appointment] : [],
            message: wasCreated ? 'El agendamiento está en proceso' : 'Ocurrió un error al registrar',
            error: {},
        };

        return appointmentResponse;
    };

    publishToNewAppointmentTopic = async (appointment: Appointment) => {
        await SNS.publishToNewAppointmentTopic(appointment);
    };
    
}
