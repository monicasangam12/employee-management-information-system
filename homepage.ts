import { Component, Inject } from '@angular/core';
import { ACTION, StateMachineService } from '../app.statemachine';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class HomepageComponent {
    ACTION_Local = ACTION;

    constructor(private stateMachineService: StateMachineService, @Inject(Router) private router: Router)  {

  }

  ngOnInit(): void {
   
  }
  
  ngAfterViewInit() {

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

   go(event:any){
    const url = this.stateMachineService.getNextState(event.target.id)
    if (url)this.router.navigateByUrl(url);
   }

  
}
