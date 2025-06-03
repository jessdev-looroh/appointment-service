import { AppointmentRepository } from '../repositories/appointmentRepository';
import { Logger, Response, StatusCodeEnum, StatusTextEnum } from 'shared';

export class AppointmentService {
    constructor(private appointmentRepository: AppointmentRepository, private logger: Logger) {}

    async getAppointmentsByInsuredId(insuredId: string) {
        this.logger.info('AppointmentService', `Getting appointments by insuredId = ${insuredId}`);
        const appointments = await this.appointmentRepository.getAppointmentsByInsuredId(insuredId);
        this.logger.info('AppointmentService', `Appointments found : [${appointments.length}]`);

        const code = StatusCodeEnum.OK;
        const appointmentResponse: Response = {
            statusCode: code,
            statusText: StatusTextEnum[code],
            data: appointments,
            error: {},
        };
        return appointmentResponse;
    } 
}
