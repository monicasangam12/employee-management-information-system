import { Component, Inject, signal } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../app.dataservice'
import { Router } from '@angular/router';

@Component({
  selector: 'app-left-nav',
  imports: [MatButtonToggleModule, ReactiveFormsModule, FormsModule],
  templateUrl: './left-nav.html',
  styleUrl: './left-nav.css',
})
export class LeftNav {
  hideSingleSelectionIndicator = signal(false);
  entityNameControl = new FormControl('');
  entityName:string = "employee";

  constructor(
    private router: Router , 
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
    //this.entityService.setEntityName(this.entityName); 

  }

  entitySelection() {
    if(this.entityNameControl.value!=null)
      this.entityName = this.entityNameControl.value
      this.dataService.changeMessage(JSON.stringify({entityName:this.entityName}))
  }
}
