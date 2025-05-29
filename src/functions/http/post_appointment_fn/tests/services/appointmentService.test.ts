import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Appointment } from '../../schemas/appointment';
import { IAppointmentRepository, INotificationPublisherAdapter } from '../../interfaces';
import { AppointmentService } from '../../services/appointmentService';
import { StatusCodeEnum, StatusTextEnum } from '../../enums';

describe('Testing AppointmentService class', () => {
    const mockAppointment: Appointment = {
        insuredId: '123',
        scheduleId: 456,
        countryISO: 'PE',
    };

    const appointmentRepositoryMock: jest.Mocked<IAppointmentRepository> = {
        createAppointment: jest.fn(),
    };

    const notificationPublisherMock: jest.Mocked<INotificationPublisherAdapter> = {
        publishNewAppointment: jest.fn(),
    };

    let service: AppointmentService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new AppointmentService(appointmentRepositoryMock, notificationPublisherMock);
    });

    test('should return success response and publish notification if appointment is created', async () => {
        appointmentRepositoryMock.createAppointment.mockResolvedValue(true);

        const response = await service.createAppointment(mockAppointment);

        expect(appointmentRepositoryMock.createAppointment).toHaveBeenCalledWith(mockAppointment);
        expect(notificationPublisherMock.publishNewAppointment).toHaveBeenCalledWith(mockAppointment);

        expect(response).toEqual({
            statusCode: StatusCodeEnum.CREATED,
            statusText: StatusTextEnum.CREATED,
            data: [mockAppointment],
            message: 'El agendamiento está en proceso',
            error: {},
        });
    });

    test('should return error response and not publish notification if appointment creation fails', async () => {
        appointmentRepositoryMock.createAppointment.mockResolvedValue(false);

        const response = await service.createAppointment(mockAppointment);

        expect(appointmentRepositoryMock.createAppointment).toHaveBeenCalledWith(mockAppointment);
        expect(notificationPublisherMock.publishNewAppointment).not.toHaveBeenCalled();

        expect(response).toEqual({
            statusCode: StatusCodeEnum.INTERNAL,
            statusText: StatusTextEnum.INTERNAL,
            data: [],
            message: 'Ocurrió un error al registrar',
            error: {},
        });
    });
});
