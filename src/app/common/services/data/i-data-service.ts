import { DataSessionModel } from '../../models/data/dataSessionModel';

export interface IDataService {

    getAll(): Promise<Array<DataSessionModel>>;
    updateLastOpen(id: string): Promise<void>;
    updateIsFavorite(id: string, isFavorite: boolean): Promise<void>;
    addNew(session: DataSessionModel): Promise<void>;
    addMany(sessions: Array<DataSessionModel>): Promise<void>;
    update(session: DataSessionModel): Promise<void>;
    delete(id: string): Promise<void>;
    clearStorage(): Promise<void>;

}
