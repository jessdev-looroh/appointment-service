import { Appointment, GetAllById, Logger } from 'shared';
export class AppointmentRepository {
    constructor(private database: GetAllById, private logger: Logger) {}

    async getAppointmentsByInsuredId(insuredId: string) {
        this.logger.info('AppointmentRepository', `Query sent to database database`);
        return this.database.getAllById<Appointment>('PK', `INSURED#${insuredId}`, ['PK', 'SK']);
    }
}
