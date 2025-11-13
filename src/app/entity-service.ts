import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class EntityService {

    private baseUrl = ''; // Adjust port and base path as needed
    private entityName!:string;

    setEntityName(value: string) {
        this.entityName = value;
        this.baseUrl  =  'http://localhost:8080/'+this.entityName;
    }

    get EntityName(): string {
        return this.entityName;
    }

    constructor( private http: HttpClient) { 
       
        console.log(this.baseUrl);
    }

    findAll(): Observable<any> {
        return this.http.get(`${this.baseUrl}/getAll`);
    }

    getById(id: number): Observable<Entity> {
         return this.http.get<Entity>(`${this.baseUrl}/getById/`+id);
    }

    verifyUsernameAndPassword(username: string, password: string): Observable<Entity> {
        console.log("getEntityByUsername usename = ", username );
        return this.http.post<Entity>(`${this.baseUrl}/verifyUsernameAndPassword/`+username,password);
    }

    create(Entity: Entity): Observable<Entity> {
        console.log('Entity details posted:', Entity);
        return this.http.post<Entity>(`${this.baseUrl}/create`, Entity);
    }

    update(id: number, entity: Entity): Observable<Entity> {
        console.log(`Entity updated with:`, entity);
        return this.http.put<Entity>(`${this.baseUrl}/update/`+ id, entity);
    }

    findBySearchText(text: string):Observable<Entity> {
      return this.http.get<Entity>(`${this.baseUrl}/search/`, { params: { text } });
    }

    delete(id: number ):Observable<Boolean> {
        console.log(`Entity with ID ${id} deleted`);
        return this.http.delete<Boolean>(`${this.baseUrl}/delete/`+id);
    }

}