
import { AppointmentRepository } from '../repositories/appointmentRepository';
import { StatusCodeEnum } from '../enums/statusCode';
import { StatusTextEnum } from '../enums/statusText';
import { Response } from '../interfaces/response/response';


export class AppointmentService {
    constructor(private appointmentRepository: AppointmentRepository) {}

    getAppointmentsByInsuredId = async (insuredId: string) => {
        const appointments = await this.appointmentRepository.getAppointmentsByInsuredId(insuredId);
        const appointmentResponse: Response = {
            statusCode: StatusCodeEnum.OK,
            statusText: StatusTextEnum.OK,
            data: appointments,
            error: {},
        };
        return appointmentResponse;
    };
    
}
