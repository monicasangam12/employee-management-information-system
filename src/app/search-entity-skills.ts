import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EntityService } from '../entity-service';
import { Router } from '@angular/router';
import { DataService } from '../app.dataservice'

@Component({
  selector: 'app-search-entity-skills',
  imports: [FormsModule],
  providers: [EntityService],
  standalone: true,
  templateUrl: './search-entity-skills.html',
  styleUrl: './search-entity-skills.css'
})

export class SearchEntitySkillsComponent {
  searchText: string = '';
  private entityName!:string;
  
  constructor(
    private router: Router, 
    private entityService: EntityService,
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

  /***************************
   *     EVENT HANDLERS      *
  ****************************/

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    console.log('Searching for Entitys with skill:', query);

    this.entityService.findBySearchText(query).subscribe((results) => {
      console.log('Search results:', results);
    });
  }

}
