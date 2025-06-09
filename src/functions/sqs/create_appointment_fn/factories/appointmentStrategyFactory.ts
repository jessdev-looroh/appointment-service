import { countryConfigs } from '../configs/config';
import { CountryAppointmentStrategy } from '../interfaces';
import { AppointmentRepositoryImpl } from '../repositories/appointmentRepository';
import { MySQLAdapter, Logger, EventBridgePublisher } from 'shared';
const strategyCache: Map<string, CountryAppointmentStrategy> = new Map();

/**
 * Class that provides a factory for appointment strategies
 * @param {string} countryISO - The country ISO
 * @returns {CountryAppointmentStrategy} The appointment strategy
 */
export class AppointmentStrategyFactory {
    /**
     * Gets an appointment strategy for a given country
     * @param {string} countryISO - The country ISO
     * @returns {CountryAppointmentStrategy} The appointment strategy
     */
    static getStrategy(countryISO: string): CountryAppointmentStrategy {
        const country = countryISO.toUpperCase();

        if (strategyCache.has(country)) {
            return strategyCache.get(country)!;
        }

        const config = countryConfigs[country];
        if (!config) {
            throw new Error(`Unsupported country: ${country}`);
        }

        const db = new MySQLAdapter(config.database.tableName, config.database.dbConfig);
        const logger = new Logger();
        const repository = new AppointmentRepositoryImpl(db, logger);
        const eventPublisher = new EventBridgePublisher(
            config.eventBridge.source,
            logger,
            config.eventBridge.eventBusName,
        );
        const strategy = new config.strategyClass(repository, logger, eventPublisher);

        strategyCache.set(country, strategy);
        return strategy;
    }
}
