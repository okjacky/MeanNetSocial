import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsChatComponent } from './ws-chat.component';

describe('WsChatComponent', () => {
  let component: WsChatComponent;
  let fixture: ComponentFixture<WsChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
