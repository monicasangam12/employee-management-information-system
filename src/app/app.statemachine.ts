import { Injectable } from "@angular/core";
export enum STATE{ 
        /* Page/Form/List/Checkbox*/
    NONE,                                   //0
    HOME,                                   //1
    LOGIN,                                  //2
    REGISTER,                               //3
    DASHBOARD_NO_SELECTION,                 //4
    DASHBOARD_ONE_SELECTION,                //5
    DASHBOARD_MORE_THAN_ONE_SELECTION,      //6
    SEARCH,                                 //7
    ADD,                                    //8
    EDIT,                                   //9
    MAP,                                    //10
    ANY,                                    //11
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
    GO_MAP,                     //17
    SUBMIT_MAP,                 //18
    MENU_GO_HOME,               //19
    MENU_GO_REGISTER,           //20
    MENU_GO_LOGIN,              //21
    MENU_GO_DASHBOARD,          //22 
    MENU_SUBMIT_LOGOUT           //23
 }
 export interface STATE_MACHINE_STEP {
    from:STATE,
    to:STATE,
    action:ACTION
 }

 

const stateMachine:STATE_MACHINE_STEP[] =  [
  { from: STATE.HOME, to: STATE.HOME, action: ACTION.MENU_GO_HOME },

  { from: STATE.LOGIN, to: STATE.HOME, action: ACTION.MENU_GO_HOME },
  { from: STATE.REGISTER, to: STATE.HOME, action: ACTION.MENU_GO_HOME },
 
  // Menu Navigation
  { from: STATE.HOME, to: STATE.LOGIN, action: ACTION.MENU_GO_LOGIN },
  { from: STATE.HOME, to: STATE.REGISTER, action: ACTION.MENU_GO_REGISTER },
  { from: STATE.LOGIN, to: STATE.REGISTER, action: ACTION.MENU_GO_REGISTER },
  { from: STATE.ANY, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.MENU_GO_DASHBOARD },
  { from: STATE.ANY, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.MENU_GO_DASHBOARD },
  { from: STATE.ANY, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.MENU_GO_DASHBOARD },

  //HOME Navigation (Pre Login)
  { from: STATE.HOME, to: STATE.REGISTER, action: ACTION.GO_REGISTER },
  { from: STATE.LOGIN, to: STATE.REGISTER, action: ACTION.GO_REGISTER },

  { from: STATE.REGISTER, to: STATE.HOME, action: ACTION.SUBMIT_REGISTER },
  { from: STATE.REGISTER, to: STATE.LOGIN, action: ACTION.SUBMIT_REGISTER },
  { from: STATE.HOME, to: STATE.LOGIN, action: ACTION.GO_LOGIN },

  //DASHBOARD Selection Changes
  { from: STATE.LOGIN, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_LOGIN },
  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_SELECT },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_SELECT },
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_SELECT },
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_UNSELECT },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_UNSELECT },
  
  //DASHBOARD_NO_SELECTION
  

  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_SORT },
  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_FILTER },

  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.SEARCH, action: ACTION.GO_SEARCH },
  { from: STATE.SEARCH, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_SEARCH },
  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.ADD, action: ACTION.GO_ADD },
  { from: STATE.ADD, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.MENU_SUBMIT_LOGOUT },
  { from: STATE.ADD, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_ADD },

  { from: STATE.DASHBOARD_NO_SELECTION, to: STATE.HOME, action: ACTION.MENU_SUBMIT_LOGOUT },

  //DASHBOARD_ONE_SELECTION


  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_SORT },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_FILTER },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_DELETE }, 
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.SEARCH, action: ACTION.GO_SEARCH },
  { from: STATE.SEARCH, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_SEARCH },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.ADD, action: ACTION.GO_ADD },
  { from: STATE.ADD, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.MENU_SUBMIT_LOGOUT },
  { from: STATE.ADD, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.SUBMIT_ADD },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.EDIT, action: ACTION.GO_EDIT }, 
  { from: STATE.EDIT, to: STATE.DASHBOARD_ONE_SELECTION, action: ACTION.MENU_SUBMIT_LOGOUT },
  { from: STATE.EDIT, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_EDIT },
  { from: STATE.DASHBOARD_ONE_SELECTION, to: STATE.HOME, action: ACTION.MENU_SUBMIT_LOGOUT },

  //DASHBOARD_MORE_THAN_ONE_SELECTION
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_SORT },
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_FILTER },
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.DASHBOARD_NO_SELECTION, action: ACTION.SUBMIT_DELETE }, 
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.SEARCH, action: ACTION.GO_SEARCH },
  { from: STATE.SEARCH, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_SEARCH },
  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.ADD, action: ACTION.GO_ADD },
  { from: STATE.ADD, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.MENU_SUBMIT_LOGOUT },
  { from: STATE.ADD, to: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, action: ACTION.SUBMIT_ADD },


  { from: STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, to: STATE.HOME, action: ACTION.MENU_SUBMIT_LOGOUT},

    { from: STATE.ADD, to: STATE.MAP, action: ACTION.GO_MAP },
];

