import { Appointment } from "../../schemas/appointment";

export interface ISaveAdapter {
  save(appointment: Appointment): Promise<boolean>;
}

export interface IGetAllByInsuredIdAdapter {
  getAllByInsuredId(insuredId: string): Promise<Appointment[]>;
}


export type IFullDatabaseAdapter = ISaveAdapter & IGetAllByInsuredIdAdapter;
