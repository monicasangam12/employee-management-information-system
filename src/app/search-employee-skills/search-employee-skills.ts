import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EmployeeService } from '../employee-service';

@Component({
  selector: 'app-search-employee-skills',
  imports: [MatFormField, MatSelectModule, MatOptionModule, ReactiveFormsModule, FormsModule],
  templateUrl: './search-employee-skills.html',
  styleUrls: ['./search-employee-skills.css'],
})
export class SearchEmployeeSkillsComponent {
  skillsControl = new FormControl('');
  skillsList: string[] = ['Java', 'Angular', 'Python', 'C#', 'SQL', 'AWS'];

  constructor(private employeeService: EmployeeService) {}

  searchSkills(skill: string) {
    console.log("Searching employees with skill: ", skill);
    this.employeeService.findBySearchText(skill).subscribe((results: any) => {
      console.log("Search results: ", results);
    });
  }
}
