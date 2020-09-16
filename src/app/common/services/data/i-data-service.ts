import { DataSessionModel } from '../../models/data/dataSessionModel';

export interface IDataService {

    getAll(): Promise<Array<DataSessionModel>>;
    updateLastOpen(id: string): Promise<void>;
    addNew(session: DataSessionModel): Promise<void>;
    update(session: DataSessionModel): Promise<void>;
    delete(id: string): Promise<void>;

}
