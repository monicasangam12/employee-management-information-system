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
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ACTION, StateMachineService } from '../app.statemachine';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


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
  imports: [CommonModule, MatInputModule, MatTableModule, MatPaginatorModule,
     MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, 
     FormsModule, HttpClientModule, MatSortModule, MatButtonToggleModule],
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
  //appFilter: AppFilterPipe = new AppFilterPipe;

  formMode!: FORM_MODE;
  event!: EventEmitter<Employee>;

  filterPosition: any;
  ACTION_Local = ACTION;

  //Lifecycle Event

  constructor(private employeeService: EmployeeService, private router: Router,
    private stateMachineService: StateMachineService
  )  {
    this.refreshTable();
  }

  ngOnInit() {

     this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      return data.name.toLowerCase().includes(filter);
     }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      return data.name.toLowerCase().includes(filter);
     }

     let employeeId = this.stateMachineService.getCurrentState();
     console.log("Current State: ", employeeId);
     
   const allActions:(string|ACTION)[] = this.stateMachineService.getAllActions();
    allActions.forEach(action => {
      if((document.getElementById(''+action) as HTMLButtonElement)!=null)
        (document.getElementById(''+action) as HTMLButtonElement).disabled = true;
    })
    
    const pageActions:ACTION[] = this.stateMachineService.getPageActions();
    pageActions.forEach( action => {
      if((document.getElementById(''+action) as HTMLButtonElement)!=null)
        (document.getElementById(''+action) as HTMLButtonElement).disabled = false;
    })

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

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
    console.log(filterValue);
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

   go(event:any){
    const url = this.stateMachineService.getNextState(event.target.id)
    console.log("Navigating to URL:", "employees");
    if (url == "search-employee-skills")
           this.searchEmployeeByText();
    else if (url == "delete/${id}")
      this.deleteRowButtonHandler(this.formModeEnum.Delete);
    else if (url == "edit/${id}")
      this.editRowButtonHandler(this.formModeEnum.Edit);
    else if (url == "add-employee/{id}")
      this.router.navigateByUrl(url);
      console.log("Navigating to URL:", "add-employee");

    if (url)this.router.navigateByUrl("add-employee");
   }

  onToggleChange() {
    const selectedValue = this.employees;
    console.log("Selected View Mode:", selectedValue);
   if (selectedValue) {
      viewAddMode: this.dataSource.data = this.employees.filter(emp => emp.username.length >= 4);
      console.log("Filtered Employees with username length >=4:", this.dataSource.data);
    } else {
      viewAllMode: this.refreshTable();
      console.log("All Employees View Mode:", this.dataSource.data);
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

}
      
