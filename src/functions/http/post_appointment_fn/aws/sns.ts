import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';
import { Appointment } from '../schemas/appointment';
const snsClient = new SNSClient({});

const SNS_TOPIC_ARN = process.env.EVENT_NEW_APPOINTMENT_TOPIC ?? '';

if (!SNS_TOPIC_ARN) {
    throw new Error('SNS_TOPIC_ARN is not defined in environment variables');
}

export const publishToNewAppointmentTopic = async (appointment: Appointment) => {
    const command = new PublishCommand({
        TopicArn: SNS_TOPIC_ARN,
        Message: JSON.stringify(appointment),
        MessageAttributes: {
            countryISO: {
                DataType: 'String',
                StringValue: appointment.countryISO,
            },
        },
    });

    const resp = await snsClient.send(command);
    
    console.log('[publishToNewAppointmentTopic]: ', { 
        status: resp.$metadata.httpStatusCode,
        data: appointment,
        filter: {
            countryISO: [appointment.countryISO]
        }
     });
};