const stateMap = new Map([
    [STATE.HOME, 'homepage'],
    [STATE.REGISTER, 'add-update-entity/-1'],
    [STATE.ADD, 'add-update-entity/0'],
    [STATE.LOGIN, 'login'],
    [STATE.EDIT, 'edit-update-entity/'],
    [STATE.SEARCH, 'search-entitys-skill'],
    [STATE.DASHBOARD_NO_SELECTION, 'entitys'],
    [STATE.DASHBOARD_ONE_SELECTION, 'entitys'],
    [STATE.DASHBOARD_MORE_THAN_ONE_SELECTION, 'entitys'],
])

@Injectable({
    providedIn: 'root'
})
export class StateMachineService {

    currentMachineStep:STATE_MACHINE_STEP = { from: STATE.HOME, to: STATE.HOME, action: ACTION.MENU_GO_HOME };

    // stateMachineStepStack :STATE_MACHINE_STEP [] =  [];
    stepFoundList :STATE_MACHINE_STEP [] =  [];

    constructor() {
        console.log("CONSTRUCTOR::StateMachineService")
        this.restoreSessionState();
        //let statemachineLocal:STATE_MACHINE_STEP[] = stateMachine;
        //let flowSteps = this.scanStateMachineFlows(this.currentMachineStep, statemachineLocal,0);
        //this.printFlow(flowSteps);
    }

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
        console.log("currentState = ", this.printStep(this.currentMachineStep));
        let nextState:STATE = STATE.NONE;
        let stepFound!:STATE_MACHINE_STEP;
       
        this.stepFoundList = []
        // stateMachine.forEach(step => {
        //     if(this.currentMachineStep.to == step.from && action == step.action) { 
        //           stepFound = step;
        //         nextState = step.to;
        //         this.stepFoundList.push(stepFound)
        //     }
        // })

        this.stepFoundList  = stateMachine.filter(step => this.currentMachineStep.to == step.from && action == step.action)
        console.log("this.stepFoundList   = ", this.printSteps(this.stepFoundList) , " this.stepFoundList  = ", this.stepFoundList)
        
        if(this.stepFoundList.length>1) {
            console.log("Multiple possible steps found for action ", ACTION[action], " from state ", STATE[this.currentMachineStep.to]);    
            // this.stepFoundList.forEach( stepItem => {
            //     console.log("Possible Step: ", this.printStep(stepItem));
            //     if(stepItem.to == this.currentMachineStep.from) {  
            //         // If we found a matching step, we can use it
            //         stepFound = stepItem;
            //         nextState = stepItem.to;
            //     }   
            // });
            this.stepFoundList = this.stepFoundList.filter(stepItem => stepItem.to == this.currentMachineStep.from)
        }

        if(this.stepFoundList.length==0) {
            console.log("MISSING: step.from ", STATE[this.currentMachineStep.to]," step.action ", ACTION[action]);
            return undefined;
        }
        else if(this.stepFoundList.length==1) {
            stepFound = this.stepFoundList[0];
            nextState = stepFound.to;
        }
        else {
            console.log("MULTIPLE: ", this.printSteps(this.stepFoundList));
            return undefined;
        }

