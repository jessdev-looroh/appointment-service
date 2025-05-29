import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';
import { Appointment } from '../schemas/appointment';
import { INotificationPublisherAdapter } from '../interfaces/infrastructure/INotificationPublicherAdapter';


export class SNSNotificationPublisherAdapter implements INotificationPublisherAdapter {
    private client: SNSClient;
    private topicArn: string;

    constructor(topicArn: string, region: string = 'us-east-2') {
        this.client = new SNSClient({ region });
        this.topicArn = topicArn;
    }

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

        const resp = await this.client.send(command);

        console.log('[SNS] Message published:', {
            status: resp.$metadata.httpStatusCode,
            appointment,
            filter: {
                countryISO: [appointment.countryISO],
            },
        });
    }
}
