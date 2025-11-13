import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EntityService } from '../entity-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION, StateMachineService } from '../app.statemachine';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from "@angular/material/select";
import { HttpClient } from '@angular/common/http';
import { DataService } from '../app.dataservice'

@Component({
  selector: 'app-add-update-entity1',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  providers: [EntityService, HttpClient, StateMachineService],
  templateUrl: './add-update-entity.html',
  styleUrl: './add-update-entity.css',
})

export class AddUpdateEntityComponent {

  /***************************
   *     INITIALIZE          *
  ****************************/
  entityId:number = 0;

  entityForm!: FormGroup;
  ACTION = ACTION;
  loading = true;
  entityObject!:any;
  entityName!:string;
  showField = false;

  constructor(
    private fb: FormBuilder,  
    private router: Router , 
    private httpClient:HttpClient,
    private entityService: EntityService,
    private stateMachineService: StateMachineService, 
    private route: ActivatedRoute,
    private dataService: DataService)  {

    if((this.router.currentNavigation()?.extras.state)) {
      this.entityName = JSON.parse(JSON.stringify(this.router.currentNavigation()?.extras.state))['dataKey'];
      console.log("RouteNavigation :: this.entityName = ", this.entityName)
    }
    else
    if(!(this.entityName!=null && this.entityName.length>0)) {
      this.dataService.currentMessage.subscribe(msg => {
        this.entityName = ((JSON.parse(msg)) as {entityName:string}).entityName;
        console.log("DataService:: this.entityName = ", this.entityName)
      });
    }
    this.entityService.setEntityName(this.entityName); 


  }

  /***************************
   *     LIFE CYCLE EVENTS   *
  ****************************/
  ngOnInit() {
    let entityIdString = this.route.snapshot.paramMap.get('entityId');



    console.log("entityIdString" , entityIdString)
    console.log("Number(entityIdString)" , Number(entityIdString))
    console.log("!isNaN(Number(entityIdString))" , !isNaN(Number(entityIdString)))

    if(entityIdString && !isNaN(Number(entityIdString))){
      this.entityId = Number(entityIdString);
    }
    else {
        console.log("Entity ID is not a valid number");
        this.entityId = 0;
    }

    if(this.entityId==-1  || this.entityId==0) {
      this.addEntity(this.entityId);
    }
    else{
      this.editEntity(this.entityId);
    }



    this.entityForm = new FormGroup({});
    
    this.httpClient.get("/"+this.entityName+".json").subscribe(data => {
        console.log("data = ",data)
        let entityObject!:any;
        entityObject = JSON.parse(JSON.stringify(data));

        
        for (const key in entityObject) {
          if(entityObject.hasOwnProperty(key)) {
            console.log(entityObject[key]["value"])
            console.log(entityObject[key]["dataType"])
            console.log(key)
            console.log("this.matchesRegexID(key)  = ",  this.matchesRegexID(key));
            if(this.matchesRegexExtID(key)) {
              console.log("Mapping key ", key , " entityObject[key] = ", entityObject[key])
              //make them read only
              this.entityForm.addControl(this.idPrefix(key), new FormControl(this.getFormFieldValue(entityObject[key])))
              // this.entityForm.addControl(key, new FormControl(this.getFormFieldValue(entityObject['description'])))
            }
            this.entityForm.addControl(key, new FormControl(this.getFormFieldValue(entityObject[key]), this.getFormFieldValidators(entityObject[key])))
          }
        }
        console.log("this.entityForm  = ",this.entityForm )
        this.entityObject = entityObject
        this.loading =  false;
    });

    console.log("Add Entity Form Initialized", this.entityForm.value);
  }

  ngAfterViewInit(){
    this.updateButtonState();
  }

