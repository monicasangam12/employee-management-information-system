import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { EmployeeService } from '../employee-service';
import { Router } from '@angular/router';
import { ACTION, StateMachineService } from '../app.statemachine';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from "@angular/material/input";

@Component({
  selector: 'app-login',
  imports: [HttpClientModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInput],
  template: './login.html',
  styles: './login.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm!: FormGroup;
  username: string = '';
  password: string = '';
  employeeData!: EmployeeService;

  ACTION_Local = ACTION;
  @Inject("stateMachineService") stateMachineService!: StateMachineService;
  @Inject("router") router!: Router;

  constructor(@Inject("httpClient") httpClient: HttpClient ) {

    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.pattern('*')])
    });

    console.log("Login Form Initialized: ", this.loginForm.value);

    this.employeeData = new EmployeeService(httpClient);

  }

  ngOnInit() {
    
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
      }
       else {
        console.log("Invalid credentials");
       }
    }
}