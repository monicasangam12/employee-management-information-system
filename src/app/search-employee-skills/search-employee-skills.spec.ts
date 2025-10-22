import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEmployeeSkills } from './search-employee-skills';

describe('SearchEmployeeSkills', () => {
  let component: SearchEmployeeSkills;
  let fixture: ComponentFixture<SearchEmployeeSkills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchEmployeeSkills]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchEmployeeSkills);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
