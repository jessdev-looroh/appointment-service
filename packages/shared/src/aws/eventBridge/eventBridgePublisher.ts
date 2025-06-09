import { EventBridgeClient, PutEventsCommand, PutEventsCommandInput } from '@aws-sdk/client-eventbridge';

import { Logger } from '../../utils';
import { Appointment, EventPublisher } from '../../interfaces';

/**
 * Class that provides an adapter pattern implementation for EventBridge operations
 * @implements {EventPublisher}
 */
export class EventBridgePublisher implements EventPublisher {
    private client: EventBridgeClient;
    private eventBusName: string;
    private source: string;
    private logger: Logger;

    constructor(source: string, logger: Logger, eventBusName: string = 'default') {
        this.client = new EventBridgeClient({});
        this.eventBusName = eventBusName;
        this.source = source;
        this.logger = logger;
    }

    /**
     * Publishes an appointment created event to EventBridge
     * @param {Appointment} appointment - The appointment to publish
     * @returns {Promise<void>}
     */
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
        const result = await this.client.send(command);

        if (result.FailedEntryCount && result.FailedEntryCount > 0) {
            this.logger.error('EventBridgePublisher', `Failed to publish ${result.FailedEntryCount} events`);
        }

        this.logger.info('EventBridgePublisher', `Events published successfully: ${result.Entries?.length} events`);
    }
}
