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
import { ACTION, StateMachineService } from '../app.statemachine';


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

  searchText!: string;
  employees: Employee[] = [];
  appFilter: AppFilterPipe = new AppFilterPipe;

  filterPosition: any;
  ACTION_Local = ACTION;


  constructor(private employeeService: EmployeeService, private router: Router,
    private stateMachineService: StateMachineService
  )  {
    console.log("stateMachineService.currentMachineStep = " , stateMachineService.currentMachineStep)
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

    this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      return data.name.toLowerCase().includes(filter);
     }

     this.updateButtonState()
     


  }

  updateButtonState() {
   const allActions:(string|ACTION)[] = this.stateMachineService.getAllActions();
    allActions.forEach(action => {
      if((document.getElementById(''+action) as HTMLButtonElement)!=null)
        (document.getElementById(''+action) as HTMLButtonElement).disabled = true;
    })
    
    const pageActions:ACTION[] = this.stateMachineService.getPageActions();
    console.log(" currentState = " , this.stateMachineService.getCurrentState());
    console.log(" pageActions = " , pageActions)
    pageActions.forEach( action => {
      if((document.getElementById(''+action) as HTMLButtonElement)!=null)
        (document.getElementById(''+action) as HTMLButtonElement).disabled = false;
    })
  }

  go(event:any, param:number){
    console.log("event.target.id " , event.target.id);
    const url = this.stateMachineService.goNextState(event.target.id)
    console.log("url " , url);
    if (url)this.router.navigateByUrl(url);
  }

  goParam(event:any, selectionPassed:SelectionModel<Employee>){
    //const url = this.stateMachineService.goNextState(event.target.id)
    console.log("event.target.id ", event.target.id);
    console.log("goParam ", event.target.id)
    if(event.target.id==this.ACTION_Local.GO_ADD){
      //this.router.navigateByUrl('/add-employee/');
      console.log("try add")
      this.go(event, (selectionPassed.selected[0]===undefined?0:selectionPassed.selected[0].id))
      console.log("Add Row");
    }
    else if(event.target.id==this.ACTION_Local.GO_EDIT){
      console.log("Edit an employee id from employee table:  ", selectionPassed.selected[0]);
      if(selectionPassed.selected.length>0){
        console.log("Selected Employee for Edit:", selectionPassed.selected[0]);
        //this.router.navigateByUrl('/add-employee/'+ selectionPassed.selected[0].id);
        this.go(event, (selectionPassed.selected[0]===undefined?0:selectionPassed.selected[0].id))
      }
      else
        console.log("no selection");
    }
    else if(event.target.id==this.ACTION_Local.SUBMIT_DELETE){
      if(selectionPassed.selected.length>0){
        console.log("Deleted an employee id from employee table:  ", selectionPassed.selected[0].id);

        this.employeeService.delete(selectionPassed.selected[0].id).subscribe({
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
        this.go(event, (selectionPassed.selected[0].id===undefined?0:selectionPassed.selected[0].id));
      }
      else
        console.log("no selection")
    }
  }


  refreshTable() {
    this.employeeService.findAll().subscribe((data: Employee[]) => {
      this.refreshSelection(data);
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
    let action = this.ACTION_Local.SUBMIT_SELECT;

    if(this.selection.isSelected(row)) {
        row.isEdit = false;
        action = this.ACTION_Local.SUBMIT_UNSELECT;
    }
    else {
        row.isEdit = true;
        action = this.ACTION_Local.SUBMIT_SELECT;
    }

    this.stateMachineService.goNextState(action);

    if (row && row.isEdit === true) {
       this.selection.toggle(row);
       console.log("Unchecked Rows:", this.selection.selected);
    } else {
      this.selection.toggle(row);
      console.log("Checked Rows:", this.selection.selected);
    }

    this.saveSessionSelection()
    //refresh the page to refresh button
    this.updateButtonState()
  }

  refreshData(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
    console.log(filterValue);
  }

  restoreSessionSelection() {
     let ids: number []  = [];
    let selectionModelJson = sessionStorage.getItem("selectionModel");
    console.log("sessionStorage.getItem(selectionModel) = ", selectionModelJson);
    if(selectionModelJson!=null)
      ids = JSON.parse(selectionModelJson);
    return ids;
  }

  saveSessionSelection() {
    let ids: number []  = [];
    this.selection.selected.forEach(element=> {
      ids.push(element.id)
    })

    console.log("JSON.stringify(this.selection) = ", JSON.stringify(ids))
    sessionStorage.setItem("selectionModel", JSON.stringify(ids));
  }

  refreshSelection(data :any[]) {
    let ids: number []  = [];
    ids = this.restoreSessionSelection();

    let index = 0;
    let maxIndex = ids.length;
    console.log("maxIndex = ", maxIndex)
    console.log("refreshSelection:ids = ", ids)
    data.forEach(element=> {
      if(index < maxIndex  && ids[index]==element.id) {
        console.log("index = ", index, " ids[index] = ", ids[index])
        element.isEdit = true;
        index++
      }
      else  
        element.isEdit = false
    })
  }
}
      
