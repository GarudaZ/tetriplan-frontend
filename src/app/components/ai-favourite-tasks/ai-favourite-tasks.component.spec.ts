import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AIFavouriteTasksComponent } from './ai-favourite-tasks.component';

describe('AIFavouriteTasksComponent', () => {
  let component: AIFavouriteTasksComponent;
  let fixture: ComponentFixture<AIFavouriteTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AIFavouriteTasksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AIFavouriteTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
