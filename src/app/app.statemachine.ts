import { Injectable } from "@angular/core";
export enum STATE{ 
        /* Page/Form/List/Checkbox*/
    NONE,
    HOME,
    LOGIN,
    REGISTER,
    DASHBOARD_NO_SELECTION,
    DASHBOARD_ONE_SELECTION,
    DASHBOARD_MORE_THAN_ONE_SELECTION,
    SEARCH,
    ADD,
    EDIT,
 }

export enum ACTION { 
        /* Buttons-Submits/Verbs*/
    NONE,                       //0
    GO_REGISTER,                //1
    SUBMIT_REGISTER,            //2
    GO_LOGIN,                   //3
    SUBMIT_LOGIN,               //4
    GO_DASHBOARD,               //5
    SUBMIT_SELECT,              //6
    SUBMIT_UNSELECT,            //7
    GO_SEARCH,                  //8
    SUBMIT_SEARCH,              //9
    SUBMIT_FILTER,              //10
    SUBMIT_SORT,                //11
    GO_ADD,                     //12
    SUBMIT_ADD,                 //13
    GO_EDIT,                    //14
    SUBMIT_EDIT,                //15
    SUBMIT_DELETE,              //16
    LOGOUT                      //17    
 }
 export interface STATE_MACHINE_STEP {
    from:STATE,
    to:STATE,
    action:ACTION
 }

 

const stateMachine =  [
  { from: STATE.HOME, to: STATE.REGISTER, action: ACTION.GO_REGISTER },
  { from: STATE.LOGIN, to: STATE.REGISTER, action: ACTION.GO_REGISTER },
  { from: STATE.REGISTER, to: STATE.HOME, action: ACTION.SUBMIT_REGISTER },
  { from: STATE.REGISTER, to: STATE.LOGIN, action: ACTION.SUBMIT_REGISTER },
  { from: STATE.HOME, to: STATE.LOGIN, action: ACTION.GO_LOGIN },

  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_SELECT },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_SELECT },
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_SELECT },
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_UNSELECT },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_UNSELECT },

  { from: STATE.LOGIN, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_LOGIN },

  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_SORT },
  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_FILTER },

  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.SEARCH, action: ACTION.GO_SEARCH },
  { from: STATE.SEARCH, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_SEARCH },
  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.ADD, action: ACTION.GO_ADD },
  { from: STATE.ADD, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_ADD },


  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.HOME, action: ACTION.LOGOUT },

  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_UNSELECT },

  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_SORT },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_FILTER },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_DELETE }, 
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.SEARCH, action: ACTION.GO_SEARCH },
  { from: STATE.SEARCH, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_SEARCH },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.ADD, action: ACTION.GO_ADD },
  { from: STATE.ADD, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_ADD },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.EDIT, action: ACTION.GO_EDIT }, 
  { from: STATE.EDIT, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_EDIT },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.HOME, action: ACTION.LOGOUT },

  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_SORT },
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_FILTER },
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_DELETE }, 
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.SEARCH, action: ACTION.GO_SEARCH },
  { from: STATE.SEARCH, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_SEARCH },
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.ADD, action: ACTION.GO_ADD },
  { from: STATE.ADD, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_ADD },


  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.HOME, action: ACTION.LOGOUT },
];

const stateMap = new Map([
    [STATE.REGISTER, 'add-employee/0'],
    [STATE.ADD, 'add-employee/'],
    [STATE.LOGIN, 'login'],
    [STATE.EDIT, 'edit-employee/'],
    [STATE.SEARCH, 'search-employees-skill'],
    [STATE.DASHBOARD_NO_SELECTION, 'employees'],
   

])

@Injectable({
    providedIn: 'root'
})
export class StateMachineService {

    currentMachineStep:STATE_MACHINE_STEP = { from: STATE.HOME, to: STATE.HOME, action: ACTION.NONE };

    getCurrentState() {
        return this.currentMachineStep.to;
    }

    getNextState(action: ACTION) {
        console.log(this.currentMachineStep);
        let nextState:STATE = STATE.NONE;
        stateMachine.forEach(step => {
            if(this.currentMachineStep.from == step.from && action == step.action)
                nextState = step.to;
        })
        return stateMap.get(nextState)
    }

    goNextState(action: ACTION) {
        console.log("currentState = ", this.currentMachineStep);
        let nextState:STATE = STATE.NONE;
        let stepFound!:STATE_MACHINE_STEP;
        stateMachine.forEach(step => {
            console.log("Step", step)
            if(this.currentMachineStep.to == step.from && action == step.action) {
                stepFound = step;
                nextState = step.to;
            }
        })
          console.log("old currentState = ", stepFound);
        this.currentMachineStep = stepFound;
        console.log("new currentState = ", this.currentMachineStep);
        return stateMap.get(nextState)
    }

    getPageActions() {
        this.currentMachineStep.from;
        let actionList:ACTION[] = [];
        stateMachine.forEach(step => {
            if(this.currentMachineStep.to == step.from )
                actionList.push(step.action)
        })
        return actionList;
    }

    getAllActions():(string|ACTION) [] {
        let actionList:ACTION[] = [];
        Object.values(ACTION).forEach(entry => {
            if(!Number.isNaN(Number(entry)) ) {
                //console.log('action number = ', Number(entry) ,'action string = ', ACTION[Number(entry)],'action none? = ', ACTION[Number(entry)] =='NONE' );
                if(ACTION[Number(entry)] !='NONE' )
                   actionList.push(Number(entry));
            }
        })
       return actionList;
    }
}
import { Injectable } from "@angular/core";
export enum STATE{ 
        /* Page/Form/List/Checkbox*/
    NONE,
    HOME,
    LOGIN,
    REGISTER,
    DASHBOARD_NO_SELECTION,
    DASHBOARD_ONE_SELECTION,
    DASHBOARD_MORE_THAN_ONE_SELECTION,
    SEARCH,
    ADD,
    EDIT,
 }

