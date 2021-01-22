import { IDataService } from './i-data-service';
import { DataSessionModel } from '../../models/data/dataSessionModel';
import { Injectable } from '@angular/core';
import { RandomValueService } from '../random-value.service';

@Injectable({
    providedIn: 'root'
})
export class DataService implements IDataService {

    constructor(
        private randomValueService: RandomValueService
    ) {}

    database = {
        name: "SmartLinkVault",
        version: 1,
        sessions: "Sessions"
    }

    private openDB() : Promise<IDBDatabase>
    {
        return new Promise<IDBDatabase>((resolve, reject) => {
            let request = indexedDB.open(this.database.name, this.database.version);
            request.onerror = function(err){
                reject(err);
            };
            request.onsuccess = () => {
                let database = request.result as IDBDatabase;
                if (database == null)
                    reject("Can't create IndexDB");
                    this.populateDB(database);
                resolve(database);
            }
            request.onupgradeneeded = (e) => {
                let database = (e.target as any)?.result as IDBDatabase;
                if (database == null)
                    reject("Can't create IndexDB");
                this.populateDB(database);
                resolve(database);
            }
        });
    }
    private populateDB(database: IDBDatabase): void
    {
        if (database == null)
            return;
        if (!database.objectStoreNames.contains(this.database.sessions))
            database.createObjectStore(this.database.sessions, { keyPath: "id", autoIncrement: false });
    }



    getAll(): Promise<DataSessionModel[]> {
        return new Promise<DataSessionModel[]>((resolve) => {
            this.openDB().then(database => {
                const transaction = database.transaction(this.database.sessions, "readonly");
                const sessionsObjectStore = transaction.objectStore(this.database.sessions);
                const request = sessionsObjectStore.getAll();
                request.onsuccess = (e) => {
                    let sessions = (e?.target as any)?.result as DataSessionModel[];
                    if (sessions == null)
                        sessions = new Array<DataSessionModel>();
                    resolve(sessions);
                }
            });
        });
    }
    updateLastOpen(id: string): Promise<void> {
        return new Promise<void>((resolve) => {
            this.openDB().then(database => {
                const transaction = database.transaction(this.database.sessions, "readwrite");
                const sessionsObjectStore = transaction.objectStore(this.database.sessions);
                const request = sessionsObjectStore.get(id);
                request.onsuccess = (e) => {
                    const session = (e.target as any).result as DataSessionModel;
                    session.lastOpen = new Date();
                    const updateRequest = sessionsObjectStore.put(session);
                    updateRequest.onsuccess = (e) => {
                        resolve();
                    }
                }
            });
        });
    }
    updateIsFavorite(id: string, isFavorite: boolean): Promise<void> {
        return new Promise<void>((resolve) => {
            this.openDB().then(database => {
                const transaction = database.transaction(this.database.sessions, "readwrite");
                const sessionsObjectStore = transaction.objectStore(this.database.sessions);
                const request = sessionsObjectStore.get(id);
                request.onsuccess = (e) => {
                    const session = (e.target as any).result as DataSessionModel;
                    session.isFavorite = isFavorite;
                    const updateRequest = sessionsObjectStore.put(session);
                    updateRequest.onsuccess = () => {
                        resolve();
                    }
                }
            });
        });
    }
    addNew(session: DataSessionModel): Promise<void> {
        return new Promise<void>((resolve) => {
            this.openDB().then(database => {
                const transaction = database.transaction(this.database.sessions, "readwrite");
                const sessionsObjectStore = transaction.objectStore(this.database.sessions);
                const request = sessionsObjectStore.getAll();
                request.onsuccess = (e) => {
                    let sessions = (e?.target as any)?.result as DataSessionModel[];
                    if (sessions == null)
                        sessions = new Array<DataSessionModel>();
                    let id = "";
                    do
                    {
                        id = this.randomValueService.generateUuid();
                    } while(sessions.some(s => s.id == id))
                    session.id = id;
                    const addRequest = sessionsObjectStore.add(session);
                    addRequest.onsuccess = () => {
                        resolve();
                    }
                }
            });
        });
    }
    update(session: DataSessionModel): Promise<void> {
        return new Promise<void>((resolve) => {
            this.openDB().then(database => {
                const transaction = database.transaction(this.database.sessions, "readwrite");
                const sessionsObjectStore = transaction.objectStore(this.database.sessions);
                const request = sessionsObjectStore.put(session);
                request.onsuccess = (e) => {
                    resolve();
                }
            });
        });
    }
    delete(id: string): Promise<void> {
        return new Promise<void>((resolve) => {
            this.openDB().then(database => {
                const transaction = database.transaction(this.database.sessions, "readwrite");
                const sessionsObjectStore = transaction.objectStore(this.database.sessions);
                const request = sessionsObjectStore.delete(id);
                request.onsuccess = (e) => {
                    resolve();
                }
            });
        });
    }

}