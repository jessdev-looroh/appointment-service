import { AppointmentStatus } from '../enums/appointmentStatus';

export interface Appointment {
    insuredId: string;
    scheduleId: number;
    countryISO: string;
    status: AppointmentStatus;
}
