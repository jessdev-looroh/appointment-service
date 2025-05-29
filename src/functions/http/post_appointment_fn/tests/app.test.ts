import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { createAppointmentService } from '../container';
import { formatErrorResponse } from '../utils/errorResponse';
import { StatusCodeEnum, StatusTextEnum } from '../enums';
import { createAppointmentHandler } from '../app';

jest.mock('../container', () => ({
    createAppointmentService: jest.fn(),
}));

jest.mock('../utils/errorResponse', () => ({
    formatErrorResponse: jest.fn(),
}));

describe('testing createAppointmentHandler function', () => {
    const mockAppointment = {
        insuredId: '12345',
        scheduleId: 456,
        countryISO: 'PE',
    };

    const mockEvent: APIGatewayProxyEvent = {
        body: JSON.stringify(mockAppointment),
        headers: {},
        httpMethod: 'POST',
        isBase64Encoded: false,
        path: '/appointment',
        pathParameters: null,
        queryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
    };

    const mockResponse = {
        statusCode: StatusCodeEnum.CREATED,
        statusText: StatusTextEnum.CREATED,
        message: 'OK',
        data: [mockAppointment],
        error: {},
    };

    const serviceMock: any = {
        createAppointment: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (createAppointmentService as jest.Mock).mockReturnValue(serviceMock);
    });

    test('should return success response when appointment is created', async () => {
        serviceMock.createAppointment.mockResolvedValue(mockResponse);

        const result = await createAppointmentHandler(mockEvent);

        expect(serviceMock.createAppointment).toHaveBeenCalledWith(mockAppointment);
        expect(result.statusCode).toBe(StatusCodeEnum.CREATED);
        expect(JSON.parse(result.body)).toEqual(mockResponse);
    });

    test('should return error response when exception is thrown', async () => {
        const mockError = new Error('Test error');
        const errorResp = {
            statusCode: 500,
            statusText: 'INTERNAL',
            data: [],
            message: 'Internal server error',
            error: {},
        };

        serviceMock.createAppointment.mockImplementation(() => {
            throw mockError;
        });
        (formatErrorResponse as jest.Mock).mockReturnValue(errorResp);

        const result = await createAppointmentHandler(mockEvent);

        expect(formatErrorResponse).toHaveBeenCalledWith(mockError);
        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toEqual(errorResp);
    });
});
