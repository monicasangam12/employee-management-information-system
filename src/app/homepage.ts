import { Component, Inject } from '@angular/core';
import { ACTION, StateMachineService } from '../app.statemachine';
import { Router } from '@angular/router';
import { DataService } from '../app.dataservice'
import { EntityService } from '../entity-service'

@Component({
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class HomepageComponent {
    entityName!:string;
    ACTION = ACTION;

  constructor(
    private entityService: EntityService,
    private stateMachineService: StateMachineService,
    private router: Router,
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
  }

  ngOnInit(): void {
   
  }
  
  ngAfterViewInit() {

    const allActions:(string|ACTION)[] = this.stateMachineService.getAllActions();
    allActions.forEach(action => {
      if((document.getElementById(''+action) as HTMLButtonElement)!=null) {
        console.log("homepage::Disabling button for action: ", action);  
        (document.getElementById(''+action) as HTMLButtonElement).disabled = true;
      }
    })
    
    const pageActions:ACTION[] = this.stateMachineService.getPageActions();
    pageActions.forEach( action => {
      if((document.getElementById(''+action) as HTMLButtonElement)!=null) {
        console.log("homepage::Enabling button for action: ", action);  
        (document.getElementById(''+action) as HTMLButtonElement).disabled = false;
      }
    })

  }

   go(event:any){
    const url = this.stateMachineService.goNextState(event.target.id)
    if (url)this.router.navigateByUrl(url, { state: { dataKey: this.entityName, anotherData: 123 } })
   }

  
}
