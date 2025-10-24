import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../employee-service';
import { ACTION, StateMachineService } from '../app.statemachine';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, HttpClientModule, MatInputModule],
  providers: [EmployeeService],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
 loginForm!: FormGroup;
  username: string = '';
  password: string = '';
  employeeData!: EmployeeService;

  ACTION_Local = ACTION;
  @Inject("stateMachineService") stateMachineService!: StateMachineService;
  @Inject("router") router!: Router;

  constructor(private httpClient: HttpClient, private employeeService: EmployeeService) {

    this.httpClient = httpClient;

    this.employeeData = new EmployeeService(httpClient);

  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

      console.log("Login Form Initialized: ", this.loginForm.value);


  }

   ngAfterViewInit(){
    console.log("LoginComponent View Initialized");

    //console.log("Current State: ", this.stateMachineService.getCurrentState());
    this.stateMachineService.getCurrentState();

    const allActions:(string|ACTION)[] = this.stateMachineService.getAllActions();
    allActions.forEach(action => {
      if((document.getElementById(''+action) as HTMLButtonElement)!=null)
        (document.getElementById(''+action) as HTMLButtonElement).disabled = true;
    })
    console.log("All Actions Disabled");
    
    const pageActions:ACTION[] = this.stateMachineService.getPageActions();
    pageActions.forEach( action => {
      if((document.getElementById(''+action) as HTMLButtonElement)!=null)
        (document.getElementById(''+action) as HTMLButtonElement).disabled = false;
    })
    console.log("Page Actions Enabled");
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
    this.employeeData.findAll().subscribe(employees => {
     employees = this.employeeData.getById(1);
     console.log("Employees fetched: ", employees);
    });
       const user = this.employeeData.getById(1);
      if (this.loginForm.value.userName == "johndoe") {
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
