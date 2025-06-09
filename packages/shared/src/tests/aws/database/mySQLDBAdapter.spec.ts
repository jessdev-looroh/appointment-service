import { MySQLAdapter } from '../../../aws/database/mySQLDBAdapter';
import mysql from 'serverless-mysql';
import { newAppointmentMock, appointmentMock } from '../../mocks';

jest.mock('serverless-mysql');

const mockQuery = jest.fn();
const mockEnd = jest.fn();

(mysql as unknown as jest.Mock).mockReturnValue({
    query: mockQuery,
    end: mockEnd,
});

describe('Testing MySQLAdapter class', () => {
    const tableName = 'appointments';
    const config = {
        host: 'localhost',
        user: 'test',
        password: 'test',
        database: 'test_db',
    };
    let adapter: MySQLAdapter;

    beforeEach(() => {
        adapter = new MySQLAdapter(tableName, config);
        jest.clearAllMocks();
    });

    describe('Testing save method', () => {
        it('should save data successfully', async () => {
            mockQuery.mockResolvedValue({ affectedRows: 1 });
            mockEnd.mockResolvedValue(undefined);

            const result = await adapter.save(newAppointmentMock);

            expect(mockQuery).toHaveBeenCalledWith('INSERT INTO `appointments` SET ?', newAppointmentMock);
            expect(mockEnd).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should return false when no rows affected', async () => {
            mockQuery.mockResolvedValue({ affectedRows: 0 });
            mockEnd.mockResolvedValue(undefined);

            const result = await adapter.save(newAppointmentMock);

            expect(result).toBe(false);
        });

        it('should close connection after save operation', async () => {
            mockQuery.mockResolvedValue({ affectedRows: 1 });
            mockEnd.mockResolvedValue(undefined);

            await adapter.save(newAppointmentMock);

            expect(mockEnd).toHaveBeenCalled();
        });
    });

    describe('Testing getAllById method', () => {
        it('should return items when found', async () => {
            const mockItems = [appointmentMock];
            mockQuery.mockResolvedValue(mockItems);

            const result = await adapter.getAllById('insuredId', '00001');

            expect(mockQuery).toHaveBeenCalledWith('select * from appointments where insuredId = ?', ['00001']);
            expect(result).toEqual(mockItems);
        });

        it('should delete specified fields from items', async () => {
            const mockItemWithFields = { ...appointmentMock, fieldToDelete: 'value' };
            mockQuery.mockResolvedValue([mockItemWithFields]);

            const result = await adapter.getAllById('insuredId', '00001', ['fieldToDelete']);

            expect(result[0]).not.toHaveProperty('fieldToDelete');
        });

        it('should return empty array when no items found', async () => {
            mockQuery.mockResolvedValue([]);

            const result = await adapter.getAllById('insuredId', '00001');

            expect(result).toEqual([]);
        });
    });

    describe('Testing toString method', () => {
        it('should return the adapter name', () => {
            expect(adapter.toString()).toBe('MySQL');
        });
    });
});
