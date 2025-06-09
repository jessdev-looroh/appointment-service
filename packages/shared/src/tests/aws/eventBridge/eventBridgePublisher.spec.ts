import { EventBridgePublisher } from '../../../aws/eventBridge/eventBridgePublisher';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { Logger } from '../../../utils';
import { appointmentMock } from '../../mocks';

jest.mock('@aws-sdk/client-eventbridge', () => {
    const originalModule = jest.requireActual('@aws-sdk/client-eventbridge');
    return {
        ...originalModule,
        EventBridgeClient: jest.fn(),
        PutEventsCommand: jest.fn(function (input) {
            this.input = input;
        }),
    };
});

describe('Testing EventBridgePublisher class', () => {
    let publisher: EventBridgePublisher;
    let mockLogger: Logger;
    const mockSend = jest.fn();

    beforeEach(() => {
        mockLogger = {
            info: jest.fn(),
            error: jest.fn(),
        } as unknown as Logger;

        (EventBridgeClient as jest.Mock).mockImplementation(() => ({
            send: mockSend,
        }));

        publisher = new EventBridgePublisher('test-source', mockLogger, 'test-bus');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Testing publishAppointmentCreated method', () => {
        it('should publish event successfully', async () => {
            const mockResponse = {
                FailedEntryCount: 0,
                Entries: [{ EventId: '123' }],
            };
            mockSend.mockResolvedValue(mockResponse);

            await publisher.publishAppointmentCreated(appointmentMock);

            const callArg = mockSend.mock.calls[0][0];
            expect(callArg.input).toEqual({
                Entries: [
                    {
                        Source: 'test-source',
                        DetailType: 'appointment.created',
                        Detail: JSON.stringify(appointmentMock),
                        EventBusName: 'test-bus',
                    },
                ],
            });
            expect(mockLogger.info).toHaveBeenCalledWith(
                'EventBridgePublisher',
                'Events published successfully: 1 events',
            );
        });

        it('should log error when event publishing fails', async () => {
            const mockResponse = {
                FailedEntryCount: 1,
                Entries: [],
            };
            mockSend.mockResolvedValue(mockResponse);

            await publisher.publishAppointmentCreated(appointmentMock);

            expect(mockLogger.error).toHaveBeenCalledWith('EventBridgePublisher', 'Failed to publish 1 events');
        });

        it('should use default event bus when not specified', () => {
            const defaultPublisher = new EventBridgePublisher('test-source', mockLogger);
            expect(defaultPublisher).toBeDefined();
        });

        it('should handle empty entries response', async () => {
            const mockResponse = {
                FailedEntryCount: 0,
                Entries: undefined,
            };
            mockSend.mockResolvedValue(mockResponse);

            await publisher.publishAppointmentCreated(appointmentMock);

            expect(mockLogger.info).toHaveBeenCalledWith(
                'EventBridgePublisher',
                'Events published successfully: undefined events',
            );
        });
    });
});
