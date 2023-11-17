import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
  
    public onLoadingChange = new EventEmitter<boolean>();

    constructor() { }
    
    private isLoading = false;
    private promises = new Array<Promise<any>>();

    public handlePromise<T>(promise: Promise<T>): Promise<T> {
        this.startLoading();
        this.promises.push();
        let onPromiseFinish = () => {
            this.promises = this.promises.filter(p => p != promise);
            if (this.promises.length == 0)
                this.finishLoading();
        }
        promise.then(() => onPromiseFinish()).catch(() => onPromiseFinish());
        
        return promise;
    }

    private startLoading() {
        if (!this.isLoading) {
            this.isLoading = true;
            this.onLoadingChange.emit(true);
        }
    }

    private finishLoading() {
        if (this.isLoading) {
            this.isLoading = false;
            this.onLoadingChange.emit(false);
        }
    }
    
}
  