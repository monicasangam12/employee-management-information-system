import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employee-service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ACTION, StateMachineService } from '../app.statemachine';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from "@angular/material/select";


@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, HttpClientModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  standalone: true,
  providers: [EmployeeService],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css'
})
export class AddEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
  router: Router = new Router;

  ACTION_Local = ACTION;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private employeeService: EmployeeService,
    @Inject(StateMachineService)private stateMachineService: StateMachineService
  ){
    this.employeeForm = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      position: new FormControl('', Validators.required),
      salary: new FormControl('', [Validators.required, Validators.min(0)]),
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rating: new FormControl('', [Validators.required, Validators.min(1), Validators.max(5)]),
    });
    console.log("Add Employee Form Initialized", this.employeeForm.value);
    this.router = new Router;
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

  ngAfterViewInit(){
    console.log("AddEmployeeComponent View Initialized");

    let employeeId = this.stateMachineService.getCurrentState();
    console.log("Current State: ", employeeId);

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
    const url = '';
    if (event.target.id === this.ACTION_Local.GO_ADD) {
      this.onSubmit();
      console.log("Add Employee button clicked");
    }
    if (url)this.router.navigateByUrl(url);
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

      this.employeeService.create(this.employeeForm.value);
      console.log("Employee Form Submitted", this.employeeForm.value);

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

