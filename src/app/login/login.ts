
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { EmployeeService } from '../employee-service';
import { Router } from '@angular/router';
import { ACTION, StateMachineService } from '../app.statemachine';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})


export class LoginComponent implements OnInit, AfterViewInit {
  loginForm!: FormGroup;
  ACTION_Local = ACTION;

  constructor( 
    @Inject(StateMachineService) private stateMachineService: StateMachineService, 
    @Inject(Router) private router: Router , 
    @Inject(EmployeeService) private employeeService:EmployeeService)  {
    this.loginForm = new FormGroup({
      username: new FormControl('bsangam@yahoo.com', Validators.required),
      password: new FormControl('jajdjakdjandjajs', Validators.required)
    });
    console.log("Login Form Initialized: ", this.loginForm.value);
  }

  ngOnInit(): void {
   
  }
  
  ngAfterViewInit() {
    const allActions:(string|ACTION)[] = this.stateMachineService.getAllActions();
    allActions.forEach(action => {
      if((document.getElementById(''+action) as HTMLButtonElement)!=null)
        (document.getElementById(''+action) as HTMLButtonElement).disabled = true;
    })
    
    const pageActions:ACTION[] = this.stateMachineService.getPageActions();
    console.log("pageActions = ", pageActions);
    pageActions.forEach( action => {
      if((document.getElementById(''+action) as HTMLButtonElement)!=null)
        (document.getElementById(''+action) as HTMLButtonElement).disabled = false;
    })
  }

  go(event:any){
  console.log("event.target.id " , event.target.id);
  const url = this.stateMachineService.goNextState(event.target.id)
  console.log("url " , url);
  if (url)this.router.navigateByUrl(url);
  }

  submit(event:any){
      if (this.loginForm.valid && this.employeeService.verifyUsernameAndPassword(this.loginForm.value.username, this.loginForm.value.password)) {
        console.log("Login Successful");
        console.log(this.loginForm.value.username + " logged in.");
        this.go(event);
        console.log("Navigation successful");
      }
       else {
        console.log("Invalid credentials");
       }
  }
}
