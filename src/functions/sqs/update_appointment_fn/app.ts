import { SQSEvent } from 'aws-lambda';
import { Appointment } from './interfaces/appointment';
import { AppointmentStatus } from './enums/appointmentStatus';
import { createAppointmentService } from './container';

export const updateAppointmentHandler = async (event: SQSEvent): Promise<void> => {
    try {
        for (const record of event.Records) {
            const body = JSON.parse(record.body);
            const appointmentService = createAppointmentService();
            const appointment: Appointment = body.detail;

            await appointmentService.updateAppointmentStatus(appointment);
        }
    } catch (err) {
        console.error('[ERROR] (updateAppointmentHandler): ', err);
    }
};
