import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { MatSortModule } from '@angular/material/sort';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Navbar, MatSortModule, HttpClientModule],
 templateUrl: './app.html',
  styleUrl: './app.css'
})

@Injectable({
  providedIn: 'root'
})

export class App {
  protected title = 'employee-management-applica';
   
}
