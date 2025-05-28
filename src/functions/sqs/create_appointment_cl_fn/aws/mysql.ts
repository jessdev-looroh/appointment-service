import serverlessMysql from 'serverless-mysql';
import { Appointment } from '../interfaces/appointment';
import { AppointmentStatus } from '../enums/appointmentStatus';
import { ResultSetHeader } from 'mysql2';

const mySqlClient = serverlessMysql({
    config: {
        host: process.env.DB_HOST_CL,
        database: process.env.DB_NAME_CL,
        user: process.env.DB_USER_CL,
        password: process.env.DB_PASSWORD_CL,
    },
    library: require('mysql2'),
});

export const createAppointment = async (appointment: Appointment) => {
    let wasCreated = false;
    console.log('OnCreateAppointment');
    try {
        const result : ResultSetHeader  = await mySqlClient.query(
            `INSERT INTO appointments (insured_id, schedule_id, country_iso, status) VALUES (?, ?, ?, ?)`,
            [appointment.insuredId, appointment.scheduleId, appointment.countryISO, appointment.status],
        );
        wasCreated = result?.affectedRows > 0;    
    } catch (err) {
        console.error('Error (createAppointment) :', err);
    }
    
    await mySqlClient.end();
    return wasCreated;
};
