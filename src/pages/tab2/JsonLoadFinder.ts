import { Http } from '@angular/http';
import { Injectable } from '@angular/core';



@Injectable()
export class JsonLoadFinder {
    constructor(private http: Http) {

    }

    /**
     * name
     */
    public getJSONData(filePath: string): Promise<any> {
        return this.http.get(filePath)
     .toPromise()
     .then(response => response.json())
     .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.log(`An error occurred : ${error}`);
        return Promise.reject(error.message || error);
    }
}