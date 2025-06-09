import { AppointmentRepository } from '../repositories/appointmentRepository';
import { Logger, Response, StatusCodeEnum, StatusTextEnum } from 'shared';

/**
 * Class that provides a service for appointment operations
 * @param {AppointmentRepository} appointmentRepository - The appointment repository
 * @param {Logger} logger - The logger instance
 */
export class AppointmentService {
    constructor(private appointmentRepository: AppointmentRepository, private logger: Logger) {}

    /**
     * Gets appointments by insured id
     * @param {string} insuredId - The insured id
     * @returns {Promise<Response>} The response
     */
    async getAppointmentsByInsuredId(insuredId: string): Promise<Response> {
        this.logger.info('AppointmentService', `Getting appointments by insuredId = ${insuredId}`);
        const appointments = await this.appointmentRepository.getAppointmentsByInsuredId(insuredId);
        this.logger.info('AppointmentService', `Appointments found : [${appointments.length}]`);

        const code = StatusCodeEnum.OK;
        const appointmentResponse: Response = {
            statusCode: code,
            statusText: StatusTextEnum[code],
            data: appointments,
            error: {},
            message: 'Appointments fetched successfully',
        };
        return appointmentResponse;
    }
}
