import { Appointment } from "../../schemas/appointment";

export interface SaveAdapter {
  save(appointment: Appointment): Promise<boolean>;
}

export interface GetAllByInsuredIdAdapter {
  getAllByInsuredId(insuredId: string): Promise<Appointment[]>;
}


export type FullDatabaseAdapter = SaveAdapter & GetAllByInsuredIdAdapter;
