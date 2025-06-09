
export interface GetAllById {
    getAllById<K>(field: string, id: string, deleteItems: string[]): Promise<K[]>;
}