  updateButtonState() {
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

  addEntity(entityId:number){ 
    //form has no initial values
  }

  editEntity(entityId:number){ 
    //patch the  form values
    this.httpClient.get("/"+this.entityName+".json").subscribe(data => {
      this.entityService.getById(entityId).subscribe((entityData: Entity |  undefined) => {
        let entityObject!:any;
        entityObject = JSON.parse(JSON.stringify(data));
        for (const key in entityObject) {
          let entityDbObject!:any;
          if(entityObject.hasOwnProperty(key)) {
            entityDbObject = JSON.parse(JSON.stringify(entityData));
            this.entityForm.patchValue({key:(entityDbObject?entityDbObject[key]:"")});
          }
        }
      })
    })
   
  }


  /***************************
   *     EVENT HANDLERS      *
  ****************************/

  go(event:any){
    const url = this.stateMachineService.goNextState(event.target.id);
    if (url)this.router.navigateByUrl(url, { state: { dataKey: this.entityName, anotherData: 123 } })
  }

  submitRegister(event:any){
    console.log(this.entityId)
    console.log("Entity Form Submitted", this.entityForm.value);

    if(this.entityForm.valid){
      console.log("Form Submitted Successfully value",this.entityForm.value);
      console.log("Form Submitted Successfully id",this.entityForm.value.id);

      this.entityForm.value.id=-1
      this.entityForm.value.id = undefined;
      this.entityService.create(this.entityForm.value).subscribe({
        next: (response: Entity) => {
          console.log(response);
          console.log("Entity registered successfully", response);
          this.go(event);
        },
        error: (error: string) => {
          console.log(error);
          console.error("Error during registration", error);
        }
      })
    }
    else{
      console.log("Registration form is not valid ", this.entityForm.valid);        
      console.log("Registration form is not valid ", this.entityForm.errors);        
    } 
  }

  submitAdd(event:any){
    console.log("Entity Form Submitted", this.entityForm.value);

    if(this.entityForm.valid){
      console.log("Form Submitted Successfully value",this.entityForm.value);
      console.log("Form Submitted Successfully id",this.entityForm.value.id);

      this.entityForm.value.id=0
      this.entityForm.value.id = undefined;
      this.entityService.create(this.entityForm.value).subscribe({
        next: (response: Entity) => {
          console.log(response);
          console.log("Entity registered successfully", response);
          this.go(event);
        },
        error: (error: string) => {
          console.log(error);
          console.error("Error during registration", error);
        }
      })
    }
    else{
      console.log("Add Form is not valid ", this.entityForm.valid);        
    }
  }

  submitEdit(event:any){
    console.log("Entity Form Submitted", this.entityForm.value);

    if(this.entityForm.valid){
      console.log("Form Submitted Successfully value",this.entityForm.value);
      console.log("Form Submitted Successfully id",this.entityForm.value.id);

      this.entityService.update(this.entityForm.value.id, this.entityForm.value).subscribe({
        next: (response: Entity) => {
          console.log(response);
          console.log("Entity updated successfully", response);
          this.go(event);
        },
        error: (error: string) => {
          console.log(error);
          console.error("Error during update", error);
        }
      });
    
    }
    else {
      console.log("Edit Form is not valid ", this.entityForm.valid); 
    }
  }

  /***************************
   *     Entity UTILS        *
  ****************************/

  getEntityObjectKeys(entityObject: object): string[] {
    return Object.keys(entityObject);
  } 

  getEntityObjectMap(entityObject: any)
  {
    let  values : any[]  = [];
    let  valueMap   = new Map();
    for (const key in entityObject) {
      console.log(" key = ", key)
      if(entityObject.hasOwnProperty(key)) {
        let value = JSON.parse(JSON.stringify(entityObject[key]));
        console.log(`${key}: ${value}`);
         
        values.push(value)
        valueMap.set(key, value)
      }
    }
    return valueMap;
  }

  /***************************
   *  Form Field Value UTILS *
  ****************************/
  getJSONArray(arrayString:any) {
    return JSON.parse(arrayString)    
  }
  getMapControlId(controls:any, key:any){
    let valueString:string = controls[key].value;
    let values  = JSON.parse(valueString)
    values.forEach((value: any) => {
      for (key in value)  {
        console.log("key , value = ",key, " , ", value[key])
      }
    }) 
  }
  getMapControlValue(controls:any, key:any){
    let valueString:string = controls[key].value;
    let values  = JSON.parse(valueString)
    values.forEach((value: any) => {
      for (key in value)  {
        console.log("key , value = ",key, " , ", value[key])
      }
    }) 
  }
  getFormFieldValue(entityAttributeInfo:any) {
    console.log("entityAttributeInfo[\"formMaxLength\"] = ", entityAttributeInfo["formMaxLength"])
    console.log("randomText = ", this.filterSpecialChar(Math.random().toString(36).substring(1, (entityAttributeInfo["formMaxLength"])/2)))
    let  randomText = this.filterSpecialChar(Math.random().toString(36).substring(1, (entityAttributeInfo["formMaxLength"])/2));
    let randomEmail = randomText +"@"+randomText+".com"
    let test = false;
    if(test) {
       console.log("test mode");
      switch(entityAttributeInfo["dataType"]) {
        case "string":
          return this.filterSpecialChar(Math.random().toString(36).substring(1, entityAttributeInfo["formMaxLength"]));
        case "number":
          return this.getRandomIntInclusive(entityAttributeInfo["formMinValue"], entityAttributeInfo["formMaxValue"]);
        case "date":
          return this.generateRandomDate();
        case "boolean":
          return Math.round(Math.random());
        case "email":
          return entityAttributeInfo["value"];  
        case "id":
          return entityAttributeInfo["value"];  
        default:
          return randomText;
      }
    }
    else  {
      console.log("not in test mode");
      switch(entityAttributeInfo["dataType"]) {
        case "string":
          return entityAttributeInfo["value"];
        case "number":
          console.log("not in test mode ", entityAttributeInfo["value"]);
          return entityAttributeInfo["value"];
        case "date":
          return entityAttributeInfo["value"];
        case "boolean":
          return entityAttributeInfo["value"];
        case "email":
          return entityAttributeInfo["value"];   
        case "id":
          return entityAttributeInfo["value"];  
        default:
          return randomText;
      }
    }
  }

  getRandomIntInclusive(min:number, max:number) {
      min = Math.ceil(min); // Ensure min is an integer
      max = Math.floor(max); // Ensure max is an integer
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

  generateRandomString(maxLength:number) {
    return Math.random().toString(36).substring(2, maxLength);
  }

  generateRandomDate() {
    const startDate = new Date('2020-01-01');
    const endDate = new Date();
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
    const randomDate = new Date(randomTimestamp);
    return randomDate;
  }

  filterSpecialChar(text:any) {
    return text.replace(/[^a-zA-Z0-9\s]/g, "");
  }

  /*******************************
   *  Form Field Valdiator UTILS *
  ********************************/

  getFormFieldValidators(entityAttributeInfo:any){

    let validators = [];

    if(entityAttributeInfo["formRequired"])
          validators.push(Validators.required);

    if(entityAttributeInfo["formMinLength"]>0)
          validators.push(Validators.minLength(entityAttributeInfo["formMinLength"]));

    if(entityAttributeInfo["formMaxLength"]>0)
          validators.push(Validators.maxLength(entityAttributeInfo["formMaxLength"]));

    if(entityAttributeInfo["formMinValue"]>0)
          validators.push(Validators.min(entityAttributeInfo["formMinValue"]));

    if(entityAttributeInfo["formMaxValue"]>0)
          validators.push(Validators.max(entityAttributeInfo["formMaxValue"]));
   
    if(entityAttributeInfo["formPattern"])
          validators.push(Validators.pattern(entityAttributeInfo["formPattern"]));
    
    if(entityAttributeInfo["formValidatorFunctions"].length>0) {
          let func = this[entityAttributeInfo["formValidatorFunctions"] as keyof this];
          if(typeof func  === 'function') 
            validators.push(func(/bob/i));     
    }

    return validators;
  }

  callFunctionByName(functionName: string, ...args: any[]) {
    // Type assertion to inform TypeScript that 'functionName' is a valid key
    const method = this[functionName as keyof this]; 

    if (typeof method === 'function') {
      method.apply(this, args); // Call the function with 'this' context and arguments
    } else {
      console.error(`Method '${functionName}' not found or is not a function.`);
    }
  }

  capitalizeFirstLetter(str:string) {
    if (typeof str !== 'string' || str.length === 0) {
      return str; // Handle non-string or empty inputs
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  matchesRegexID(value: string): boolean {
    return  /^id$/.test(value)
  }
  matchesRegexExtID(value: string): boolean {

    return  /Mapping$/.test(value)
  }
  matchesColumnEdit(value: string): boolean {
    return  /isEdit$/.test(value)
  }

  idPrefix(value: string ): string {
    const match = value.match(/^(.*?)Mapping$/i);
    if(match!=null)
     return match[1];
    else
      return value;
  }
}
//to avoid this context for fuunction pointer the fuction is  outside the class
//note funcPtr.appy(this, args)
export function  testValidatorFunction(nameRe: RegExp): ValidatorFn  {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  }
}