export enum ACTION { 
        /* Buttons-Submits/Verbs*/
    NONE,                       //0
    GO_REGISTER,                //1
    SUBMIT_REGISTER,            //2
    GO_LOGIN,                   //3
    SUBMIT_LOGIN,               //4
    GO_DASHBOARD,               //5
    SUBMIT_SELECT,              //6
    SUBMIT_UNSELECT,            //7
    GO_SEARCH,                  //8
    SUBMIT_SEARCH,              //9
    SUBMIT_FILTER,              //10
    SUBMIT_SORT,                //11
    GO_ADD,                     //12
    SUBMIT_ADD,                 //13
    GO_EDIT,                    //14
    SUBMIT_EDIT,                //15
    SUBMIT_DELETE,              //16
    LOGOUT                      //17    
 }
 export interface STATE_MACHINE_STEP {
    from:STATE,
    to:STATE,
    action:ACTION
 }

 

const stateMachine =  [
  { from: STATE.HOME, to: STATE.REGISTER, action: ACTION.GO_REGISTER },
  { from: STATE.LOGIN, to: STATE.REGISTER, action: ACTION.GO_REGISTER },
  { from: STATE.REGISTER, to: STATE.HOME, action: ACTION.SUBMIT_REGISTER },
  { from: STATE.REGISTER, to: STATE.LOGIN, action: ACTION.SUBMIT_REGISTER },
  { from: STATE.HOME, to: STATE.LOGIN, action: ACTION.GO_LOGIN },

  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_SELECT },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_SELECT },
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_SELECT },
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_UNSELECT },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_UNSELECT },

  { from: STATE.LOGIN, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_LOGIN },

  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_SORT },
  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_FILTER },

  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.SEARCH, action: ACTION.GO_SEARCH },
  { from: STATE.SEARCH, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_SEARCH },
  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.ADD, action: ACTION.GO_ADD },
  { from: STATE.ADD, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_ADD },


  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.HOME, action: ACTION.LOGOUT },

  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_UNSELECT },

  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_SORT },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_FILTER },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_DELETE }, 
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.SEARCH, action: ACTION.GO_SEARCH },
  { from: STATE.SEARCH, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_SEARCH },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.ADD, action: ACTION.GO_ADD },
  { from: STATE.ADD, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_ADD },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.EDIT, action: ACTION.GO_EDIT }, 
  { from: STATE.EDIT, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_EDIT },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.HOME, action: ACTION.LOGOUT },

  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_SORT },
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_FILTER },
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_DELETE }, 
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.SEARCH, action: ACTION.GO_SEARCH },
  { from: STATE.SEARCH, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_SEARCH },
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.ADD, action: ACTION.GO_ADD },
  { from: STATE.ADD, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_ADD },


  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.HOME, action: ACTION.LOGOUT },
];

const stateMap = new Map([
    [STATE.REGISTER, 'add-employee/0'],
    [STATE.ADD, 'add-employee/'],
    [STATE.LOGIN, 'login'],
    [STATE.EDIT, 'edit-employee/'],
    [STATE.SEARCH, 'search-employees-skill'],
    [STATE.DASHBOARD_NO_SELECTION, 'employees'],
   

])

@Injectable({
    providedIn: 'root'
})
export class StateMachineService {

    currentMachineStep:STATE_MACHINE_STEP = { from: STATE.HOME, to: STATE.HOME, action: ACTION.NONE };

    getCurrentState() {
        return this.currentMachineStep.to;
    }

    getNextState(action: ACTION) {
        console.log(this.currentMachineStep);
        let nextState:STATE = STATE.NONE;
        stateMachine.forEach(step => {
            if(this.currentMachineStep.from == step.from && action == step.action)
                nextState = step.to;
        })
        return stateMap.get(nextState)
    }

    goNextState(action: ACTION) {
        console.log("currentState = ", this.currentMachineStep);
        let nextState:STATE = STATE.NONE;
        let stepFound!:STATE_MACHINE_STEP;
        stateMachine.forEach(step => {
            console.log("Step", step)
            if(this.currentMachineStep.to == step.from && action == step.action) {
                stepFound = step;
                nextState = step.to;
            }
        })
          console.log("old currentState = ", stepFound);
        this.currentMachineStep = stepFound;
        console.log("new currentState = ", this.currentMachineStep);
        return stateMap.get(nextState)
    }

    getPageActions() {
        this.currentMachineStep.from;
        let actionList:ACTION[] = [];
        stateMachine.forEach(step => {
            if(this.currentMachineStep.to == step.from )
                actionList.push(step.action)
        })
        return actionList;
    }

    getAllActions():(string|ACTION) [] {
        let actionList:ACTION[] = [];
        Object.values(ACTION).forEach(entry => {
            if(!Number.isNaN(Number(entry)) ) {
                //console.log('action number = ', Number(entry) ,'action string = ', ACTION[Number(entry)],'action none? = ', ACTION[Number(entry)] =='NONE' );
                if(ACTION[Number(entry)] !='NONE' )
                   actionList.push(Number(entry));
            }
        })
       return actionList;
    }
}
