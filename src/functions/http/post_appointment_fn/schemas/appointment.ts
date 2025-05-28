import { z } from 'zod';

export const AppointmentSchema = z.object({
    insuredId: z.string().length(5, 'insuredId must be 5 digits'),
    scheduleId: z.number().int().nonnegative('scheduleId must be a positive integer'),
    countryISO: z.string().length(2, 'countryISO must be a 2-letter ISO code').toUpperCase(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;
