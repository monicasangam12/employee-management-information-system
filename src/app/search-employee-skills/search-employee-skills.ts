import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../employee-service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search-employee-skills',
  imports: [FormsModule],
  providers: [HttpClient, EmployeeService],
  standalone: true,
  templateUrl: './search-employee-skills.html',
  styleUrl: './search-employee-skills.css'
})
export class SearchEmployeeSkillsComponent {
  searchText: string = '';

  constructor(private employeeService: EmployeeService) {
    this.employeeService = employeeService;
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    console.log('Searching for employees with skill:', query);

    this.employeeService.findBySearchText(query).subscribe((results) => {
      console.log('Search results:', results);
    });
  }

}
