import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EntityService } from '../entity-service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatButtonModule } from "@angular/material/button";
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppFilterPipe } from '../../filter.pipe';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { STATE_MACHINE_STEP, STATE, ACTION, StateMachineService } from '../app.statemachine';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../app.dataservice'

@Component({
  selector: 'app-entitys',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, FormsModule, HttpClientModule, MatSortModule],
  providers: [EntityService, HttpClient],
  templateUrl: './entitys.html',
  styleUrl: './entitys.css'
})

export class EntitysComponent {
// appFilter.transform(this.Entitys, "vi", "name");
  loading = true;
  //Table Definition
  displayedColumns: string[] = [];
  displayedColumnsKey: string[] = [];

  //Data Source and paginator
  dataSource = new MatTableDataSource<Entity>();  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //selection model for Entity
  selection = new SelectionModel<number>(true, []);

  //sorting data for table
  @ViewChild(MatSort)sort: MatSort = new MatSort;

  searchText!: string;
  entitys: Entity[] = [];
  appFilter: AppFilterPipe = new AppFilterPipe;

  filterPosition: any;
  ACTION = ACTION;
  
  private entityName!:string;

  constructor(
    private entityService: EntityService, 
    private httpClient:HttpClient,
    private router: Router,  
    private stateMachineService: StateMachineService,
    private dataService: DataService)  {

    if((this.router.currentNavigation()?.extras.state)) {
      this.entityName = JSON.parse(JSON.stringify(this.router.currentNavigation()?.extras.state))['dataKey'];
      console.log("RouteNavigation :: this.entityName = ", this.entityName)
    }
    else
    if(!(this.entityName!=null && this.entityName.length>0)) {
      this.dataService.currentMessage.subscribe(msg => {
        this.entityName = ((JSON.parse(msg)) as {entityName:string}).entityName;
        console.log("DataService:: this.entityName = ", this.entityName)
      });
    }
    this.entityService.setEntityName(this.entityName); 

    console.log("stateMachineService.currentMachineStep = " , this.printStep(stateMachineService.currentMachineStep))
    //refresh selection model from session storage

    this.refreshTable(); 


    //This logic is to clear selection after delete or edit submit
    if(stateMachineService.currentMachineStep.from ==   STATE.EDIT &&
        stateMachineService.currentMachineStep.to == STATE.DASHBOARD_NO_SELECTION &&
        stateMachineService.currentMachineStep.action  == ACTION.SUBMIT_EDIT) {
        console.log("Clearing selection after pop edit submit");
        this.clearSessionSelection();
    }else {
      console.log("Reestoring selection from session after navigation");
      this.restoreSessionSelection();
    }

    this.entityName = JSON.parse(JSON.stringify(this.router.currentNavigation()?.extras.state))['dataKey'];
    console.log(this.entityName)
  }

  /***************************
   *     LIFE CYCLE EVENTS   *
  ****************************/
  ngOnInit() {


    this.dataSource.sort = this.sort;

     this.dataSource.filterPredicate = (data: Entity, filter: string) => {
      return data.name.toLowerCase().includes(filter);
     }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Entity, filter: string) => {
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
    console.log(" pageActions = " , this.printActions(pageActions))
    pageActions.forEach( action => {
      if((document.getElementById(''+action) as HTMLButtonElement)!=null)
        (document.getElementById(''+action) as HTMLButtonElement).disabled = false;
    })

    console.log("selection after updateButtonState: ", this.selection.selected);
  }

  /***************************
   *     EVENT HANDLERS      *
  ****************************/

  go(event:any, param:number){
    console.log("event.target.id " , event.target.id);
    const url = this.stateMachineService.goNextState(event.target.id)
    console.log("url " , url, "param = ", param);
    //if (url)this.router.navigateByUrl(url+(param==0?'':param));
    if (url)this.router.navigateByUrl(url+(param==0?'':param), { state: { dataKey: this.entityName, anotherData: 123 } })
  }

  goParam(event:any, selectionPassed:SelectionModel<number>){
    //const url = this.stateMachineService.goNextState(event.target.id)
    console.log("event.target.id ", event.target.id, "selectionPassed ", selectionPassed);
    console.log("goParam ", event.target.id)
    if(event.target.id==this.ACTION.GO_ADD){  
      //this.router.navigateByUrl('/add-Entity/');
      console.log("try add")

        this.go(event, 0)
        console.log("Add Row");

    }
    else if(event.target.id==this.ACTION.GO_EDIT){
      console.log("Edit an Entity id from Entity table:  ", selectionPassed.selected);
      if(selectionPassed.selected.length>0){
        console.log("Selected Entity for Edit:", selectionPassed.selected);
        this.go(event, selectionPassed.selected[0])
      }
      else
        console.log("no selection");
    }
    else if(event.target.id==this.ACTION.SUBMIT_DELETE){
      if(selectionPassed.selected.length>0){
        console.log("Deleted an Entity id from Entity table:  ", selectionPassed.selected);

        selectionPassed.selected.forEach(id=> {
          this.entityService.delete(id).subscribe({
            next: (response: Boolean) => {
              console.log(response);
              console.log("Entity registered successfully", response);
              this.refreshTable();
              let  index  = this.selection.selected.findIndex( selectedId => selectedId == id)
              if(index>-1) this.selection.selected.splice(index, 1);
              this.clearSessionSelection();
              console.log("Selection after deletion: ", this.selection.selected);
            },
            error: (error: string) => {
              console.log(error);
              console.error("Error during registration", error);
            }
          })
        })
        this.go(event, 0);
        
        this.saveSessionSelection()
        //refresh the page to refresh button
        this.updateButtonState()
      }
      else
        console.log("no selection")
    }
  }

