import { SQSEvent } from 'aws-lambda';
import { Appointment } from './interfaces/appointment';
import { createAppointmentService } from './container';

const appointmentService = createAppointmentService();
export const createAppointmentHandler = async (event: SQSEvent): Promise<void> => {
    try {
        for (const record of event.Records) {
            const body = JSON.parse(record.body);
            
            const appointment: Appointment = JSON.parse(body.Message);
            const wasCreated = await appointmentService.createAppointment(appointment);
            if (wasCreated) await appointmentService.emitAppointmentCreated(appointment);
            else console.log('[INFO] (createAppointmentHandler): appointment was not created!');
        }
    } catch (err) {
        console.error('[ERROR] (createAppointmentHandler): ', err);
    }
};
