import { DynamoDBAdapter } from '../../../aws/database';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Appointment } from '../../../schemas/appointment';
import { beforeEach, describe, expect, test } from '@jest/globals';

const ddbMock = mockClient(DynamoDBClient);

describe('Testing DynamoDBAdapter class', () => {
    const tableName = 'AppointmentsTableMock';
    let adapter: DynamoDBAdapter;

    beforeEach(() => {
        adapter = new DynamoDBAdapter(tableName);
        ddbMock.reset();
    });

    describe('Testing save method', () => {
        const appointment: Appointment = {
            insuredId: '123',
            scheduleId: 456,
            countryISO: 'PE',
        };

        test('should return true on successful save', async () => {
            ddbMock.on(PutItemCommand).resolves({ $metadata: { httpStatusCode: 200 } });
            const result = await adapter.save(appointment);
            expect(result).toBe(true);
        });

        test('should throw error on failure', async () => {
            ddbMock.on(PutItemCommand).rejects(new Error('PutItem error'));
            await expect(adapter.save(appointment)).rejects.toThrow('PutItem error');
        });
    });
});
