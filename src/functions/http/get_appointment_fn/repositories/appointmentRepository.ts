import { FullDatabaseAdapter } from '../aws/database';

export class AppointmentRepository {
    constructor(private dbAdapter: FullDatabaseAdapter) {}

    async getAppointmentsByInsuredId(insuredId: string) {
        return this.dbAdapter.getAllByInsuredId(insuredId);
    }
}
