import { DynamoDBAdapter } from '../../../aws/database/dynamoDBAdapter';
import * as DynamoDBClientModule from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { newAppointmentMock } from '../../mocks/newAppointment.mock';

jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/util-dynamodb');

const mockSend = DynamoDBClientModule.DynamoDBClient.prototype.send as jest.MockedFunction<any>;
const mockUnmarshall = unmarshall as jest.MockedFunction<any>;

describe('Testing DynamoDBAdapter class', () => {
    const tableName = 'TestTable';
    const region = 'us-test-2';
    let adapter: DynamoDBAdapter;

    beforeEach(() => {
        adapter = new DynamoDBAdapter(tableName, region);
        jest.clearAllMocks();
    });

    describe('Testing save method', () => {
        let putItemSpy: jest.SpyInstance;

        beforeEach(() => {
            putItemSpy = jest.spyOn(DynamoDBClientModule, 'PutItemCommand');
        });

        afterEach(() => {
            putItemSpy.mockRestore();
        });

        it('should save an item successfully', async () => {
            mockSend.mockResolvedValue({ $metadata: { httpStatusCode: 200 } });
            const result = await adapter.save(newAppointmentMock);
            expect(putItemSpy).toHaveBeenCalledWith({
                TableName: tableName,
                Item: {
                    insuredId: { S: '00001' },
                    scheduleId: { N: '100' },
                    countryISO: { S: 'PE' },
                    status: { S: 'pending' },
                },
            });
            expect(result).toBe(true);
        });

        it('should save an item with condition expression', async () => {
            mockSend.mockResolvedValue({ $metadata: { httpStatusCode: 200 } });
            const condition = 'attribute_not_exists(insuredId)';
            const result = await adapter.save(newAppointmentMock, condition);
            expect(putItemSpy).toHaveBeenCalledWith({
                TableName: tableName,
                Item: {
                    insuredId: { S: '00001' },
                    scheduleId: { N: '100' },
                    countryISO: { S: 'PE' },
                    status: { S: 'pending' },
                },
                ConditionExpression: condition,
            });
            expect(result).toBe(true);
        });

        it('should return false if httpStatusCode is not 200', async () => {
            mockSend.mockResolvedValue({ $metadata: { httpStatusCode: 400 } });
            const result = await adapter.save(newAppointmentMock);
            expect(result).toBe(false);
        });
    });

    xdescribe('getAllById', () => {
        /**
         * Should return items when found
         */
        it('should return items when found', async () => {
            const items = [{ id: { S: '1' }, name: { S: 'Test' } }];
            mockSend.mockResolvedValue({ Count: 1, Items: items });
            mockUnmarshall.mockReturnValue({ id: '1', name: 'Test' });
            const result = await adapter.getAllById('id', '1');
            expect(result).toEqual([{ id: '1', name: 'Test' }]);
        });

        /**
         * Should delete specified fields from items
         */
        it('should delete specified fields from items', async () => {
            const items = [{ id: { S: '1' }, name: { S: 'Test' }, secret: { S: 'hidden' } }];
            mockSend.mockResolvedValue({ Count: 1, Items: items });
            mockUnmarshall.mockReturnValue({ id: '1', name: 'Test', secret: 'hidden' });
            const result = await adapter.getAllById('id', '1', ['secret']);
            expect(result).toEqual([{ id: '1', name: 'Test' }]);
        });

        /**
         * Should return empty array if no items found
         */
        it('should return empty array if no items found', async () => {
            mockSend.mockResolvedValue({ Count: 0 });
            const result = await adapter.getAllById('id', '1');
            expect(result).toEqual([]);
        });

        /**
         * Should throw error on failure
         */
        it('should throw error on failure', async () => {
            mockSend.mockRejectedValue(new Error('Dynamo error'));
            await expect(adapter.getAllById('id', '1')).rejects.toThrow('Dynamo error');
        });
    });

    describe('Testing update method', () => {
        it('should update item successfully', async () => {
            mockSend.mockResolvedValue({ $metadata: { httpStatusCode: 200 } });
            const fields = {
                appointmentStatus: 'completed',
            };
            const keys = {
                PK: `INSURED#00001`,
                SK: `SCHEDULE#100`,
            };
            const result = await adapter.update(fields, keys);
            expect(result).toBe(true);
            expect(mockSend).toHaveBeenCalledWith(expect.any(DynamoDBClientModule.UpdateItemCommand));
        });

        it('should return false if httpStatusCode is not 200', async () => {
            mockSend.mockResolvedValue({ $metadata: { httpStatusCode: 400 } });
            const fields = {
                appointmentStatus: 'completed',
            };
            const keys = {
                PK: `INSURED#00001`,
                SK: `SCHEDULE#100`,
            };
            const result = await adapter.update(fields, keys);
            expect(result).toBe(false);
        });
    });

    describe('Testing convertToAttributeValue (private) method', () => {
        /**
         * This test covers the private method convertToAttributeValue indirectly
         * by calling the public methods that use it. For direct testing, we use casting.
         */
        it('should convert string and number fields correctly', () => {
            const result = adapter['convertToAttributeValue'](newAppointmentMock);
            expect(result).toEqual({
                insuredId: { S: '00001' },
                scheduleId: { N: '100' },
                countryISO: { S: 'PE' },
                status: { S: 'pending' },
            });
        });

        it('should handle empty object', () => {
            const result = adapter['convertToAttributeValue']({});
            expect(result).toEqual({});
        });

        it('should convert multiple types (string, number) in one object', () => {
            const result = adapter['convertToAttributeValue'](newAppointmentMock);
            expect(result).toEqual({
                insuredId: { S: '00001' },
                scheduleId: { N: '100' },
                countryISO: { S: 'PE' },
                status: { S: 'pending' },
            });
        });
    });

    describe('Testing toString method', () => {
        it('should return the adapter name', () => {
            expect(adapter.toString()).toBe('DynamoDB');
        });
    });
});