        console.log("old currentState = ", this.printStep(this.currentMachineStep));
        this.currentMachineStep = stepFound;
        console.log("new currentState = ", this.printStep(this.currentMachineStep));
        this.saveSessionState();
        return stateMap.get(nextState)
    }

    getPageActions() {
        this.currentMachineStep.from;
        let actionList:ACTION[] = [];
        let  stepsFound = stateMachine.filter(step => this.currentMachineStep.to == step.from )
        stepsFound.forEach(step =>  {
            console.log("PageActionSteps ", this.printStep(step));
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

    restoreSessionState() {
        const raw = sessionStorage.getItem("currentMachineStep");
        if (!raw) {
            console.log("No session state to restore");
            return;
        }
        try {
            const sessionData = JSON.parse(raw) as STATE_MACHINE_STEP;
            console.log("Restoring session state: ", sessionData);
            this.currentMachineStep = sessionData;
        } catch (e) {
            console.warn("Failed to parse session state:", e);
        }
    }

    saveSessionState() {
        sessionStorage.setItem("currentMachineStep", JSON.stringify(this.currentMachineStep));
    }

    private printStep(step: STATE_MACHINE_STEP): string {
        return `{from: ${STATE[step.from]}, to: ${STATE[step.to]}, action: ${ACTION[step.action]}}`;
    }

    private printPathStep(pathstep: {path:number, step:STATE_MACHINE_STEP}): string {
        return `{path: ${pathstep.path}, from: ${STATE[pathstep.step.from]}, to: ${STATE[pathstep.step.to]}, action: ${ACTION[pathstep.step.action]}}`;
    }

    private printSteps(steps: STATE_MACHINE_STEP[]): string {
        let info  =  '';
        steps.forEach(step  =>
            {
                info += (this.printStep(step) + '\n')
            }
        ) 
        return info
    }

    // Recursive function to scan state machine flows
    // Each flow should maintain a flowstep down the thread
    // a thread can originate from Home or dashboard states?
    // 
    scanStateMachineFlows(startStep:STATE_MACHINE_STEP, statemachineLocal:STATE_MACHINE_STEP[], path:number) {
        console.log("Scanning state machine flows...");
        let  currentState:STATE = startStep.to;
        let  fromSteps :STATE_MACHINE_STEP [] = [];
        let  flowSteps :{path:number, step:STATE_MACHINE_STEP}[] = [];
        let  counter =0;
        let  index =0;
        
        do{
            console.log(" currentState = " , STATE[currentState])
            fromSteps  = stateMachine.filter(step => step.from == currentState  &&  step.to != STATE.HOME) as STATE_MACHINE_STEP [];
            console.log(" fromSteps = " , this.printSteps(fromSteps));
            if( fromSteps.length ==0) {
                console.log("No further steps from state ", STATE[currentState]);
                return flowSteps;
            }   
            fromSteps.forEach(step => {
                flowSteps.push({path, step});
                if(step.to!=STATE.HOME) {
                    counter++;
                    let foundIndex = statemachineLocal.findIndex(element  => element ==  step);
                    statemachineLocal.splice(foundIndex, 1);

                    flowSteps = this.scanStateMachineFlows(step, statemachineLocal, (path++) ) ;
     
                }
            });
            index++;
        }while(currentState!=STATE.HOME);
        return flowSteps;
    }

    printFlow(flowSteps: {path:number, step:STATE_MACHINE_STEP}[]) {
        let firstStep = true;
        let flowString = "\n";
        console.log("Flow Step:::::::: ");

        flowSteps.forEach(pathStep => {
            console.log("Flow Step:::::::: ", this.printPathStep(pathStep));
            
            // if(firstStep) {
            //     flowString =STATE[step.from]+"-("+ACTION[step.action]+")->"+STATE[step.to];
            //     firstStep = false;
            // } else {
            //     flowString += "-("+ACTION[step.action]+")->"+STATE[step.to];
            // }
        });
        //console.log("Flow: ", flowString);
    }
}
