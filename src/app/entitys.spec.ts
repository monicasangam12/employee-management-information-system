import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitysComponent } from './entitys';

describe('EntityComponent', () => {
  let component: EntitysComponent;
  let fixture: ComponentFixture<EntitysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntitysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntitysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
