import { SQSEvent } from 'aws-lambda';
import { createAppointmentService } from './container';
import { Appointment, Logger } from 'shared';

export const updateAppointmentHandler = async (event: SQSEvent): Promise<void> => {
    const logger = new Logger();
    try {
        for (const record of event.Records) {
            const body = JSON.parse(record.body);
            logger.info('handler', `Event received with body: ${JSON.stringify(body)}`);
            const appointmentService = createAppointmentService(logger);
            const appointment: Appointment = body.detail;
            await appointmentService.update(appointment);
        }
    } catch (err) {
        logger.error('handler', `Error updating appointment: ${err}`);
    }
};
