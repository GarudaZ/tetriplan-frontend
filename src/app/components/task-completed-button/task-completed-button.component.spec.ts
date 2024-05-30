import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCompletedButtonComponent } from './task-completed-button.component';

describe('TaskCompletedButtonComponent', () => {
  let component: TaskCompletedButtonComponent;
  let fixture: ComponentFixture<TaskCompletedButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskCompletedButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskCompletedButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
