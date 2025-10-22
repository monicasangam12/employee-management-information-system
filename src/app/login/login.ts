import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { EmployeeService } from '../employee-service';
import { Router } from '@angular/router';
import { ACTION, StateMachineService } from '../app.statemachine';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from "@angular/material/input";

@Component({
  selector: 'app-login',
  imports: [HttpClientModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInput],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  username: string = '';
  password: string = '';
  employeeData!: EmployeeService;

  ACTION_Local = ACTION;

  constructor(httpClient: HttpClient, private fb: FormBuilder, private router: Router,
    @Inject(StateMachineService) private stateMachineService: StateMachineService
  ) {

    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.pattern('*')])
    });

    console.log("Login Form Initialized: ", this.loginForm.value);

    this.employeeData = new EmployeeService(httpClient);

    // this.employeeData.getEmployeeDetails({id: 1, name: "Jane Smith", position: "Javascript Programmer", username: "janesmith", password: "lovingsmallkittens", salary: 110000});
    // this.employeeData.getEmployeeById(1);
    // this.employeeData.postEmployeeDetails({id: 1, name: "John Doe", position: "UI Developer"});
    // this.employeeData.updateEmployeeDetails(1, { name: 'Jane Smith', position: 'Senior Developer' });
    // this.employeeData.deleteEmployee(1);
  }

  ngAfterViewInit(){
    console.log("LoginComponent View Initialized");

    this.stateMachineService.getCurrentState();

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
    if (event.target.id === this.ACTION_Local.GO_LOGIN) {
      this.loginEmployee();
      console.log("Login button clicked");
    }
    if (url)this.router.navigateByUrl(url);
  }

  loginEmployee(){
    // this.employeeData.getEmployeeDetails({id: 1, name: "Jane Smith", position: "Javascript Programmer", username: "janesmith", password: "lovingsmallkittens", salary: 110000});
    //   const user = this.employeeData.getEmployeeById(1);
      if (this.loginForm.value.username == "johndoe") {
        console.log("Login Successful");
        console.log(this.username + " logged in.");

        this.router.navigateByUrl("employees");
        console.log("Navigation successful");
       
      } else {
      
        console.log("Invalid credentials");
      }
    }
  }