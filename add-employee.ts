import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employee-service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, HttpClientModule],
  standalone: true,
  providers: [EmployeeService],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css'
})
export class AddEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
  router: Router = new Router;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private employeeService: EmployeeService){
    this.employeeForm = this.fb.group({
      id: [''],
      name: [''],
      email: [''],
      username: [''],
      password: [''],
      position: [''],
      salary: [''],
      rating: ['']
    });     
  }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
          const id = params.get('id');

          let employeeId:number = Number(id);
          console.log("employeeId = "+ employeeId);
          if(employeeId==0) {
            this.addEmployee(employeeId);
          }
          else {
            this.editEmployee(employeeId);
          }
    });
  }

  addEmployee(employeeId:number){ 
    //form has no initial values
    this.employeeForm.patchValue({
      id:employeeId,
    })
  }

  editEmployee(employeeId:number){ 
    //patch the  form values

    this.employeeService.getById(employeeId).subscribe((employee: Employee |  undefined) => {
        console.log("Got it Employee = ", employee);
        this.employeeForm.patchValue({
          id:employee?.id,
          name:employee?.name,
          email:employee?.email,
          position:employee?.position,
          salary:employee?.salary,
          username:employee?.username,
          password:employee?.password,  
          rating:employee?.rating,
        })

    });

  }
  onSubmit(){
      if(this.employeeForm.valid){
        console.log("Form Submitted Successfully value",this.employeeForm.value);
        console.log("Form Submitted Successfully id",this.employeeForm.value.id);

        if(this.employeeForm.value.id==0)
        this.employeeService.create(this.employeeForm.value).subscribe({
          next: (response: Employee) => {
            console.log(response);
            console.log("Employee registered successfully", response);
            this.router.navigate(['/employees']);
          },
          error: (error: string) => {
            console.log(error);
            console.error("Error during registration", error);
          }
        })
        else
        this.employeeService.update(this.employeeForm.value).subscribe({
          next: (response: Employee) => {
            console.log(response);
            console.log("Employee registered successfully", response);
            this.router.navigate(['/employees']);
          },
          error: (error: string) => {
            console.log(error);
            console.error("Error during registration", error);
          }
        });
      }
      else{
        console.log("Registration form is not valid");
      }
  
    }
}

