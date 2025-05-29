// src/adapters/eventbridgePublisher.ts
import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsCommandInput,
} from '@aws-sdk/client-eventbridge';
import { Appointment } from '../interfaces/appointment';
import { IEventPublisher } from '../interfaces/eventPublisher';

export class EventBridgePublisher implements IEventPublisher {
  private client: EventBridgeClient;
  private eventBusName: string;
  private source: string;

  constructor(source: string, eventBusName: string = 'default') {
    this.client = new EventBridgeClient({});
    this.eventBusName = eventBusName;
    this.source = source;
  }

  async publishAppointmentCreated(appointment: Appointment): Promise<void> {
    const entry: PutEventsCommandInput = {
      Entries: [
        {
          Source: this.source,
          DetailType: 'appointment.created',
          Detail: JSON.stringify(appointment),
          EventBusName: this.eventBusName,
        },
      ],
    };

    const command = new PutEventsCommand(entry);

    try {
      const result = await this.client.send(command);
      console.log('[EventBridge] Evento enviado:', JSON.stringify(result));
    } catch (error) {
      console.error('[ERROR] (publishAppointmentCreated):', error);
    }
  }
}

