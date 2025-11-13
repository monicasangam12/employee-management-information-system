import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ACTION, StateMachineService } from '../app.statemachine';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { DataService } from '../app.dataservice'

@Component({
  selector: 'app-navbar',
  imports: [MatToolbar,MatIcon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})

export class Navbar {
  ACTION = ACTION;
  private entityName:string="";

  constructor( 
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
    //this.entityService.setEntityName(this.entityName); 

    console.log("stateMachineService.currentMachineStep = " , stateMachineService.currentMachineStep)
  }

  /***************************
   *     LIFE CYCLE EVENTS   *
  ****************************/
  ngAfterViewInit() {
    //this.updateButtonState()
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

  /***************************
   * EVENNT HANDLERS         *
  ****************************/
  go(event:any){
    console.log("event.target.id " , event.target.id);
    if(event.target.id==this.ACTION.MENU_SUBMIT_LOGOUT)
      this.clear();
    const url = this.stateMachineService.goNextState(event.target.id)
    console.log("url xx" , url);
    if (url)this.router.navigateByUrl(url, { state: { dataKey: this.entityName, anotherData: 123 } })
  }

  /***************************
   * UTIILITY                *
  ****************************/

  clear() {
    sessionStorage.clear();
  }
}
