import { AppointmentStatus } from '../../enums';
import { Appointment } from '../../interfaces';

export const appointmentMock: Appointment = {
    insuredId: '00001',
    scheduleId: 100,
    countryISO: 'PE',
    status: AppointmentStatus.PENDING,
};
