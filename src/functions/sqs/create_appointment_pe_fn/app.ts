import { SQSEvent } from 'aws-lambda';
import { Appointment } from './interfaces/appointment';
import { createAppointmentService } from './container';

const appointmentService = createAppointmentService();
export const createAppointmentHandler = async (event: SQSEvent): Promise<void> => {
    try {
        for (const record of event.Records) {
            const body = JSON.parse(record.body);

            const appointment: Appointment = JSON.parse(body.Message);
            await appointmentService.createAppointment(appointment);
        }
    } catch (err) {
        console.error('[ERROR] (createAppointmentHandler): ', err);
    }
};
