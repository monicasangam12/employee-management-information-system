import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

  private baseUrl = 'http://localhost:8080/employee'; // Adjust port and base path as needed

    constructor(private http: HttpClient) { 
    }

    findAll(): Observable<any> {
        return this.http.get(`${this.baseUrl}/findAll`);
    }

    getById(id: number): Observable<Employee> {
         return this.http.get<Employee>(`${this.baseUrl}/getById/`+id);
    }

    verifyUsernameAndPassword(username: string, password: string): Observable<Employee> {
        console.log("getEmployeeByUsername usename = ", username );
        return this.http.post<Employee>(`${this.baseUrl}/verifyUsernameAndPassword/`+username,password);
    }

    create(employee: Employee): Observable<Employee> {
        console.log('Employee details posted:', employee);
        return this.http.post<Employee>(`${this.baseUrl}/create`, employee);
    }

    update(employee: Employee): Observable<Employee> {
        console.log(`Employee updated with:`, employee);
        return this.http.put<Employee>(`${this.baseUrl}/update`, employee);
    }

    findBySearchText(employeeText: string):Observable<Employee> {
      return this.http.get<Employee>(`${this.baseUrl}/search/`, { params: { text: employeeText } });
    }

    delete(id: number):Observable<Boolean> {
        console.log(`Employee with ID ${id} deleted`);
        return this.http.delete<Boolean>(`${this.baseUrl}/delete/`+id);
    }

}