import { DatabaseConfig, EventPublisher, Logger } from 'shared';
import { CountryAppointmentStrategy } from '../interfaces';
import { ChileAppointmentStrategy, PeruAppointmentStrategy } from '../strategies';
import { AppointmentRepository } from '../interfaces/appointmentRepository';

interface CountryConfig {
    eventBridge: {
        source: string;
        eventBusName?: string;
    };
    database: {
        tableName: string;
        dbConfig: DatabaseConfig;
    };
    strategyClass: new (
        repository: AppointmentRepository,
        logger: Logger,
        eventPublisher: EventPublisher,
    ) => CountryAppointmentStrategy;
}

export const countryConfigs: Record<string, CountryConfig> = {
    PE: {
        eventBridge: {
            source: process.env.SOURCE!,
            eventBusName: process.env.EVENT_BUS_NAME ?? 'default',
        },
        database: {
            tableName: process.env.MYSQL_APPOINTMENT_TABLE_NAME_PE!,
            dbConfig: {
                host: process.env.DB_HOST_PE!,
                user: process.env.DB_USER_PE!,
                password: process.env.DB_PASSWORD_PE!,
                database: process.env.DB_NAME_PE!,
            },
        },
        strategyClass: PeruAppointmentStrategy,
    },
    CL: {
        eventBridge: {
            source: process.env.SOURCE!,
            eventBusName: process.env.EVENT_BUS_NAME!,
        },
        database: {
            tableName: process.env.MYSQL_APPOINTMENT_TABLE_NAME_CL!,
            dbConfig: {
                host: process.env.DB_HOST_CL!,
                user: process.env.DB_USER_CL!,
                password: process.env.DB_PASSWORD_CL!,
                database: process.env.DB_NAME_CL!,
            },
        },
        strategyClass: ChileAppointmentStrategy,
    },
};
