/**
 * Represents an appointment in the system
 */
export class Appointment {
  /**
   * Unique identifier for the appointment
   */
  id: string;

  /**
   * Date and time of the appointment
   */
  dateTime: Date;

  /**
   * Patient identifier
   */
  patientId: string;

  /**
   * Doctor identifier
   */
  doctorId: string;

  /**
   * Status of the appointment
   */
  status: string;

  constructor(data: Partial<Appointment>) {
    Object.assign(this, data);
  }
} 
