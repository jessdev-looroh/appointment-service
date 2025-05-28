import { SQSEvent } from 'aws-lambda';
import { Appointment } from './interfaces/appointment';
import { AppointmentStatus } from './enums/appointmentStatus';
import * as dynamoService from './aws/dynamo';

export const updateAppointmentHandler = async (event: SQSEvent): Promise<void> => {
    try {
        for (const record of event.Records) {
            const body = JSON.parse(record.body);
            
            const appointment: Appointment = body.detail;

            appointment.status = AppointmentStatus.COMPLETED;
            
            await dynamoService.updateAppointmentStatus(appointment);
        }
    } catch (err) {
        console.error('[ERROR] (updateAppointmentHandler): ', err);
    }
};
