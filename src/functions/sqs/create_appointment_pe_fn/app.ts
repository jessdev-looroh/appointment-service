import { SQSEvent } from 'aws-lambda';
import { Appointment } from './interfaces/appointment';
import * as mysqlService from './aws/mysql';
import { AppointmentStatus } from './enums/appointmentStatus';
import * as eventBridge from './aws/eventbridge';
export const createAppointmentHandler = async (event: SQSEvent): Promise<void> => {
    try {
        for (const record of event.Records) {
            const body = JSON.parse(record.body);
            
            const appointment: Appointment = JSON.parse(body.Message);

            appointment.status = AppointmentStatus.COMPLETED;

            const wasCreated = await mysqlService.createAppointment(appointment);
            if (wasCreated) await eventBridge.emitAppointmentCreated(appointment);
            else console.log('[INFO] (createAppointmentHandler): appointment was not created!');
        }
    } catch (err: unknown) {
        console.error(err);
    }
};
