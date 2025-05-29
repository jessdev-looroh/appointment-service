import { afterAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { DynamoDBAdapter } from '../aws/database';
import { SNSNotificationPublisherAdapter } from '../aws/snsNotificationPublisherAdapter';
import { createAppointmentService } from '../container';
import { AppointmentService } from '../services/appointmentService';

jest.mock('../aws/database');
jest.mock('../aws/snsNotificationPublisherAdapter');
jest.mock('../repositories/appointmentRepository');
jest.mock('../services/appointmentService');

describe('testing createAppointmentService function', () => {
  const envBackup = process.env;

  beforeEach(() => {
    jest.resetModules(); // limpia módulos cacheados
    process.env = {
      ...envBackup,
      DYNAMO_APPOINTMENT_TABLE_NAME: 'mock-table',
      EVENT_NEW_APPOINTMENT_TOPIC: 'mock-topic',
      AWS_REGION: 'us-east-1',
    };
  });

  afterAll(() => {
    process.env = envBackup;
  });

  test('should create service with correct dependencies', () => {
    const mockServiceInstance = {} as AppointmentService;
    (AppointmentService as jest.Mock).mockReturnValue(mockServiceInstance);

    const result = createAppointmentService();

    expect(DynamoDBAdapter).toHaveBeenCalledWith('mock-table', 'us-east-1');
    expect(SNSNotificationPublisherAdapter).toHaveBeenCalledWith('mock-topic', 'us-east-1');
    expect(result).toBe(mockServiceInstance);
  });
});
