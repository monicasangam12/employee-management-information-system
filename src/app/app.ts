import { Component, Inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { LeftNav } from "./left-nav/left-nav";
import { DataService } from "./app.dataservice";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterOutlet, Navbar, MatSortModule, LeftNav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Entity');
  entityName!:string;

  constructor(@Inject(DataService) private dataService: DataService ){   
    this.dataService.changeMessage(JSON.stringify({entityName:this.entityName}));
  }

  

}
