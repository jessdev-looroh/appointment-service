import { SQSEvent } from 'aws-lambda';
import { Appointment, Logger } from 'shared';
import { AppointmentStrategyFactory } from './factories';

/**
 * Handler for the create appointment endpoint
 * @param {SQSEvent} event - The event object
 * @returns {Promise<void>}
 */
export const createAppointmentHandler = async (event: SQSEvent) => {
    const logger = new Logger();

    try {
        for (const record of event.Records) {
            try {
                const body = JSON.parse(record.body);
                const appointment: Appointment = JSON.parse(body.Message);
                logger.info(
                    'Handler',
                    `Processing appointment for country: ${appointment.countryISO}, messageId: ${record.messageId}`,
                );
                const appointmentService = AppointmentStrategyFactory.getStrategy(appointment.countryISO);
                await appointmentService.create(appointment);
            } catch (recordError) {
                logger.error(
                    'Handler',
                    `Failed to process record: ${JSON.stringify({
                        error: recordError,
                        record: record.messageId,
                    })}`,
                );
            }
        }
    } catch (error) {
        logger.error('handler', `Critical error in handler: ${JSON.stringify(error)}`);
    }
};
