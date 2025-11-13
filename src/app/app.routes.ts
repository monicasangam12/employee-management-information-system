import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage';
import { LoginComponent } from './login/login';
import { EntitysComponent } from './entitys/entitys';
// import { SearchEntitysSkillComponent } from './search-Entitys-skill/search-Entitys-skill';
import { AddUpdateEntityComponent } from './add-update-entity/add-update-entity';
import { SearchEntitySkillsComponent } from './search-entity-skills/search-entity-skills';




export const routes: Routes =  [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: 'homepage', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'entitys', component: EntitysComponent },
  { path: 'add-update-entity/:entityId', component: AddUpdateEntityComponent},
  { path: 'edit-update-entity/:entityId', component: AddUpdateEntityComponent},
  { path: 'search-entity-skills', component: SearchEntitySkillsComponent},
];