import { Appointment } from '../../interfaces/appointment';

export interface ISaveAdapter {
    save(appointment: Appointment): Promise<boolean>;
}

export interface IGetAllByInsuredIdAdapter {
    getAllByInsuredId(insuredId: string): Promise<Appointment[]>;
}

export interface IUpdateAdapter {
    update(appointment: Appointment): Promise<void>;
}
export type IFullDatabaseAdapter = ISaveAdapter & IGetAllByInsuredIdAdapter & IUpdateAdapter;
