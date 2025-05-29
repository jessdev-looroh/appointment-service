import { mockClient } from 'aws-sdk-client-mock';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { SNSNotificationPublisherAdapter } from '../../aws/snsNotificationPublisherAdapter';
import { Appointment } from '../../schemas/appointment';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const snsMock = mockClient(SNSClient);

describe('Testing SNSNotificationPublisherAdapter class', () => {
    const topicArn = 'arn:aws:sns:us-east-2:123456789012:MyTopicMock';
    let adapter: SNSNotificationPublisherAdapter;

    beforeEach(() => {
        snsMock.reset();
        adapter = new SNSNotificationPublisherAdapter(topicArn);
    });

    const mockAppointment: Appointment = {
        insuredId: 'insured-001',
        scheduleId: 42,
        countryISO: 'PE',
    };

    test('should call SNS publish with correct input', async () => {
        snsMock.on(PublishCommand).resolves({
            $metadata: { httpStatusCode: 200 },
            MessageId: 'mock-message-id',
        });

        await adapter.publishNewAppointment(mockAppointment);

        expect(snsMock.calls()).toHaveLength(1);

        const callArgs = snsMock.call(0).args[0].input as PublishCommand['input'];
        expect(callArgs.TopicArn).toBe(topicArn);
        expect(callArgs.Message).toBe(JSON.stringify(mockAppointment));
        expect(callArgs.MessageAttributes?.countryISO.StringValue).toBe('PE');
    });

    test('should log the published message info', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        snsMock.on(PublishCommand).resolves({
            $metadata: { httpStatusCode: 200 },
            MessageId: 'mock-message-id',
        });

        await adapter.publishNewAppointment(mockAppointment);

        expect(consoleSpy).toHaveBeenCalledWith(
            '[SNS] Message published:',
            expect.objectContaining({
                status: 200,
                appointment: mockAppointment,
                filter: { countryISO: ['PE'] },
            }),
        );

        consoleSpy.mockRestore();
    });
});
