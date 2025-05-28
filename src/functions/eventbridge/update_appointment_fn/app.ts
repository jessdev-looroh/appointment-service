import { EventBridgeEvent } from 'aws-lambda';
import * as dynamoService from './aws/dynamo';
import { Appointment } from './interfaces/appointment';

export const updateAppointmentHandler = async (
    event: EventBridgeEvent<'appointment.created', Appointment>,
): Promise<void> => {
    const appointment = event.detail;
    await dynamoService.updateAppointmentStatus(appointment);
};
