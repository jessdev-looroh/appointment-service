import { SNSClient } from '@aws-sdk/client-sns';
import { NotificationPublisherAdapterImpl } from '../../../aws/sns/snsNotificationPublisherAdapter';
import { Logger } from '../../../utils';
import { appointmentMock } from '../../mocks';

jest.mock('@aws-sdk/client-sns', () => {
    const originalModule = jest.requireActual('@aws-sdk/client-sns');
    return {
        ...originalModule,
        SNSClient: jest.fn(),
        PublishCommand: jest.fn(function (input) {
            this.input = input;
        }),
    };
});

describe('Testing NotificationPublisherAdapterImpl class', () => {
    let publisher: NotificationPublisherAdapterImpl;
    let mockLogger: Logger;
    const mockSend = jest.fn();
    const topicArn = 'test-topic-arn';
    const region = 'us-east-2';

    beforeEach(() => {
        mockLogger = {
            info: jest.fn(),
            error: jest.fn(),
        } as unknown as Logger;

        (SNSClient as jest.Mock).mockImplementation(() => ({
            send: mockSend,
        }));

        publisher = new NotificationPublisherAdapterImpl(topicArn, region, mockLogger);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Testing publishNewAppointment method', () => {
        it('should publish message successfully', async () => {
            const mockResponse = {
                MessageId: '123',
                $metadata: {
                    httpStatusCode: 200,
                },
            };
            mockSend.mockResolvedValue(mockResponse);

            await publisher.publishNewAppointment(appointmentMock);

            const callArg = mockSend.mock.calls[0][0];
            expect(callArg.input).toEqual({
                TopicArn: topicArn,
                Message: JSON.stringify(appointmentMock),
                MessageAttributes: {
                    countryISO: {
                        DataType: 'String',
                        StringValue: appointmentMock.countryISO,
                    },
                },
            });

            expect(mockLogger.info).toHaveBeenCalledWith(
                'SNSNotificationPublisherAdapter',
                `Message published successfully: ${JSON.stringify({
                    messageId: mockResponse.MessageId,
                    appointment: appointmentMock,
                })}`,
            );
        });

        it('should throw error when publishing fails', async () => {
            const mockResponse = {
                $metadata: {
                    httpStatusCode: 500,
                },
            };
            mockSend.mockResolvedValue(mockResponse);

            await expect(publisher.publishNewAppointment(appointmentMock)).rejects.toThrow(
                'Failed to publish appointment notification',
            );

            expect(mockLogger.error).toHaveBeenCalledWith(
                'SNSNotificationPublisherAdapter',
                'Failed to publish message. Status code: 500',
            );
        });

        it('should use default region when not specified', () => {
            const defaultPublisher = new NotificationPublisherAdapterImpl(topicArn, undefined, mockLogger);
            expect(defaultPublisher).toBeDefined();
        });
    });
});
