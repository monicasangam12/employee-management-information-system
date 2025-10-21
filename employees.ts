import { CommonModule } from '@angular/common';
import { Component, EventEmitter, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EmployeeService } from '../employee-service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatButtonModule } from "@angular/material/button";
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppFilterPipe } from '../../filter.pipe';
import { MatSort, MatSortModule } from '@angular/material/sort';


const COLUMNS_SCHEMA = [
  {
      key: "isEdit",
      type: "checkbox",
      label: "Select"
  },
  {
      key: "id",
      type: "number",
      label: "Id"
  },
  {
      key: "name",
      type: "text",
      label: "Name"
  },
  {
      key: "email",
      type: "text",
      label: "Email"
  },
  {
    key: "position",
    type: "text",
    label: "Position"
},
  {
      key: "salary",
      type: "number",
      label: "Salary"
  },
  {
      key: "rating",
      type: "number",
      label: "Rating"
  },
  {
    key: "username",
    type: "text",
    label: "Username"
  },
  { 
    key: "password",
    type: "password",
    label: "Password"
  }

];

export enum FORM_MODE {
      Register = 0,
      Add = 1,
      Edit = 2,
      Delete = 3
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, FormsModule, HttpClientModule, MatSortModule],
  providers: [EmployeeService],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class EmployeesComponent {
// appFilter.transform(this.employees, "vi", "name");

  //Table Definition
  columnsSchema: any = COLUMNS_SCHEMA;
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col: { key: any; }) => {   return col.key });

  //Data Source and paginator
  dataSource = new MatTableDataSource<Employee>();  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //selection model for employee
  selection = new SelectionModel<Employee>(true, []);

  //sorting data for table
  @ViewChild(MatSort)sort: MatSort = new MatSort;

  formModeEnum = FORM_MODE;
  searchText!: string;
  employees: Employee[] = [];
  appFilter: AppFilterPipe = new AppFilterPipe;

  formMode!: FORM_MODE;
  event!: EventEmitter<Employee>;

  filterPosition: any;

  //Lifecycle Event

  constructor(private employeeService: EmployeeService, private router: Router)  {
    this.refreshTable();
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;

     this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      return data.name.toLowerCase().includes(filter);
     }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  refreshTable() {
    this.employeeService.findAll().subscribe((data: Employee[]) => {
      this.dataSource.data = data;
      console.log("Fetched Employees Data:", this.dataSource.data);
      this.dataSource.paginator = this.paginator; 
    });
  }
  
  searchEmployeeByText(){
    this.employeeService.findBySearchText(this.searchText).subscribe((emp: Employee) => {
       console.log(emp);
       console.log(this.searchText);
    }) 
    // appFilter.transform(this.employees, "vi", "name");
  }

  filterEmployeeByPosition() {
    this.appFilter.transform(this.employees, this.filterPosition, "position");
    console.log("Filtered Employees by Position:", this.dataSource.data);
    return this.dataSource;
  }

  //Event Handlers

  checkedOrUnchecked(row: Employee) {
    if (row && row.isEdit === true) {
       this.selection.toggle(row);
       console.log("Unchecked Rows:", this.selection.selected);
    } else {
      this.selection.toggle(row);
      console.log("Checked Rows:", this.selection.selected);
    }
  }

  addRowButtonHandler(formMode:FORM_MODE){
      if(formMode==FORM_MODE.Add){
        this.router.navigateByUrl('/add-employee/');
        console.log("Add Row");
      }
  }


  editRowButtonHandler(formMode:FORM_MODE){
          if(formMode==FORM_MODE.Edit){
          console.log("Edit an employee id from employee table:  ", this.selection.selected[0]);
          if(this.selection.selected.length>0){
            console.log("Selected Employee for Edit:", this.selection.selected[0]);
            this.router.navigateByUrl('/add-employee/'+this.selection.selected[0].id);
          }
          else
            console.log("no selection");
      }
  }

  deleteRowButtonHandler(formMode:FORM_MODE){
     if(formMode==FORM_MODE.Delete) {
      if(this.selection.selected.length>0){
        console.log("Deleted an employee id from employee table:  ", this.selection.selected[0].id);

        this.employeeService.delete(this.selection.selected[0].id).subscribe({
          next: (response: Boolean) => {
            console.log(response);
            console.log("Employee registered successfully", response);
            this.refreshTable();
          },
          error: (error: string) => {
            console.log(error);
            console.error("Error during registration", error);
          }
        })

      }
      else
        console.log("no selection")
    }
  }

  applyFilter(event: Event){
     const filterValue = (event.target as unknown as HTMLInputElement).value;
     this.dataSource.filter = filterValue.trim().toLowerCase();
     console.log(this.dataSource.filter);
     console.log(filterValue);
  }

}
      