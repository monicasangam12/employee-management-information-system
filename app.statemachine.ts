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
    NONE,
    GO_REGISTER,
    SUBMIT_REGISTER,
    GO_LOGIN,
    SUBMIT_LOGIN,
    GO_DASHBOARD,
    GO_SEARCH,
    SUBMIT_SEARCH,
    SUBMIT_FILTER,
    SUBMIT_SORT,
    GO_ADD,
    SUBMIT_ADD,
    GO_EDIT,
    SUBMIT_EDIT,
    SUBMIT_DELETE,
    LOGOUT
 }
 export interface STATE_MACHINE_STEP {
    from:STATE,
    to:STATE,
    action:ACTION
 }

 const currentMachineStep:STATE_MACHINE_STEP = { from: STATE.HOME, to: STATE.HOME, action: ACTION.NONE };

const stateMachine =  [
  { from: STATE.HOME, to: STATE.REGISTER, action: ACTION.GO_REGISTER },
  { from: STATE.LOGIN, to: STATE.REGISTER, action: ACTION.GO_REGISTER },
  { from: STATE.REGISTER, to: currentMachineStep.from, action: ACTION.SUBMIT_REGISTER },

  { from: STATE.HOME, to: STATE.LOGIN, action: ACTION.GO_LOGIN },

  { from: STATE.LOGIN, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_LOGIN },

  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_SORT },
  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_FILTER },
  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_DELETE }, 
  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.SEARCH, action: ACTION.GO_SEARCH },
  { from: STATE.SEARCH, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_SEARCH },
  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.ADD, action: ACTION.GO_ADD },
  { from: STATE.ADD, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_ADD },
  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.EDIT, action: ACTION.GO_EDIT }, 
  { from: STATE.EDIT, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_EDIT },
  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.HOME, action: ACTION.LOGOUT },


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
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.EDIT, action: ACTION.GO_EDIT }, 
  { from: STATE.EDIT, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_EDIT },
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.HOME, action: ACTION.LOGOUT },
];

const stateMap = new Map([
    [STATE.REGISTER, 'add-employee/0'],
    [STATE.ADD, 'add-employee/'],
    [STATE.LOGIN, 'login'],
    [STATE.EDIT, 'edit-employee/'],
    [STATE.SEARCH, 'search-employees-skill'],
    [STATE.DASHBOARD_NO_SELECTION, 'employees/'],
   

])

@Injectable({
    providedIn: 'root'
})
export class StateMachineService {
    getCurrentState() {
        return currentMachineStep.from;
    }

    getNextState(action: ACTION) {
        let nextState:STATE = STATE.NONE;
        stateMachine.forEach(step => {
            if(currentMachineStep.from == step.from && action == step.action)
                nextState = step.to;
        })
        return stateMap.get(nextState)
    }

    getPageActions() {
        currentMachineStep.from;
        let actionList:ACTION[] = [];
        stateMachine.forEach(step => {
            if(currentMachineStep.from == step.from )
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
