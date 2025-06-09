import { Appointment, NotificationPublisherAdapter } from '../../interfaces';
import { Logger } from '../../utils';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

/**
 * Class that provides an adapter pattern implementation for SNS operations
 * @implements {NotificationPublisherAdapter}
 */
export class NotificationPublisherAdapterImpl implements NotificationPublisherAdapter {
    private client: SNSClient;
    private topicArn: string;
    private logger: Logger;

    constructor(topicArn: string, region: string = 'us-east-2', logger: Logger) {
        this.client = new SNSClient({ region });
        this.topicArn = topicArn;
        this.logger = logger;
    }

    /**
     * Publishes a new appointment notification
     * @param {Appointment} appointment - The appointment to publish
     * @returns {Promise<void>}
     */
    async publishNewAppointment(appointment: Appointment): Promise<void> {
        const command = new PublishCommand({
            TopicArn: this.topicArn,
            Message: JSON.stringify(appointment),
            MessageAttributes: {
                countryISO: {
                    DataType: 'String',
                    StringValue: appointment.countryISO,
                },
            },
        });

        const response = await this.client.send(command);

        const statusCode = response.$metadata.httpStatusCode;

        if (statusCode !== 200) {
            this.logger.error(
                'SNSNotificationPublisherAdapter',
                `Failed to publish message. Status code: ${statusCode}`,
            );
            throw new Error('Failed to publish appointment notification');
        }

        this.logger.info(
            'SNSNotificationPublisherAdapter',
            `Message published successfully: ${JSON.stringify({
                messageId: response.MessageId,
                appointment,
            })}`,
        );
    }
}