  /***************************
   * TABLE EVENT HANDLERS     *
  ****************************/
  
  searchEntityByText(){
    this.entityService.findBySearchText(this.searchText).subscribe((emp: Entity) => {
       console.log(emp);
       console.log(this.searchText);
    }) 
    // appFilter.transform(this.Entitys, "vi", "name");
  }

  filterEntityByPosition() {
    this.appFilter.transform(this.entitys, this.filterPosition, "position");
    console.log("Filtered Entitys by Position:", this.dataSource.data);
    return this.dataSource;
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
    console.log(filterValue);
  }

  selectUnselect(row: Entity) {
    console.log("selection checkedOrUnchecked1: ", this.selection.selected);
    let action = this.ACTION.SUBMIT_SELECT;

    if(this.selection.selected.includes(row.id)) {
        console.log("selection checkedOrUnchecked2: ", this.selection.selected);
        let index = this.selection.selected.findIndex(id => id == row.id)
        if(index>-1)this.selection.selected.splice(index, 1);
        console.log("selection checkedOrUnchecked3: ", this.selection.selected);
        row.isEdit = false;
        action = this.ACTION.SUBMIT_UNSELECT;
        console.log("Unchecked Rows:", this.selection.selected);
    }
    else {
        console.log("selection checkedOrUnchecked4: ", this.selection.selected);
        this.selection.selected.push(row.id);
        console.log("selection checkedOrUnchecked5: ", this.selection.selected);
        row.isEdit = true;
        action = this.ACTION.SUBMIT_SELECT;
        console.log("Checked Rows:", this.selection.selected);
    }

    this.stateMachineService.goNextState(action);

    this.saveSessionSelection()
    //refresh the page to refresh button
    this.updateButtonState()
  }

  /***************************
   * TABLE DATA HANDLERS     *
  ****************************/

  refreshTable() {
    this.entityService.findAll().subscribe((data: Entity[]) => {
      this.mergeDataAndSelection(data);
      if(this.displayedColumns.length==0)
        this.loadEntityInfoAndOrderColumnnData();
      this.dataSource.data = data;
      console.log("Fetched Entitys Data:", this.dataSource.data);
      this.dataSource.paginator = this.paginator; 
    });
  }

  mergeDataAndSelection(data :any[]) {
    data.forEach(row => row.isEdit = false);
    this.selection.selected.forEach(id=> {
      let rowFound = data.find(row => row.id === id);   
      if(rowFound!=null)
        rowFound.isEdit = true;
    })
  } 

  loadEntityInfoAndOrderColumnnData() {
    let entityObject!:entityInfo[];

    this.httpClient.get("/"+this.entityName+".json").subscribe(data => {
      //console.log("data = ",data)
      entityObject = JSON.parse(JSON.stringify(data));
      //console.log("entityObject  = ",  entityObject);

      let order:{order:number,key:string,label:string}[] = []
      let configValue:config;
      for (const key in entityObject) {
        //get each row or entry by key
        if(entityObject.hasOwnProperty(key)) {
         // console.log(key)
          //get each row value by key
          configValue = JSON.parse(JSON.stringify(entityObject[key]));
          //console.log(configValue)
          //console.log(configValue.columnDisplay);

          if(configValue.columnDisplay)
             order.push({"order":configValue.order, "key":key,"label":configValue.columnName})
        }
      }
      order.sort((a,b)=>a.order-b.order);

      order.forEach(element  =>  {
        this.displayedColumns.push(element.label);
        this.displayedColumnsKey.push(element.key);
      })

      console.log("order = ", order);
      console.log("displayedColumns  = ", this.displayedColumns);
      console.log("displayedColumnsKey  = ", this.displayedColumnsKey);
      
      this.loading =  false;
    });

  }

  /***************************
   * SESSION HANDLERS        *
  ****************************/
  restoreSessionSelection() {
     let ids: number []  = [];
    let selectionModelJson = sessionStorage.getItem("selectionModel");
    console.log("sessionStorage.getItem(selectionModel) = ", selectionModelJson);
    if(selectionModelJson!=null)
      ids = JSON.parse(selectionModelJson);

    ids.forEach(element=> {
       this.selection.selected.push(element)
    })

  }

  saveSessionSelection() {
    let ids: number []  = [];
    this.selection.selected.forEach(element=> {
      ids.push(element)
    })

    console.log("JSON.stringify(this.selection) = ", JSON.stringify(ids))
    sessionStorage.setItem("selectionModel", JSON.stringify(ids));
  }

  clearSessionSelection() {
    sessionStorage.removeItem("selectionModel");
  }

  /***************************
   * UTIILITY                *
  ****************************/
 
  private printStep(step: STATE_MACHINE_STEP): string {
      return `{from: ${STATE[step.from]}, to: ${STATE[step.to]}, action: ${ACTION[step.action]}}`;
  }

  private printActions(actions: ACTION[]): string {
    let actionString:string  =  "{";
    actions.forEach(action => {
      actionString += `${ACTION[action]}, `
    })
    return actionString;
  }
}

export interface config {
    value:string, 
    dataType:string, 
    order:number,
    formLabel:string,
    formRequired:string,
    formMinLength:number,
    formMaxLength:number,
    formMinValue:number,
    formMaxValue:number,
    formValues:string,
    formValidatorFunctions:string,
    formValidatorFunctionsParam:string,
    formPattern:string,
    formSegmentName:string,
    columnName:string,
    dataFormat:string, 
    columnLength:string,
    columnSort:string, 
    columnDisplay:string
 }
 export interface entityInfo {
  key:string,
  configValue:config
}
      