import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetConversationComponent } from './get-conversation.component';

describe('GetConversationComponent', () => {
  let component: GetConversationComponent;
  let fixture: ComponentFixture<GetConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetConversationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
