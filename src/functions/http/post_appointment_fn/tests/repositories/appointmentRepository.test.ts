import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Appointment } from '../../schemas/appointment';
import { AppointmentRepository } from '../../repositories/appointmentRepository';
import { ISaveAdapter } from '../../interfaces';

describe('Testing AppointmentRepository class', () => {
    const mockAppointment: Appointment = {
        insuredId: '123',
        scheduleId: 456,
        countryISO: 'PE',
    };

    const dbAdapterMock: jest.Mocked<ISaveAdapter> = {
        save: jest.fn(),
    };

    let repository: AppointmentRepository;

    beforeEach(() => {
        jest.resetAllMocks();
        repository = new AppointmentRepository(dbAdapterMock);
    });

    test('createAppointment should call dbAdapter.save with correct appointment', async () => {
        dbAdapterMock.save.mockResolvedValue(true);

        const result = await repository.createAppointment(mockAppointment);

        expect(dbAdapterMock.save).toHaveBeenCalledTimes(1);
        expect(dbAdapterMock.save).toHaveBeenCalledWith(mockAppointment);
        expect(result).toBe(true);
    });
});
