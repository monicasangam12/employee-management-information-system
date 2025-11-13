import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEntitySkillsComponent } from './search-entity-skills';

describe('SearchEntitySkillsComponent', () => {
  let component: SearchEntitySkillsComponent;
  let fixture: ComponentFixture<SearchEntitySkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchEntitySkillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchEntitySkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
