// src/utils/eventbridge.ts
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { Appointment } from '../interfaces/appointment';

const eventBridgeClient = new EventBridgeClient({});
const SOURCE = process.env.SOURCE;

export const emitAppointmentCreated = async (appointment: Appointment): Promise<void> => {
    const command = new PutEventsCommand({
        Entries: [
            {
                Source: SOURCE,
                DetailType: 'appointment.created',
                Detail: JSON.stringify(appointment),
                EventBusName: 'default',
            },
        ],
    });

    try {
        const result = await eventBridgeClient.send(command);
        console.log('Evento enviado correctamente a EventBridge:', JSON.stringify(result));
    } catch (error) {
        console.error('[ERROR] (emitAppointmentCreated):', error);
    }
};
